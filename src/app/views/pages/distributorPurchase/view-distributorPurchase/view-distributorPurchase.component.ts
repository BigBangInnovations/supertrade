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
import { DistributorPurchase, selectDistributorPurchaseById, selectDistributorPurchase, selectLoading, LOAD_DISTRIBUTOR_PURCHASE } from '../../../../core/distributorPurchase';
import { delay } from 'rxjs/operators';
import { PopupProductComponent } from '../../popup-product/popup-product.component';

import { PopupProductTotalCalculationComponent } from '../../popup-product/popup-add-product/popup-product-total-calculation/popup-product-total-calculation.component'
import { dynamicProductTemplateSetting } from '../../../../core/common/common.model'
import { Product } from '../../../../core/product/_models/product.model'
import { HttpParams } from "@angular/common/http";
import { DistributorPurchaseService } from '../../../../core/distributorPurchase/_services/index'
import { APP_CONSTANTS } from '../../../../../config/default/constants'
import { Logout } from '../../../../core/auth';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';

import * as fromVendor from '../../../../core/vendor'
// import * as fromOrderselect from '../../../../core/orderselect'
import * as fromMetadata from '../../../../core/metadata'
// import { selectOrderById } from '../../../../core/orderselect'
// import { selectVendorById } from '../../../../core/vendor'
import { Order, orderProduct } from '../../../../core/order/_models/order.model';
import { FrightTerm, Godown, PaymentMode } from '../../../../core/metadata';
import { Vendor } from '../../../../core/vendor/_models/vendor.model'
import { EncrDecrServiceService } from '../../../../core/auth/_services/encr-decr-service.service'
import { environment } from '../../../../../environments/environment';
import { CustomValidator } from '../../../../core/_base/layout/validators/custom-validator'

@Component({
  selector: 'kt-view-distributorPurchase',
  templateUrl: './view-distributorPurchase.component.html',
})
export class ViewDistributorPurchaseComponent implements OnInit, OnDestroy {
  distributorPurchase$: Observable<DistributorPurchase>;
  viewLoading$: Observable<boolean>;
  // Private properties
  private componentSubscriptions: Subscription;
  distributorPurchase: DistributorPurchase;
  viewDistributorPurchaseForm: FormGroup;
  hasFormErrors: boolean = false;
  componentRef: any;
  OptionalSetting: dynamicProductTemplateSetting;
  loading = false;
  sl_distributor_purchase_id: number = 0;

  viewMetadataLoading$: Observable<boolean>;
  viewOrderSelect: boolean = false;
  viewShippingAddress: boolean = false;
  vendors$: Observable<Vendor[]>;

  frightTerm$: Observable<FrightTerm[]>;
  godown$: Observable<Godown[]>;
  paymentMode$: Observable<PaymentMode[]>;

  purchaseActiveScheme: any;
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
  vendorAddressString: string = '';
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  /**
 * Component constructor
 *
 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
 * @param activatedRoute: ActivatedRoute
 * @param router: Router
 * @param data: any
 * @param store: Store<AppState>
 * @param distributorPurchaseFB: FormBuilder,
 * @param subheaderService: SubheaderService
 * @param layoutUtilsService: LayoutUtilsService
 * @param cdr  
 * @param EncrDecr: EncrDecrServiceService
 * 
 */
  constructor(public dialogRef: MatDialogRef<ViewDistributorPurchaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private distributorPurchaseFB: FormBuilder,
    private resolver: ComponentFactoryResolver,
    private distributorPurchaseService: DistributorPurchaseService,
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
      this.data.action == 'distributorPurchaseReturn'
      || this.data.action == 'vendorPartialPurchaseAcceptApproval'
      //  || this.data.action == 'viewDistributorPurchase'
    ) {
      OptionalSetting.displayPointCalculation = false;
    }

    if (
      this.data.action == 'vendorPurchaseApproval'
      || this.data.action == 'distributorPurchaseEdit'
    ) {
      OptionalSetting.displayDeleteButton = true;
    }

    this.OptionalSetting = OptionalSetting;
  }

  ngOnInit() {
    let sessionStorage = this.EncrDecr.getLocalStorage(environment.localStorageKey);
    this.userData = JSON.parse(sessionStorage)

    this.purchaseActiveScheme = this.userData.purchaseActiveScheme[0];
    this.purchaseActiveSchemebooster = this.userData.purchaseActiveSchemeBooster[0];

    this.purchaseActiveScheme = this.userData.purchaseActiveScheme[0];
    this.purchaseActiveSchemebooster = this.userData.purchaseActiveSchemeBooster[0];

    //Load vendor
    const vendorLoadSubscription = this.store.select(fromVendor.selectVendorLoaded).pipe(
    ).subscribe(data => {

      if (data) {
        this.vendors$ = this.store.pipe(select(fromVendor.selectAllVendor));
      } else {
        let httpParams = new HttpParams();
        this.store.dispatch(new fromVendor.LoadVendor(httpParams))
        this.vendors$ = this.store.pipe(select(fromVendor.selectAllVendor));
      }
    })
    this.unsubscribe.push(vendorLoadSubscription);

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

    this.viewLoading$ = this.store.pipe(select(fromVendor.selectVendorLoading));
    this.userSession = this.EncrDecr.getLocalStorage(environment.localStorageKey)
    this.userSession = JSON.parse(this.userSession)

    this.viewDistributorPurchaseForm = this.distributorPurchaseFB.group({
      id: [''],
      invoice_id: [''],
      scheme_id: [''],
      vendor_id: [''],
      vendor_name: [''],
      poID: [''],
      is_direct_purchase: [false],
      isShippingAddressSameAsDispatch: [false],
      godownID: [''],
      Address_Master_ID: [''],
      vendor_Address_Master_ID: [''],
      AddressLine1: [''],
      AddressLine2: [''],
      landline_no: [''],
      City: [''],
      State: [''],
      Country: [''],
      products: this.distributorPurchaseFB.array([], Validators.required),
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

    if (this.data.distributorPurchaseId) {
      this.distributorPurchase$ = this.store.pipe(select(selectDistributorPurchaseById(this.data.distributorPurchaseId)));
      const distributorPurchaseLoadSubscription = this.distributorPurchase$.pipe(
      ).subscribe((res: any) => {
        if (res != '') {
          this.viewMetadataLoading$ = this.store.pipe(select(fromMetadata.selectMetadataLoading));
          const viewMetadataLoadingSubscription = this.viewMetadataLoading$.pipe(
          ).subscribe((metadataRes: any) => {
            this.sl_distributor_purchase_id = res.id;
            this.createForm(res);
          });
          this.unsubscribe.push(viewMetadataLoadingSubscription);
        }

      });
      this.unsubscribe.push(distributorPurchaseLoadSubscription);

    } else if (this.data.transactionID) {
      this.viewMetadataLoading$ = this.store.pipe(select(fromMetadata.selectMetadataLoading));
      const viewMetadataLoadingSubscription = this.viewMetadataLoading$.pipe(
      ).subscribe((metadataRes: any) => {

        let httpParams = new HttpParams();
        httpParams = httpParams.append('transaction_id', this.data.transactionID);
        this.store.dispatch(new LOAD_DISTRIBUTOR_PURCHASE(httpParams));
        this.distributorPurchase$ = this.store.pipe(select(selectDistributorPurchase));
        const distributorPurchaseLoadSubscription = this.distributorPurchase$.pipe(
        ).subscribe((res: any) => {
          if (res && res.length > 0) {
            this.sl_distributor_purchase_id = res[0].id;
            this.createForm(res[0]);
          }
        })
        this.unsubscribe.push(distributorPurchaseLoadSubscription);
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

    this.viewDistributorPurchaseForm.controls['id'].setValue(res.id);
    this.viewDistributorPurchaseForm.controls['invoice_id'].setValue(res.invoice_id);
    this.viewDistributorPurchaseForm.controls['scheme_id'].setValue(res.scheme_id);
    this.viewDistributorPurchaseForm.controls['vendor_id'].setValue(res.ss_vendor_id);
    this.viewDistributorPurchaseForm.controls['vendor_name'].setValue(res.Vendor_Name);
    this.viewDistributorPurchaseForm.controls['poID'].setValue(res.poID);
    this.viewDistributorPurchaseForm.controls['is_direct_purchase'].setValue((res.poID > 0) ? false : true);
    this.viewDistributorPurchaseForm.controls['isShippingAddressSameAsDispatch'].setValue((res.isShippingAddressSameAsDispatch > 0) ? true : false);
    this.viewDistributorPurchaseForm.controls['godownID'].setValue(res.godownID);
    this.viewDistributorPurchaseForm.controls['vendor_Address_Master_ID'].setValue(res.vendor_Address_Master_ID);
    this.viewDistributorPurchaseForm.controls['Address_Master_ID'].setValue(res.Address_Master_ID);
    this.viewDistributorPurchaseForm.controls['AddressLine1'].setValue(res.AddressLine1);
    this.viewDistributorPurchaseForm.controls['AddressLine2'].setValue(res.AddressLine2);
    this.viewDistributorPurchaseForm.controls['City'].setValue(res.City);
    this.viewDistributorPurchaseForm.controls['State'].setValue(res.State);
    this.viewDistributorPurchaseForm.controls['Country'].setValue(res.Country);
    this.viewDistributorPurchaseForm.controls['paymentMode'].setValue(res.paymentMode);
    this.viewDistributorPurchaseForm.controls['bankName'].setValue(res.bankName);
    this.viewDistributorPurchaseForm.controls['cheqNo'].setValue(res.cheqNo);
    this.viewDistributorPurchaseForm.controls['cheqDate'].setValue(res.cheqDate);
    this.viewDistributorPurchaseForm.controls['frightTerm'].setValue(res.frightTerm);
    this.viewDistributorPurchaseForm.controls['dcNo'].setValue(res.dcNo);
    this.viewDistributorPurchaseForm.controls['grNo'].setValue(res.grNo);
    this.viewDistributorPurchaseForm.controls['transporter'].setValue(res.transporter);
    this.viewDistributorPurchaseForm.controls['deliveryDays'].setValue(res.deliveryDays);
    this.viewDistributorPurchaseForm.controls['remarks'].setValue(res.remarks);
    this.viewDistributorPurchaseForm.controls['erpInvoiceNo'].setValue(res.erpInvoiceNo);
    this.disableAttributes();

    // this.viewDistributorPurchaseForm = this.distributorPurchaseFB.group({
    // scheme_id: [res.scheme_id],
    // vendor_id: [{ value: res.ss_vendor_id, disabled: true }],
    // vendor_name: [''],
    // poID: [res.poID],
    // is_direct_purchase: [{ value: (res.poID > 0) ? false : true, disabled: true }],
    // isShippingAddressSameAsDispatch: [{ value: (res.isShippingAddressSameAsDispatch > 0) ? true : false, disabled: true }],
    // godownID: [{ value: res.godownID, disabled: true }],
    // Address_Master_ID: [res.Address_Master_ID],
    // AddressLine1: [res.AddressLine1],
    // AddressLine2: [res.AddressLine2],
    // City: [res.City],
    // State: [res.State],
    // Country: [res.Country],
    // products: this.distributorPurchaseFB.array([], Validators.required),
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
    const currentProductArray = <FormArray>this.viewDistributorPurchaseForm.controls['products'];
    const numberPatern = '^[0-9.,]+$';
    products.forEach(element => {
      let quantity = element.Quantity;
      let points = element.points;
      let points_boost = element.points_boost;

      if (this.pageAction == 'distributorPurchaseReturn') quantity = 0;
      if (this.pageAction == 'vendorPartialPurchaseAcceptApproval') quantity = element.acceptQty;
      if (this.pageAction == 'vendorPurchaseApproval') {
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
            Validators.maxLength(5),
            // Validators.min(1),
            CustomValidator
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
        this.distributorPurchaseFB.group(res)
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
    console.log('distributorPurchase view close');

  }

  /** UI */
	/**
	 * Returns component title
	 */
  getTitle(): string {
    // tslint:disable-next-line:no-string-throw
    if (this.pageAction == 'distributorPurchaseReturn') {
      return 'Distributor purchase return'
    } else if (this.pageAction == 'distributorPurchaseEdit') {
      return 'Update distributor purchase'
    }else if (this.pageAction == 'vendorPurchaseApproval') {
      return 'Purchase confirmation'
    } else if (this.pageAction == 'vendorPartialPurchaseAcceptApproval') {
      return 'Vendor accepted partial purchase confirmation'
    } else { return 'View Distributor Purchase'; }
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
    componentRef.instance.mainForm = this.viewDistributorPurchaseForm;
    componentRef.instance.isSGSTTax = this.isSGSTTax;
    componentRef.instance.isIGSTTax = this.isIGSTTax;
  }

  /**  
   * ReuturnDistributorPurchase
  */
  ReuturnDistributorPurchase() {
    const controls = this.viewDistributorPurchaseForm.controls;

    /** check form */
    if (this.viewDistributorPurchaseForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        controls[controlName].markAsTouched()
      }

      );
      return;
    }

    const returnDistributorPurchase = this.prepareDistributorPurchase();
    this.returnDistributorPurchase(returnDistributorPurchase);

  }

  enableAttributes() {
    this.viewDistributorPurchaseForm.controls['vendor_id'].enable();
    this.viewDistributorPurchaseForm.controls['is_direct_purchase'].enable();
    this.viewDistributorPurchaseForm.controls['isShippingAddressSameAsDispatch'].enable();
    this.viewDistributorPurchaseForm.controls['godownID'].enable();
    this.viewDistributorPurchaseForm.controls['paymentMode'].enable();
    this.viewDistributorPurchaseForm.controls['cheqDate'].enable();
    this.viewDistributorPurchaseForm.controls['frightTerm'].enable();
  }

  disableAttributes() {
    this.viewDistributorPurchaseForm.controls['vendor_id'].disable();
    this.viewDistributorPurchaseForm.controls['is_direct_purchase'].disable();
    this.viewDistributorPurchaseForm.controls['isShippingAddressSameAsDispatch'].disable();
    this.viewDistributorPurchaseForm.controls['godownID'].disable();
    this.viewDistributorPurchaseForm.controls['paymentMode'].disable();
    this.viewDistributorPurchaseForm.controls['cheqDate'].disable();
    this.viewDistributorPurchaseForm.controls['frightTerm'].disable();
  }
  /**  
     * editPurchase
    */
  editPurchase() {
    this.enableAttributes();
    const controls = this.viewDistributorPurchaseForm.controls;

    /** check form */
    if (this.viewDistributorPurchaseForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        controls[controlName].markAsTouched()
      }
      );
      return;
    }
    const returnDistributorPurchase = this.prepareDistributorPurchase();
    this.editDistributorPurchase(returnDistributorPurchase);

  }

  /**
   * Returns prepared data for save
   */
  prepareDistributorPurchase(): DistributorPurchase {
    const controls = this.viewDistributorPurchaseForm.controls;
    const _distributorPurchase = new DistributorPurchase();
    _distributorPurchase.clear();
    _distributorPurchase.sl_distributorPurchase_id = this.data.distributorPurchaseId;
    _distributorPurchase.sl_distributor_purchase_id = this.sl_distributor_purchase_id;
    _distributorPurchase.Tax_Type = (this.isSGSTTax) ? 'SGST' : (this.isIGSTTax ? 'IGST' : '');

    if (this.data.action == 'distributorPurchaseEdit'
    ) {
      _distributorPurchase.id = this.viewDistributorPurchaseForm.controls['id'].value;
      _distributorPurchase.ss_vendor_id = this.viewDistributorPurchaseForm.controls['vendor_id'].value;
      _distributorPurchase.vendor_name = this.viewDistributorPurchaseForm.controls['vendor_name'].value;
      _distributorPurchase.scheme_id = this.viewDistributorPurchaseForm.controls['scheme_id'].value;
      _distributorPurchase.ss_distributor_id = this.userSession.ID;
      _distributorPurchase.Distributor_Name = this.userSession.Name;
    }

    _distributorPurchase.products_json = JSON.stringify(this.prepareProduct())
    return _distributorPurchase;
  }

  /**
   * Returns prepared data for product
   */
  prepareProduct(): Product[] {
    const controls = this.viewDistributorPurchaseForm.controls['products'].value;
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
        product.originalQty = data.productOriginalQuantityCtrl;//product original purchase quantity
        product.acceptQty = data.productAcceptedQuantityCtrl;//product original purchase quantity
        product.Quantity = data.productQuantityCtrl;//product original purchase quantity :: return time it's a entered quantity by user
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
   * @param _distributorPurchase: User
   */
  returnDistributorPurchase(_distributorPurchase: DistributorPurchase) {
    this.loading = true;
    let httpParams = new HttpParams();
    Object.keys(_distributorPurchase).forEach(function (key) {
      httpParams = httpParams.append(key, _distributorPurchase[key]);
    });

    const distributorPurchaseServiceSubscription = this.distributorPurchaseService
      .returnDistributorPurchase(httpParams)
      .pipe(
        tap(response => {
          if (response.status == APP_CONSTANTS.response.SUCCESS) {
            const message = `DistributorPurchase return successfully.`;
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

    this.unsubscribe.push(distributorPurchaseServiceSubscription);
  }

  /**
   * Accpet reject distributor purchase by vendor
   *
   * @param _distributorPurchase: User
   */
  editDistributorPurchase(_distributorPurchase: DistributorPurchase) {
    this.loading = true;
    let httpParams = new HttpParams();
    Object.keys(_distributorPurchase).forEach(function (key) {
      httpParams = httpParams.append(key, _distributorPurchase[key]);
    });

    const distributorPurchaseServiceSubscription = this.distributorPurchaseService
      .createDistributorPurchase(httpParams)
      .pipe(
        tap(response => {
          if (response.status == APP_CONSTANTS.response.SUCCESS) {
            const message = `Purchase updated successfully.`;
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

    this.unsubscribe.push(distributorPurchaseServiceSubscription);
  }



  
  /**
* Checking control validation
*
* @param controlName: string => Equals to formControlName
* @param validationType: string => Equals to valitors name
*/
isControlHasError(controlName: string, validationType: string): boolean {
  const control = this.viewDistributorPurchaseForm.controls[controlName];
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
