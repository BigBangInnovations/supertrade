// Angular
import { ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef, ComponentFactory, Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { HttpParams } from "@angular/common/http";
// RxJS
import { BehaviorSubject, Observable, of, Subscription, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
// Services and Models
import { Sale } from '../../../../core/sales/_models/sale.model';
import { getSalesActiveScheme } from '../../../../core/auth/_selectors/auth.selectors';
import { EncrDecrServiceService } from '../../../../core/auth/_services/encr-decr-service.service'
import { environment } from '../../../../../environments/environment';
// Components
import { PopupProductComponent } from '../../popup-product/popup-product.component';
import { PopupAddProductComponent } from '../../popup-product/popup-add-product/popup-add-product.component';
import { Product } from '../../../../core/product/_models/product.model'
import { SalesService } from '../../../../core/sales/_services/index'
import { APP_CONSTANTS } from '../../../../../config/default/constants'
import { Logout } from '../../../../core/auth';
import { PopupProductTotalCalculationComponent } from '../../popup-product/popup-add-product/popup-product-total-calculation/popup-product-total-calculation.component'

@Component({
  selector: 'kt-add-sale',
  templateUrl: './add-sale.component.html',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
  // styleUrls: ['./add-sale.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddSalesComponent implements OnInit, OnDestroy {
  // Public properties
  sale: Sale;
  saleForm: FormGroup;
  hasFormErrors: boolean = false;
  salesActiveScheme: any;
  salesActiveSchemebooster: any;
  userData: any;
  componentRef: any;
  loading = false;
  // Private properties
  private subscriptions: Subscription[] = [];
  @ViewChild('popupProductCalculation', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;
  today = new Date();
  private addedProductsIds: any[] = [];


  private unsubscribe: Subject<any>;

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param saleFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
   * @param EncrDecr: EncrDecrServiceService
   * @param dialog: MatDialog
   * @param datePipe: DatePipe
   * @param salesService: SalesService,
   * @param cdr
	 */
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private saleFB: FormBuilder,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private store: Store<AppState>,
    private layoutConfigService: LayoutConfigService,
    private EncrDecr: EncrDecrServiceService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private salesService: SalesService,
    private cdr: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver
  ) {
    this.unsubscribe = new Subject();
  }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(params => {
      let sessionStorage = this.EncrDecr.getLocalStorage(environment.localStorageKey);
      this.userData = JSON.parse(sessionStorage)

      this.salesActiveScheme = this.userData.salesActiveScheme[0];
      this.salesActiveSchemebooster = this.userData.salesActiveSchemeBooster[0];

      this.sale = new Sale();
      this.sale.clear();
      this.initSale();
    });
    this.subscriptions.push(routeSubscription);

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

	/**
	 * Init user
	 */
  initSale() {
    this.createForm();
    this.subheaderService.setTitle('Add Sale');
    this.subheaderService.setBreadcrumbs([
      { title: 'Sale', page: `sale` },
      { title: 'Add Sale', page: `add-sale` }
    ]);
  }

	/**
	 * Create form
	 */
  createForm() {
    this.saleForm = this.saleFB.group({
      scheme_id: [this.salesActiveScheme.scheme_id, Validators.required],
      name: ['Kaushik', Validators.required],
      mobile_no: ['9687453313', Validators.required],
      address_line1: ['A301', Validators.required],
      address_line2: ['Anand nagar', Validators.required],
      landline_no: ['6985745632', Validators.required],
      city: ['Ahmedabad', Validators.required],
      pincode: ['380054', Validators.required],
      state: ['gujrat', Validators.required],
      products: this.saleFB.array([], Validators.required)
    });
  }

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
  submit() {
    this.hasFormErrors = false;
    const controls = this.saleForm.controls;
    /** check form */
    if (this.saleForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        return controls[controlName].markAsTouched()
      }
      );

      this.hasFormErrors = true;
      return;
    }

    const addEditSale = this.prepareSale();

    this.addEditSale(addEditSale);
  }


	/**
	 * Returns prepared data for save
	 */
  prepareSale(): Sale {
    const controls = this.saleForm.controls;
    const _sale = new Sale();
    _sale.clear();
    _sale.loyalty_id = this.salesActiveScheme.id;
    _sale.scheme_id = controls['scheme_id'].value;
    _sale.distributor_id = this.userData.Distributor_ID;

    //End Customer Detail
    _sale.name = controls['name'].value;
    _sale.mobile_no = controls['mobile_no'].value;
    _sale.landline_no = controls['landline_no'].value;
    _sale.address_line1 = controls['address_line1'].value;
    _sale.address_line2 = controls['address_line2'].value;
    _sale.city = controls['city'].value;
    _sale.pincode = controls['pincode'].value;
    _sale.state = controls['state'].value;
    _sale.date = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    // _sale.product = controls['products'].value;
    _sale.products_json = JSON.stringify(this.prepareProduct())
    return _sale;
  }

  /**
	 * Returns prepared data for product
	 */
  prepareProduct(): Product[] {
    const controls = this.saleForm.controls['products'].value;;
    const _products = [];
    const product = new Product();
    let boost_point = 0;
    if (this.salesActiveSchemebooster != undefined)
      boost_point = this.salesActiveSchemebooster.boost_point;
    controls.forEach(data => {
      //Clear Product and set default value
      product.clear();
      product.ProductID = data.productCtrl;//Product Original ID
      product.ProductCode = data.productProductCodeCtrl;//Product Original ID
      product.serial_no = '';//Serial number
      product.ProductAmount = data.productPriceCtrl * data.productQuantityCtrl;//Product Amount:: Product prive * Quantity
      product.Price = data.productPriceCtrl;//Product original price
      product.points = data.productLoyaltyPointCtrl;//Product original point
      product.Quantity = data.productQuantityCtrl;//product original sale quantity
      product.Discount = data.productDiscountCtrl;//product original discount(%)
      product.SGSTTax = data.productTaxSGSTCtrl;//Product original SGST Tax(%)
      product.SGSTSurcharges = data.productTaxSGSTSurchargesCtrl;//Product original SGST Surcharges Tax(%)
      product.CGSTTax = data.productTaxCGSTCtrl;//Product original CGST Tax(%)
      product.CGSTSurcharges = data.productTaxCGSTSurchargesCtrl;//Product original CGST Surcharges Tax(%)
      product.IGSTTax = data.productTaxIGSTCtrl;//Product original IGST Tax(%)
      product.IGSTSurcharges = data.productTaxIGSTSurchargesCtrl;//Product original IGST Surcharges Tax(%)
      product.VATPercentage = data.productVATPercentage;//Product original Vat perchantage(%)
      product.InclusiveExclusive = data.InclusiveExclusiveTax;//Product TAX inclusive or exclusive:: no any effect of this field
      product.VATFrom = data.productVATFrom;//Product vat from customer OR Other side
      product.tot_points = data.productLoyaltyPointCtrl * data.productQuantityCtrl;//Total Point:: Product Org.Point * Quantity
      product.tot_points_boost = (product.tot_points * boost_point) / 100;//Total Point boost:: Product Org.boostPoint * Quantity
      _products.push(product);
    });
    return _products;
  }

	/**
	 * Add User
	 *
	 * @param _sale: User
	 */
  addEditSale(_sale: Sale) {
    this.loading = true;
    let httpParams = new HttpParams();
    Object.keys(_sale).forEach(function (key) {
      httpParams = httpParams.append(key, _sale[key]);
    });

    this.salesService
      .createSale(httpParams)
      .pipe(
        tap(response => {
          if (response.status == APP_CONSTANTS.response.SUCCESS) {
            const message = `Sales successfully has been added.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
            this.router.navigateByUrl('sales'); // sales listing page
          } else if (response.status == APP_CONSTANTS.response.ERROR) {
            const message = response.message;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
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

	/**
	 * Returns component title
	 */
  getComponentTitle() {
    let result = 'Create Sale';
    return result;
  }

	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  /**
	 * Add product
	 *
	 */
  addProduct() {
    const _saveMessage = `Product added.`;
    const _messageType = MessageType.Read;

    const dialogRef = this.dialog.open(PopupProductComponent, {
      data: { addedProductsIds: this.addedProductsIds },
      // data: { addedProductsIds: [] },
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      /**
       * try to add dynamic child
       */
      this.createProduct(res)

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 2000, false, false);
    });
  }

  /**
  * try to add dynamic product
  */
  createProduct(res) {
    const currentProductArray = <FormArray>this.saleForm.controls['products'];
    currentProductArray.push(
      this.saleFB.group(res)
    )
    this.commonCalculation()
  }

  commonCalculation() {
    // this.calculateAllProductsTotal()

    //Total Calculate
    const componentFactory = this.resolver.resolveComponentFactory(PopupProductTotalCalculationComponent);
    // const viewContainerRef = this.entry.viewContainerRef;
    const viewContainerRef = this.entry;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    componentRef.instance.saleForm = this.saleForm;
    const sub: Subscription = componentRef.instance.newAddedProductsIds.subscribe(
      event => {
        // console.log(event)
        this.newAddedProductsIdsUpdate(event)
      }
    );
    componentRef.onDestroy(() => { sub.unsubscribe(); });
  }

  newAddedProductsIdsUpdate(ids) {
    this.addedProductsIds = ids.addedProductsIds;
    // console.log(this.addedProductsIds);
  }
}
