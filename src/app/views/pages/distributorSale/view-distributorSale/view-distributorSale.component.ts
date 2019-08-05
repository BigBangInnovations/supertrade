// Angular
import { ViewContainerRef, Inject, ViewChild, ComponentFactoryResolver, ComponentRef, ComponentFactory, Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// RxJS
import { Observable, of, Subscription, Subject } from 'rxjs';
import { finalize, takeUntil, tap, distinctUntilChanged, skip } from 'rxjs/operators';
// Lodash
import { each, find, some } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../core/reducers';
// Services and Models
import { DistributorSale, selectDistributorSaleById, selectDistributorSale, selectLoading, LOAD_DISTRIBUTOR_SALE } from '../../../../core/distributorSale';
import { delay } from 'rxjs/operators';
import { PopupProductComponent } from '../../popup-product/popup-product.component';

import { PopupProductTotalCalculationComponent } from '../../popup-product/popup-add-product/popup-product-total-calculation/popup-product-total-calculation.component'
import { dynamicProductTemplateSetting } from '../../../../core/common/common.model'
import { Product } from '../../../../core/product/_models/product.model'
import { HttpParams } from "@angular/common/http";
import { DistributorSaleService } from '../../../../core/distributorSale/_services/index'
import { APP_CONSTANTS } from '../../../../../config/default/constants'
import { Logout } from '../../../../core/auth';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';

import * as fromRetailer from '../../../../core/retailer'
import * as fromOrderselect from '../../../../core/orderselect'
import * as fromMetadata from '../../../../core/metadata'
import { selectOrderById } from '../../../../core/orderselect'
import { selectRetailerById } from '../../../../core/retailer'
import { Order, orderProduct } from '../../../../core/order/_models/order.model';
import { FrightTerm, Godown, PaymentMode } from '../../../../core/metadata';
import { Retailer } from '../../../../core/retailer/_models/retailer.model'
import { EncrDecrServiceService } from '../../../../core/auth/_services/encr-decr-service.service'
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'kt-view-distributorSale',
  templateUrl: './view-distributorSale.component.html',
})
export class ViewDistributorSaleComponent implements OnInit, OnDestroy {
  distributorSale$: Observable<DistributorSale>;
  viewLoading$: Observable<boolean>;
  // Private properties
  private componentSubscriptions: Subscription;
  distributorSale: DistributorSale;
  viewDistributorSaleForm: FormGroup;
  hasFormErrors: boolean = false;
  componentRef: any;
  OptionalSetting: dynamicProductTemplateSetting;
  loading = false;
  sl_distributor_sales_id: number = 0;

  viewMetadataLoading$: Observable<boolean>;
  viewOrderSelect: boolean = false;
  viewShippingAddress: boolean = false;
  retailers$: Observable<Retailer[]>;

  frightTerm$: Observable<FrightTerm[]>;
  godown$: Observable<Godown[]>;
  paymentMode$: Observable<PaymentMode[]>;

  salesActiveScheme: any;
  purchaseActiveScheme: any;
  salesActiveSchemebooster: any;
  purchaseActiveSchemebooster: any;
  userData: any;
  isSGSTTax: boolean = false;
  isIGSTTax: boolean = false;
  step:number;

  @ViewChild('popupProductCalculation', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;

  //Product properry
  totalAmount: number;
  totalDiscount: number;
  totalGrossAmount: number;
  totalSGSTTaxAmount: number;
  totalCGSTTaxAmount: number;
  totalTaxAmount: number;
  totalNetAmount: number;
  pageAction: string;
  userSession: any;
  retailerAddressString: string = '';
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  /**
 * Component constructor
 *
 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
 * @param activatedRoute: ActivatedRoute
 * @param router: Router
 * @param data: any
 * @param store: Store<AppState>
 * @param distributorSaleFB: FormBuilder,
 * @param subheaderService: SubheaderService
 * @param layoutUtilsService: LayoutUtilsService
 * @param cdr  
 * @param EncrDecr: EncrDecrServiceService
 * 
 */
  constructor(public dialogRef: MatDialogRef<ViewDistributorSaleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private distributorSaleFB: FormBuilder,
    private resolver: ComponentFactoryResolver,
    private distributorSaleService: DistributorSaleService,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private cdr: ChangeDetectorRef,
    private EncrDecr: EncrDecrServiceService,

  ) {

    this.pageAction = this.data.action;

    const OptionalSetting = new dynamicProductTemplateSetting();
    OptionalSetting.clear();
    OptionalSetting.displayDeleteButton = false;
    if (
      this.data.action == 'DistributorSaleReturn'
      || this.data.action == 'retailerPartialSalesAcceptApproval'
      //  || this.data.action == 'viewDistributorSale'
    ) {
      OptionalSetting.displayPointCalculation = false;
    }

    if (
      this.data.action == 'retailerPurchaseApproval'
    ) {
      OptionalSetting.displayDeleteButton = true;
    }

    this.OptionalSetting = OptionalSetting;
  }

  ngOnInit() {
    let sessionStorage = this.EncrDecr.getLocalStorage(environment.localStorageKey);
    this.userData = JSON.parse(sessionStorage)

    this.salesActiveScheme = this.userData.salesActiveScheme[0];
    this.salesActiveSchemebooster = this.userData.salesActiveSchemeBooster[0];

    this.purchaseActiveScheme = this.userData.purchaseActiveScheme[0];
    this.purchaseActiveSchemebooster = this.userData.purchaseActiveSchemeBooster[0];

    //Load retailer
    const retailerLoadSubscription = this.store.select(fromRetailer.selectRetailerLoaded).pipe(
    ).subscribe(data => {

      if (data) {
        this.retailers$ = this.store.pipe(select(fromRetailer.selectAllRetailer));
      } else {
        let httpParams = new HttpParams();
        this.store.dispatch(new fromRetailer.LoadRetailer(httpParams))
        this.retailers$ = this.store.pipe(select(fromRetailer.selectAllRetailer));
      }
    })
    this.unsubscribe.push(retailerLoadSubscription);

    //Metadata
    const metadataloadSubsription = this.store.select(fromMetadata.selectMetadataLoaded).pipe(
    ).subscribe(data => {
      if (data) {
        this.frightTerm$ = this.store.pipe(select(fromMetadata.selectAllMetadataFreightTerms));
        this.godown$ = this.store.pipe(select(fromMetadata.selectAllMetadataGodowns));
        this.paymentMode$ = this.store.pipe(select(fromMetadata.selectAllMetadataPaymentModes));
      } else {
        let httpParams = new HttpParams();
        this.store.dispatch(new fromMetadata.LoadMetadata(httpParams))

        this.frightTerm$ = this.store.pipe(select(fromMetadata.selectAllMetadataFreightTerms));
        this.godown$ = this.store.pipe(select(fromMetadata.selectAllMetadataGodowns));
        this.paymentMode$ = this.store.pipe(select(fromMetadata.selectAllMetadataPaymentModes));
      }
    });

    this.unsubscribe.push(metadataloadSubsription);

    this.viewLoading$ = this.store.pipe(select(fromRetailer.selectRetailerLoading));
    this.userSession = this.EncrDecr.getLocalStorage(environment.localStorageKey)
    this.userSession = JSON.parse(this.userSession)

    this.viewDistributorSaleForm = this.distributorSaleFB.group({
      scheme_id: [''],
      retailer_id: [''],
      retailer_name: [''],
      soID: [''],
      is_direct_sale: [false],
      isShippingAddressSameAsDispatch: [false],
      godownID: [''],
      Address_Master_ID: [''],
      AddressLine1: [''],
      AddressLine2: [''],
      landline_no: [''],
      City: [''],
      State: [''],
      Country: [''],
      products: this.distributorSaleFB.array([], Validators.required),
      paymentMode: [''],
      bankName: [''],
      cheqNo: [''],
      cheqDate: [''],
      frightTerm: [''],
      dcNo: [''],
      grNo: [''],
      transporter: [''],
      deliveryDays: [''],
      remarks: [''],
      erpInvoiceNo: [''],
    });

    if (this.data.distributorSaleId) {
      this.distributorSale$ = this.store.pipe(select(selectDistributorSaleById(this.data.distributorSaleId)));
      const distributorSaleLoadSubscription = this.distributorSale$.pipe(
      ).subscribe((res: any) => {
        if (res != '') {
          this.viewMetadataLoading$ = this.store.pipe(select(fromMetadata.selectMetadataLoading));
          const viewMetadataLoadingSubscription = this.viewMetadataLoading$.pipe(
          ).subscribe((metadataRes: any) => {
            this.sl_distributor_sales_id = res.sl_distributor_sales_id;
            this.createForm(res);
          });
          this.unsubscribe.push(viewMetadataLoadingSubscription);
        }

      });
      this.unsubscribe.push(distributorSaleLoadSubscription);

    } else if (this.data.transactionID) {
      this.viewMetadataLoading$ = this.store.pipe(select(fromMetadata.selectMetadataLoading));
      const viewMetadataLoadingSubscription = this.viewMetadataLoading$.pipe(
      ).subscribe((metadataRes: any) => {

        let httpParams = new HttpParams();
        httpParams = httpParams.append('transaction_id', this.data.transactionID);
        this.store.dispatch(new LOAD_DISTRIBUTOR_SALE(httpParams));
        this.distributorSale$ = this.store.pipe(select(selectDistributorSale));
        const distributorSaleLoadSubscription = this.distributorSale$.pipe(
        ).subscribe((res: any) => {
          if (res && res.length > 0) {
            this.sl_distributor_sales_id = res[0].id;
            this.createForm(res[0]);
          }
        })
        this.unsubscribe.push(distributorSaleLoadSubscription);
      });
      this.unsubscribe.push(viewMetadataLoadingSubscription);
    }
  }

  /**
	 * Create form
	 */
  createForm(res) {
    if (res.Tax_Type == 'SGST') this.isSGSTTax = true;
    else if (res.Tax_Type == 'IGST') this.isIGSTTax = true;

    this.viewDistributorSaleForm.controls['scheme_id'].setValue(res.scheme_id);
    this.viewDistributorSaleForm.controls['retailer_id'].setValue(res.ss_retailer_id);
    this.viewDistributorSaleForm.controls['retailer_name'].setValue(res.Retailer_Name);
    this.viewDistributorSaleForm.controls['soID'].setValue(res.soID);
    this.viewDistributorSaleForm.controls['is_direct_sale'].setValue((res.soID > 0) ? false : true);
    this.viewDistributorSaleForm.controls['isShippingAddressSameAsDispatch'].setValue((res.isShippingAddressSameAsDispatch > 0) ? true : false);
    this.viewDistributorSaleForm.controls['godownID'].setValue(res.godownID);
    this.viewDistributorSaleForm.controls['Address_Master_ID'].setValue(res.Address_Master_ID);
    this.viewDistributorSaleForm.controls['AddressLine1'].setValue(res.AddressLine1);
    this.viewDistributorSaleForm.controls['AddressLine2'].setValue(res.AddressLine2);
    this.viewDistributorSaleForm.controls['City'].setValue(res.City);
    this.viewDistributorSaleForm.controls['State'].setValue(res.State);
    this.viewDistributorSaleForm.controls['Country'].setValue(res.Country);
    this.viewDistributorSaleForm.controls['paymentMode'].setValue(res.paymentMode);
    this.viewDistributorSaleForm.controls['bankName'].setValue(res.bankName);
    this.viewDistributorSaleForm.controls['cheqNo'].setValue(res.cheqNo);
    this.viewDistributorSaleForm.controls['cheqDate'].setValue(res.cheqDate);
    this.viewDistributorSaleForm.controls['frightTerm'].setValue(res.frightTerm);
    this.viewDistributorSaleForm.controls['dcNo'].setValue(res.dcNo);
    this.viewDistributorSaleForm.controls['grNo'].setValue(res.grNo);
    this.viewDistributorSaleForm.controls['transporter'].setValue(res.transporter);
    this.viewDistributorSaleForm.controls['deliveryDays'].setValue(res.deliveryDays);
    this.viewDistributorSaleForm.controls['remarks'].setValue(res.remarks);
    this.viewDistributorSaleForm.controls['erpInvoiceNo'].setValue(res.erpInvoiceNo);
    this.disableAttributes();

    // this.viewDistributorSaleForm = this.distributorSaleFB.group({
    // scheme_id: [res.scheme_id],
    // retailer_id: [{ value: res.ss_retailer_id, disabled: true }],
    // retailer_name: [''],
    // soID: [res.soID],
    // is_direct_sale: [{ value: (res.soID > 0) ? false : true, disabled: true }],
    // isShippingAddressSameAsDispatch: [{ value: (res.isShippingAddressSameAsDispatch > 0) ? true : false, disabled: true }],
    // godownID: [{ value: res.godownID, disabled: true }],
    // Address_Master_ID: [res.Address_Master_ID],
    // AddressLine1: [res.AddressLine1],
    // AddressLine2: [res.AddressLine2],
    // City: [res.City],
    // State: [res.State],
    // Country: [res.Country],
    // products: this.distributorSaleFB.array([], Validators.required),
    // paymentMode: [{ value: res.paymentMode, disabled: true }],
    // bankName: [res.bankName],
    // cheqNo: [res.cheqNo],
    // cheqDate: [{ value: res.cheqDate, disabled: true }],
    // frightTerm: [{ value: res.frightTerm, disabled: true }],
    // dcNo: [res.dcNo],
    // grNo: [res.grNo],
    // transporter: [res.transporter],
    // deliveryDays: [res.deliveryDays],
    // remarks: [res.remarks],
    // erpInvoiceNo: [res.erpInvoiceNo],
    // });

    this.viewShippingAddress = true;
    this.prepareProductView(res.product)
  }

  prepareProductView(products): any[] {
    const currentProductArray = <FormArray>this.viewDistributorSaleForm.controls['products'];
    const numberPatern = '^[0-9.,]+$';
    products.forEach(element => {
      let quantity = element.Quantity;
      let points = element.points;
      let points_boost = element.points_boost;

      if (this.pageAction == 'distributorSaleReturn') quantity = 0;
      if (this.pageAction == 'retailerPartialSalesAcceptApproval') quantity = element.acceptQty;
      if (this.pageAction == 'retailerPurchaseApproval') {
        let boost_point = 0;
        if (this.purchaseActiveSchemebooster != undefined)
          boost_point = this.purchaseActiveSchemebooster.boost_point;
        points = element.points / quantity
        points_boost = (element.points * boost_point) / 100;
      }

      let res = {
        productCategoryCtrl: [''],
        productSubCategoryCtrl: [''],
        productCtrl: [element.ProductID],
        productNameCtrl: [element.Name],
        productPriceCtrl: [element.Price],
        productTaxSGSTCtrl: [element.SGSTTax],
        productTaxSGSTSurchargesCtrl: [element.SGSTSurcharges],
        productTaxCGSTCtrl: [element.CGSTTax],
        productTaxCGSTSurchargesCtrl: [element.CGSTSurcharges],
        productTaxIGSTCtrl: [element.IGSTTax],
        productTaxIGSTSurchargesCtrl: [element.IGSTSurcharges],
        productQuantityCtrl: [quantity, Validators.compose(
          [
            Validators.required,
            Validators.min(0),
            Validators.max(element.Quantity - element.ReturnQuantity),
            Validators.pattern(numberPatern),
            Validators.maxLength(5)
          ]
        )],
        productOriginalQuantityCtrl: [element.Quantity],
        productReturnedQuantityCtrl: [element.ReturnQuantity],
        productAcceptedQuantityCtrl: [element.acceptQty],
        productDiscountCtrl: [element.Discount],
        productLoyaltyPointCtrl: [(element.points) / element.Quantity],
        productBarCodeCtrl: [''],
        productProductCodeCtrl: [''],
        VATPercentageCtrl: [''],
        InclusiveExclusiveCtrl: [''],
        VATFromCtrl: [''],
        VATCodeCtrl: [''],
        points: [points],
        points_boost: [points_boost],
      }

      currentProductArray.push(
        this.distributorSaleFB.group(res)
      )

    });
    this.commonCalculation();
    return [];
  }

	/**
	 * On destroy
	 */
  ngOnDestroy() {
    if (this.componentSubscriptions) {
      this.componentSubscriptions.unsubscribe();
    }
    this.unsubscribe.forEach(sb => sb.unsubscribe());
    this.loading = false;
  }

  /**
	 * Close alert
	 *
	 * @param $event: Event
	 */
  onAlertClose($event) {
    console.log('distributorSale view close');

  }

  /** UI */
	/**
	 * Returns component title
	 */
  getTitle(): string {
    // tslint:disable-next-line:no-string-throw
    if (this.pageAction == 'distributorSaleReturn') {
      return 'Distributor sale return'
    } else if (this.pageAction == 'retailerPurchaseApproval') {
      return 'Purchase confirmation'
    } else if (this.pageAction == 'retailerPartialSalesAcceptApproval') {
      return 'Retailer accepted partial sales confirmation'
    } else { return 'View Distributor Sale'; }
  }

  close() {
    this.dialogRef.close();
  }
  commonCalculation() {
    //Total Calculate
    const componentFactory = this.resolver.resolveComponentFactory(PopupProductTotalCalculationComponent);
    const viewContainerRef = this.entry;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    componentRef.instance.mainForm = this.viewDistributorSaleForm;
    componentRef.instance.isSGSTTax = this.isSGSTTax;
    componentRef.instance.isIGSTTax = this.isIGSTTax;
  }

  /**  
   * ReuturnDistributorSale
  */
  ReuturnDistributorSale() {
    const controls = this.viewDistributorSaleForm.controls;

    /** check form */
    if (this.viewDistributorSaleForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        controls[controlName].markAsTouched()
      }

      );
      return;
    }

    const returnDistributorSale = this.prepareDistributorSale();
    this.returnDistributorSale(returnDistributorSale);

  }

  enableAttributes() {
    this.viewDistributorSaleForm.controls['retailer_id'].enable();
    this.viewDistributorSaleForm.controls['is_direct_sale'].enable();
    this.viewDistributorSaleForm.controls['isShippingAddressSameAsDispatch'].enable();
    this.viewDistributorSaleForm.controls['godownID'].enable();
    this.viewDistributorSaleForm.controls['paymentMode'].enable();
    this.viewDistributorSaleForm.controls['cheqDate'].enable();
    this.viewDistributorSaleForm.controls['frightTerm'].enable();
  }

  disableAttributes() {
    this.viewDistributorSaleForm.controls['retailer_id'].disable();
    this.viewDistributorSaleForm.controls['is_direct_sale'].disable();
    this.viewDistributorSaleForm.controls['isShippingAddressSameAsDispatch'].disable();
    this.viewDistributorSaleForm.controls['godownID'].disable();
    this.viewDistributorSaleForm.controls['paymentMode'].disable();
    this.viewDistributorSaleForm.controls['cheqDate'].disable();
    this.viewDistributorSaleForm.controls['frightTerm'].disable();
  }
  /**  
     * acceptPurchase
    */
  acceptPurchase() {
    this.enableAttributes();
    const controls = this.viewDistributorSaleForm.controls;

    /** check form */
    if (this.viewDistributorSaleForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        controls[controlName].markAsTouched()
      }
      );
      return;
    }
    this.data.notificationData[0].Status = 2;
    const returnDistributorSale = this.prepareDistributorSale();
    this.acceptRejectPurchase(returnDistributorSale);

  }

  /**  
     * acceptPurchase
    */
  rejectPurchase() {
    this.enableAttributes();
    const controls = this.viewDistributorSaleForm.controls;

    /** check form */
    if (this.viewDistributorSaleForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        controls[controlName].markAsTouched()
      }

      );
      return;
    }

    this.data.notificationData[0].Status = 3;
    const returnDistributorSale = this.prepareDistributorSale();
    this.acceptRejectPurchase(returnDistributorSale);

  }

  /**  
     * acceptPartialSaleAcceptedByRetailer
    */
  acceptPartialSaleAcceptedByRetailer() {
    this.enableAttributes();
    const controls = this.viewDistributorSaleForm.controls;

    /** check form */
    if (this.viewDistributorSaleForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        controls[controlName].markAsTouched()
      }
      );
      return;
    }
    this.data.notificationData[0].Status = 2;
    const returnDistributorSale = this.prepareDistributorSale();
    this.acceptRejectPartialSaleAcceptedByRetailer(returnDistributorSale);

  }

  /**  
     * rejectPartialSaleAcceptedByRetailer
    */
  rejectPartialSaleAcceptedByRetailer() {
    this.enableAttributes();
    const controls = this.viewDistributorSaleForm.controls;

    /** check form */
    if (this.viewDistributorSaleForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        controls[controlName].markAsTouched()
      }

      );
      return;
    }

    this.data.notificationData[0].Status = 3;
    const returnDistributorSale = this.prepareDistributorSale();
    this.acceptRejectPartialSaleAcceptedByRetailer(returnDistributorSale);

  }

  /**
   * Returns prepared data for save
   */
  prepareDistributorSale(): DistributorSale {
    const controls = this.viewDistributorSaleForm.controls;
    const _distributorSale = new DistributorSale();
    _distributorSale.clear();
    _distributorSale.sl_distributorSale_id = this.data.distributorSaleId;
    _distributorSale.sl_distributor_sales_id = this.sl_distributor_sales_id;
    _distributorSale.Tax_Type = (this.isSGSTTax) ? 'SGST' : (this.isIGSTTax ? 'IGST' : '');

    if (this.data.action == 'retailerPurchaseApproval'
    ) {
      _distributorSale.data = JSON.stringify(this.data.notificationData);
      _distributorSale.retailer_name = this.userSession.Name;
      _distributorSale.Distributor_Name = this.userSession.Distributor_Name;
    } else if (this.data.action == 'retailerPartialSalesAcceptApproval'
    ) {
      _distributorSale.data = JSON.stringify(this.data.notificationData);
      _distributorSale.retailer_id = this.viewDistributorSaleForm.controls['retailer_id'].value;
      _distributorSale.retailer_name = this.viewDistributorSaleForm.controls['retailer_name'].value;
      _distributorSale.Distributor_Name = this.userSession.Name;
    }

    _distributorSale.products_json = JSON.stringify(this.prepareProduct())
    return _distributorSale;
  }

  /**
   * Returns prepared data for product
   */
  prepareProduct(): Product[] {
    const controls = this.viewDistributorSaleForm.controls['products'].value;
    const _products = [];
    controls.forEach(data => {
      if (data.productQuantityCtrl > 0) {
        //Clear Product and set default value

        const product = new Product();
        product.clear();
        product.ProductID = data.productCtrl;//Product Original ID
        product.ProductCode = data.productProductCodeCtrl;//Product Original ID
        product.serial_no = '';//Serial number
        product.ProductAmount = data.productPriceCtrl * data.productQuantityCtrl;//Product Amount:: Product prive * Quantity
        product.Price = data.productPriceCtrl;//Product original price :: Return product time It's total get point in order
        product.points = data.points;//Product original point :: Return product time It's total get boost point in order
        product.points_boost = data.points_boost;//Product original point
        product.originalQty = data.productOriginalQuantityCtrl;//product original sale quantity
        product.acceptQty = data.productAcceptedQuantityCtrl;//product original sale quantity
        product.Quantity = data.productQuantityCtrl;//product original sale quantity :: return time it's a entered quantity by user
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
        _products.push(product);
      }
    });
    return _products;
  }

  /**
   * Add User
   *
   * @param _distributorSale: User
   */
  returnDistributorSale(_distributorSale: DistributorSale) {
    this.loading = true;
    let httpParams = new HttpParams();
    Object.keys(_distributorSale).forEach(function (key) {
      httpParams = httpParams.append(key, _distributorSale[key]);
    });

    const distributorSaleServiceSubscription = this.distributorSaleService
      .returnDistributorSale(httpParams)
      .pipe(
        tap(response => {
          if (response.status == APP_CONSTANTS.response.SUCCESS) {
            const message = `DistributorSale return successfully.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
            this.dialogRef.close('reload');
          } else if (response.status == APP_CONSTANTS.response.ERROR) {
            const message = response.message;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
          } else {
            const message = 'Invalid token! Please login again';
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
            this.store.dispatch(new Logout());
          }
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe();

    this.unsubscribe.push(distributorSaleServiceSubscription);
  }

  /**
   * Accpet reject distributor sales by retailer
   *
   * @param _distributorSale: User
   */
  acceptRejectPurchase(_distributorSale: DistributorSale) {
    this.loading = true;
    let httpParams = new HttpParams();
    Object.keys(_distributorSale).forEach(function (key) {
      httpParams = httpParams.append(key, _distributorSale[key]);
    });

    const distributorSaleServiceSubscription = this.distributorSaleService
      .acceptRejectPurchase(httpParams)
      .pipe(
        tap(response => {
          if (response.status == APP_CONSTANTS.response.SUCCESS) {
            const message = `Purchase accepted successfully.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
            this.dialogRef.close('reload');
          } else if (response.status == APP_CONSTANTS.response.ERROR) {
            const message = response.message;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
          } else {
            const message = 'Invalid token! Please login again';
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
            this.store.dispatch(new Logout());
          }
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe();

    this.unsubscribe.push(distributorSaleServiceSubscription);
  }


  /**
 * Accpet reject distributor sales by retailer
 *
 * @param _distributorSale: User
 */
  acceptRejectPartialSaleAcceptedByRetailer(_distributorSale: DistributorSale) {
    this.loading = true;
    let httpParams = new HttpParams();
    Object.keys(_distributorSale).forEach(function (key) {
      httpParams = httpParams.append(key, _distributorSale[key]);
    });

    const distributorSaleServiceSubscription = this.distributorSaleService
      .acceptRejectPartialSaleAcceptedByRetailer(httpParams)
      .pipe(
        tap(response => {
          if (response.status == APP_CONSTANTS.response.SUCCESS) {
            const message = `Accepted successfully.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
            this.dialogRef.close('reload');
          } else if (response.status == APP_CONSTANTS.response.ERROR) {
            const message = response.message;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
          } else {
            const message = 'Invalid token! Please login again';
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
            this.store.dispatch(new Logout());
          }
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe();

    this.unsubscribe.push(distributorSaleServiceSubscription);
  }

  
  /**
* Checking control validation
*
* @param controlName: string => Equals to formControlName
* @param validationType: string => Equals to valitors name
*/
isControlHasError(controlName: string, validationType: string): boolean {
  const control = this.viewDistributorSaleForm.controls[controlName];
  if (!control) {
    return false;
  }
  if (controlName == 'products') {
    const result = control.hasError(validationType);
    return result;
  } else {
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }


}

changeExpansionpanel(event) {
  this.step = null;
  setTimeout(() => {
    this.step = event;
  }, 10);
}
}
