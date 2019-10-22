import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EncrDecrServiceService } from '../../../core/auth/_services/encr-decr-service.service'
import { environment } from '../../../../environments/environment';
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { Logout } from '../../../core/auth';
import { HttpParams } from "@angular/common/http";
import { OpeningStockService } from '../../../core/openingStock'
import { saveAs } from 'file-saver';

@Component({
  selector: 'kt-opening-stock',
  templateUrl: './opening-stock.component.html',
  styleUrls: ['./opening-stock.component.scss']
})
export class OpeningStockComponent implements OnInit {
  openingStockForm: FormGroup;
  userData: any;
  loading = false;
  private unsubscribe: Subject<any>;
  fileData: File = null;

  /**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param openingStockFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param layoutConfigService: LayoutConfigService
   * @param EncrDecr: EncrDecrServiceService
   * @param cdr
	 */
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private openingStockFB: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private layoutConfigService: LayoutConfigService,
    private EncrDecr: EncrDecrServiceService,
    private cdr: ChangeDetectorRef,
    private openingStock: OpeningStockService,
    private http: HttpClient,
  ) { 
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    let sessionStorage = this.EncrDecr.getLocalStorage(environment.localStorageKey);
    this.userData = JSON.parse(sessionStorage)
    this.createForm();
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
    this.openingStockForm = this.openingStockFB.group({
      RowCount: ['', Validators.required],
      file: ['', Validators.required],
    });
  }

  /**
* Checking control validation
*
* @param controlName: string => Equals to formControlName
* @param validationType: string => Equals to valitors name
*/
isControlHasError(controlName: string, validationType: string): boolean {
  const control = this.openingStockForm.controls[controlName];
  if (!control) {
    return false;
  }
  const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
}

  onFileChange(fileInput: any) {
    
    
    // const reader = new FileReader();
    // if(event.target.files && event.target.files.length) {
      // let fileList:FileList = event.target.files;
      // let file = files.item(0);
      // console.log(file);
      this.fileData = <File>fileInput.target.files[0];
      this.openingStockForm.patchValue({
        file: <File>fileInput.target.files[0]
     });

      // const [file] = event.target.files;
      // reader.readAsDataURL(file);

      // reader.onload = () => {
      //   this.openingStockForm.patchValue({
      //     file: reader.result
      //  });

      //   // need to run CD since file load runs outside of zone
      //   this.cdr.markForCheck();
      // };
    // }
}

/**
	 * Form Submit
	 */
	submit() {
		const controls = this.openingStockForm.controls;
		/** check form */
		if (this.openingStockForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const values = this.openingStockForm.value;
		const keys = Object.keys(values);

		let httpParams = new HttpParams();
		httpParams = httpParams.append('device_name', 'web');
		Object.keys(values).forEach(function (key) {
			httpParams = httpParams.append(key, values[key]);
		});

    let url = environment.apiEndpoint+'upload-opening-stock';

    const formData = new FormData();
      formData.append('RowCount', this.openingStockForm.value['RowCount']);
      formData.append('File', this.fileData);
      formData.append('user_id', this.userData.ID);
      formData.append('company_id', this.userData.Company_ID);
      formData.append('token_id', this.userData.Security_Token);
      formData.append('device_name', 'web');
      this.http.post(url, formData)
      .subscribe((response:any) => {
        this.loading = false;
        if (response.status == APP_CONSTANTS.response.SUCCESS) {
          const message = `uploaded successfully!`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Read, 5000, false, false);
          // this.router.navigateByUrl(this.returnUrl);
      } else {
        const message = response.message;
          this.layoutUtilsService.showActionNotification(message, MessageType.Read, 5000, false, false);
      }
      })

    // this.http.post(url, this.openingStockForm).
    // const formData = new FormData();
    //   formData.append('file', this.fileData);
    //   this.http.post('url/to/your/api', formData)
    //     .subscribe(res => {
    //       console.log(res);
    //       this.uploadedFilePath = res.data.filePath;
    //       alert('SUCCESS !!');
    //     })

		// this.openingStock
		// 	.addOpeningStock(httpParams)
		// 	.pipe(
		// 		tap(response => {
		// 			if (response.status == APP_CONSTANTS.response.SUCCESS) {
		// 					const message = `uploaded successfully!`;
		// 					this.layoutUtilsService.showActionNotification(message, MessageType.Read, 5000, false, false);
		// 					// this.router.navigateByUrl(this.returnUrl);
		// 			} else {
		// 				const message = `something went wrong!`;
		// 					this.layoutUtilsService.showActionNotification(message, MessageType.Read, 5000, false, false);
		// 			}
		// 		}),
		// 		takeUntil(this.unsubscribe),
		// 		finalize(() => {
		// 			this.loading = false;
		// 			this.cdr.markForCheck();
		// 		})
		// 	)
		// 	.subscribe();
  }
  
  downloadFile(){
    saveAs("https://supersales.co:8443/salespro/attachments/product/AttendanceLog_871303.xlsx", "AttendanceLog_871303.xlsx");
  }
  freezeStock(){
    let httpParams = new HttpParams();
		httpParams = httpParams.append('is_freeze', '1');
    
    this.loading =true;
    this.openingStock
    .freezeOpeningStock(httpParams)
    .pipe(
      tap(response => {
        if (response.status == APP_CONSTANTS.response.SUCCESS) {
            const message = `opening stock freeze successfully!`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 5000, false, false);
            // this.router.navigateByUrl(this.returnUrl);
        } else {
          const message = response.message;
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 5000, false, false);
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

}
