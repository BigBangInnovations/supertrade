import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap, filter, first } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EncrDecrServiceService } from '../../../core/auth/_services/encr-decr-service.service'
import { environment } from '../../../../environments/environment';
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { Logout } from '../../../core/auth';
import { HttpParams } from "@angular/common/http";
import { ReportsService } from '../../../core/reports'
import { saveAs } from 'file-saver';
import { Product } from "../../../core/product/_models/product.model";
import { ProductService } from "../../../core/product/_services";
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../core/reducers';
import * as fromProduct from "../../../core/product";

@Component({
  selector: 'kt-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})

export class ReportsComponent implements OnInit {
  reportsForm: FormGroup;
  userData: any;
  loading = false;
  private unsubscribe: Subject<any>;
  fileData: File = null;
  isProductloaded$: Observable<boolean>;
	viewLoading$: Observable<boolean>;
  categories$: Observable<Product[]>;
  productArray;
  
  /**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param reportsFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param layoutConfigService: LayoutConfigService
   * @param EncrDecr: EncrDecrServiceService
   * @param cdr
	 */
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private reportsFB: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private layoutConfigService: LayoutConfigService,
    private EncrDecr: EncrDecrServiceService,
    private cdr: ChangeDetectorRef,
    private reportsService: ReportsService,
    private http: HttpClient,
    private ProductSer: ProductService,
  ) { 
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    let sessionStorage = this.EncrDecr.getLocalStorage(environment.localStorageKey);
    this.userData = JSON.parse(sessionStorage);

    this.store
			.select(fromProduct.selectProductLoaded)
			.pipe()
			.subscribe(data => {
				if (data) {
					this.categories$ = this.store.pipe(
						select(fromProduct.selectAllProducts)
					);
				} else {
					this.store.dispatch(new fromProduct.LoadProducts());
					// this.categories$ = this.store.pipe(select(fromProduct.selectAllProducts));
				}
				if (data) {
					this.categories$
						.pipe(first())
						.subscribe(categoryDataArray => {
							this.resetProduct(categoryDataArray);
						});
				}
			});
		this.viewLoading$ = this.store.pipe(
			select(fromProduct.selectProductLoading)
    );
    
    this.createForm();

  }

  resetProduct(categoryDataArray) {
		this.productArray = [];
		categoryDataArray.forEach(categoryDataRow => {
			categoryDataRow.subcategories.forEach(subcategoriesArray => {
				subcategoriesArray.products.forEach(productsArray => {
					this.productArray.push(productsArray);
				});
			});
		});
	}

  	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
  }
  
  	/**
	 * Create form
	 */
  createForm() {
    this.reportsForm = this.reportsFB.group({
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      report_type: ['', Validators.required],
      product_id: [''],
    });
  }

  /**
* Checking control validation
*
* @param controlName: string => Equals to formControlName
* @param validationType: string => Equals to valitors name
*/
isControlHasError(controlName: string, validationType: string): boolean {
  const control = this.reportsForm.controls[controlName];
  if (!control) {
    return false;
  }
  const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
}


/**
	 * Form Submit
	 */
	submit() {
		const controls = this.reportsForm.controls;
		/** check form */
		if (this.reportsForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const values = this.reportsForm.value;
		const keys = Object.keys(values);

		let httpParams = new HttpParams();
		Object.keys(values).forEach(function (key) {
			httpParams = httpParams.append(key, values[key]);
    });
    
    this.reportsService
      .exportReports(httpParams)
      .pipe(
        tap(response => {
          if (response.status == APP_CONSTANTS.response.SUCCESS) {
            const message = `Your Report download shortly.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
            
            if(response.data_url != ''){
              let name  = response.data_url.split('\\');
              saveAs(response.data_url, name[name.length - 1]);
            }
          } else if (response.status == APP_CONSTANTS.response.ERROR) {
            const message = response.message;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
            if(response.errors){
              Object.keys(response.errors).forEach(function (controlName) {
                controls[controlName].setErrors({'incorrect': response.errors[controlName]})
                console.log(controls[controlName]);
              });
            }
          } else {
            const message = 'Invalid token! Please login again';
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
            this.store.dispatch(new Logout());
          }
        }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }
  
  // downloadFile(){
  //   saveAs("https://supersales.co:8443/salespro/attachments/product/AttendanceLog_871303.xlsx", "AttendanceLog_871303.xlsx");
  // }

}