// Angular
import { ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef, ComponentFactory, Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { HttpParams } from "@angular/common/http";
// RxJS
import { BehaviorSubject, Observable, of, Subscription, Subject, from } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
// Services and Models
import { DistributorPurchase } from '../../../../core/distributorPurchase/_models/distributorPurchase.model';
import { EncrDecrServiceService } from '../../../../core/auth/_services/encr-decr-service.service'
import { environment } from '../../../../../environments/environment';
// Components
import { PopupProductComponent } from '../../popup-product/popup-product.component';
import { PopupAddProductComponent } from '../../popup-product/popup-add-product/popup-add-product.component';
import { Product } from '../../../../core/product/_models/product.model'
// import { Distributor } from '../../../../core/distributor/_models/distributor.model'
import { Vendor } from '../../../../core/vendor/_models/vendor.model'
import { DistributorPurchaseService } from '../../../../core/distributorPurchase/_services/index'
import { APP_CONSTANTS } from '../../../../../config/default/constants'
import { Logout } from '../../../../core/auth';
import { PopupProductTotalCalculationComponent } from '../../popup-product/popup-add-product/popup-product-total-calculation/popup-product-total-calculation.component'
import { dynamicProductTemplateSetting } from '../../../../core/common/common.model'
// import * as fromDistributor from '../../../../core/distributor'
import * as fromVendor from '../../../../core/vendor'
import * as fromDistributorposelect from '../../../../core/distributorposelect'
import * as fromMetadata from '../../../../core/metadata'
import { selectOrderById } from '../../../../core/distributorposelect'
import { selectAllVendor, selectVendorById } from '../../../../core/vendor'
import { Order, orderProduct } from '../../../../core/order/_models/order.model';
import { FrightTerm, Godown, PaymentMode } from '../../../../core/metadata';

@Component({
  selector: 'kt-add-distributorPurchase',
  templateUrl: './add-distributorPurchase.component.html',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
  // styleUrls: ['./add-distributorPurchase.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDistributorPurchaseComponent implements OnInit, OnDestroy {
  // Public properties
  distributorPurchase: DistributorPurchase;
  addDistributorPurchaseForm: FormGroup;
  hasFormErrors: boolean = false;
  purchaseActiveScheme: any;
  purchaseActiveSchemebooster: any;
  userData: any;
  componentRef: any;
  loading = false;
  OptionalSetting: dynamicProductTemplateSetting;
  pageAction: string;
  viewLoading$: Observable<boolean>;
  viewOrderSelectLoading$: Observable<boolean>;
  viewMetadataLoading$: Observable<boolean>;
  viewOrderSelect: boolean = false;
  viewShippingAddress: boolean = false;
  vendors$: Observable<Vendor[]>;

  frightTerm$: Observable<FrightTerm[]>;
  godown$: Observable<Godown[]>;
  paymentMode$: Observable<PaymentMode[]>;

  isSGSTTax: boolean = false;
  isIGSTTax: boolean = false;
  step: number;

  orderSelect$: Observable<Order[]>;
  userSession: string;
  vendorAddressString: string = '';
  userAddressString: string = '';
  // Private properties
  private subscriptions: Subscription[] = [];
  @ViewChild('popupProductCalculation', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;
  today = new Date();
  private addedProductsIds: any[] = [];
  private unsubscribe: Subject<any>;
  // checked = true;
	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param distributorPurchaseFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
   * @param EncrDecr: EncrDecrServiceService
   * @param dialog: MatDialog
   * @param datePipe: DatePipe
   * @param distributorPurchaseService: DistributorPurchaseService,
   * @param cdr
	 */
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private distributorPurchaseFB: FormBuilder,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private store: Store<AppState>,
    private layoutConfigService: LayoutConfigService,
    private EncrDecr: EncrDecrServiceService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private distributorPurchaseService: DistributorPurchaseService,
    private cdr: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver
  ) {
    this.unsubscribe = new Subject();
    const OptionalSetting = new dynamicProductTemplateSetting();
    OptionalSetting.clear();
    this.OptionalSetting = OptionalSetting;
    this.pageAction = 'addDistributorPurchase'
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

      this.purchaseActiveScheme = this.userData.purchaseActiveScheme[0];
      this.purchaseActiveSchemebooster = this.userData.purchaseActiveSchemeBooster[0];

      this.distributorPurchase = new DistributorPurchase();
      this.distributorPurchase.clear();
      this.initDistributorPurchase();

      //Load vendor
      this.store.select(fromVendor.selectVendorLoaded).pipe().subscribe(data => {
        if (data) {
          this.vendors$ = this.store.pipe(select(fromVendor.selectAllVendor));
        } else {
          let httpParams = new HttpParams();
          this.store.dispatch(new fromVendor.LoadVendor(httpParams))
          this.vendors$ = this.store.pipe(select(fromVendor.selectAllVendor));
        }
      });
      this.viewLoading$ = this.store.pipe(select(fromVendor.selectVendorLoading));

      //Metadata
      this.store.select(fromMetadata.selectMetadataLoaded).pipe().subscribe(data => {
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
      this.viewMetadataLoading$ = this.store.pipe(select(fromMetadata.selectMetadataLoading));
      this.userSession = this.EncrDecr.getLocalStorage(environment.localStorageKey)
    });
    this.subscriptions.push(routeSubscription);
    this.formControlValueChanged();

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
  initDistributorPurchase() {
    this.createForm();
    this.subheaderService.setTitle('Add Purchase');
    this.subheaderService.setBreadcrumbs([
      { title: 'Distributor Purchase', page: `distributorPurchase` },
      { title: '', page: `add-distributorPurchase` }
    ]);
  }

	/**
	 * Create form
	 */
  createForm() {
    const numberPatern = '^[0-9.,]+$';
    this.addDistributorPurchaseForm = this.distributorPurchaseFB.group({
      scheme_id: [this.purchaseActiveScheme.scheme_id, Validators.required],
      vendor_id: ['', Validators.required],
      vendor_name: [''],
      poID: [''],
      is_direct_purchase: [true],
      isShippingAddressSameAsDispatch: [true],
      godownID: ['', Validators.required],
      vendor_Address_Master_ID: [''],
      Address_Master_ID: [this.userData.Address_Master_ID],
      AddressLine1: [this.userData.Address_Line1],
      AddressLine2: [this.userData.Address_Line2],
      City: [this.userData.City],
      Pincode: [''],
      State: [this.userData.State],
      Country: [this.userData.Country],
      products: this.distributorPurchaseFB.array([], Validators.required),
      paymentMode: ['', Validators.required],
      bankName: [''],
      cheqNo: [''],
      cheqDate: [''],
      frightTerm: [''],
      dcNo: [''],
      grNo: [''],
      transporter: [''],
      deliveryDays: ['',
        Validators.compose([
          Validators.pattern(numberPatern),
        ])
      ],
      remarks: [''],
      erpInvoiceNo: [''],
    });

    this.userAddressString = this.userData.Address_Line1;
      this.userAddressString += ', ' + this.userData.Address_Line2;
      this.userAddressString += ', ' + this.userData.City;
      this.userAddressString += ', ' + this.userData.State;
      this.userAddressString += ', (' + this.userData.Pincode + ')';
      this.userAddressString += ', ' + this.userData.Country;
  }

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
  submit() {
    this.hasFormErrors = false;
    const controls = this.addDistributorPurchaseForm.controls;
    /** check form */
    if (this.addDistributorPurchaseForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        return controls[controlName].markAsTouched()
      }
      );

      this.hasFormErrors = true;
      return;
    }

    const addEditDistributorPurchase = this.prepareDistributorPurchase();
    this.addEditDistributorPurchase(addEditDistributorPurchase);
  }


	/**
	 * Returns prepared data for save
	 */
  prepareDistributorPurchase(): DistributorPurchase {
    const controls = this.addDistributorPurchaseForm.controls;
    const _distributorPurchase = new DistributorPurchase();
    _distributorPurchase.clear();
    _distributorPurchase.loyalty_id = this.purchaseActiveScheme.id;
    _distributorPurchase.scheme_id = controls['scheme_id'].value;
    _distributorPurchase.ss_distributor_id = this.userData.ID
    _distributorPurchase.ss_vendor_id = controls['vendor_id'].value;
    _distributorPurchase.vendor_name = controls['vendor_name'].value;
    _distributorPurchase.distributor_id = this.userData.ID;
    _distributorPurchase.poID = controls['poID'].value;
    _distributorPurchase.godownID = controls['godownID'].value;
    _distributorPurchase.isShippingAddressSameAsDispatch = controls['isShippingAddressSameAsDispatch'].value;
    _distributorPurchase.Address_Master_ID = controls['Address_Master_ID'].value;
    _distributorPurchase.vendor_Address_Master_ID = controls['vendor_Address_Master_ID'].value;
    _distributorPurchase.AddressLine1 = controls['AddressLine1'].value;
    _distributorPurchase.AddressLine2 = controls['AddressLine2'].value;
    _distributorPurchase.City = controls['City'].value;
    _distributorPurchase.State = controls['State'].value;
    _distributorPurchase.Country = controls['Country'].value;
    _distributorPurchase.Pincode = controls['Pincode'].value;
    _distributorPurchase.paymentMode = controls['paymentMode'].value;
    _distributorPurchase.bankName = controls['bankName'].value;
    _distributorPurchase.cheqNo = controls['cheqNo'].value;
    _distributorPurchase.cheqDate = this.datePipe.transform(controls['cheqDate'].value, "yyyy-MM-dd");
    _distributorPurchase.frightTerm = controls['frightTerm'].value;
    _distributorPurchase.dcNo = controls['dcNo'].value;
    _distributorPurchase.grNo = controls['grNo'].value;
    _distributorPurchase.transporter = controls['transporter'].value;
    _distributorPurchase.deliveryDays = controls['deliveryDays'].value;
    _distributorPurchase.remarks = controls['remarks'].value;
    _distributorPurchase.erpInvoiceNo = controls['erpInvoiceNo'].value;
    _distributorPurchase.date = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    _distributorPurchase.Tax_Type = (this.isSGSTTax) ? 'SGST' : (this.isIGSTTax ? 'IGST' : '');
    _distributorPurchase.products_json = JSON.stringify(this.prepareProduct())
    return _distributorPurchase;
  }

  /**
	 * Returns prepared data for product
	 */
  prepareProduct(): Product[] {
    const controls = this.addDistributorPurchaseForm.controls['products'].value;;
    const _products = [];

    let boost_point = 0;
    if (this.purchaseActiveSchemebooster != undefined)
      boost_point = this.purchaseActiveSchemebooster.boost_point;
    controls.forEach(data => {
      //Clear Product and set default value
      const product = new Product();
      product.clear();
      product.ProductID = data.productCtrl;//Product Original ID
      product.ProductCode = data.productProductCodeCtrl;//Product Original ID
      product.serial_no = JSON.stringify(this.prepareProductSerialNo(data.productsSerialNoCtrl))
      product.ProductAmount = data.productPriceCtrl * data.productQuantityCtrl;//Product Amount:: Product prive * Quantity
      product.Price = data.productPriceCtrl;//Product original price
      product.points = data.productLoyaltyPointCtrl;//Product original point
      product.Quantity = data.productQuantityCtrl;//product original distributorPurchase quantity
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
   * Serial no serialize
   */
  prepareProductSerialNo(controls){
    const _serialNo = [];
    controls.forEach(data => {  
      _serialNo.push(data.serialNumber)
    });
    return _serialNo;
  }

	/**
	 * Add User
	 *
	 * @param _distributorPurchase: User
	 */
  addEditDistributorPurchase(_distributorPurchase: DistributorPurchase) {
    this.loading = true;
    let httpParams = new HttpParams();
    Object.keys(_distributorPurchase).forEach(function (key) {
      httpParams = httpParams.append(key, _distributorPurchase[key]);
    });

    this.distributorPurchaseService
      .createDistributorPurchase(httpParams)
      .pipe(
        tap(response => {
          if (response.status == APP_CONSTANTS.response.SUCCESS) {
            const message = `Distributor Sale has been successfully added.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
            this.router.navigateByUrl('distributor-purchase'); // distributorPurchase listing page
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
    let result = 'Create DistributorPurchase';
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
      data: { addedProductsIds: this.addedProductsIds, isDiscount: true,pageAction:this.pageAction, OptionalSetting:this.OptionalSetting },
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
    const currentProductArray = <FormArray>this.addDistributorPurchaseForm.controls['products'];
    currentProductArray.push(
      this.distributorPurchaseFB.group(res)
    )
    this.commonCalculation()
  }

  commonCalculation() {
    // this.calculateAllProductsTotal()

    //Total Calculate
    const componentFactory = this.resolver.resolveComponentFactory(PopupProductTotalCalculationComponent);
    const viewContainerRef = this.entry;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    componentRef.instance.mainForm = this.addDistributorPurchaseForm;
    componentRef.instance.isSGSTTax = this.isSGSTTax;
    componentRef.instance.isIGSTTax = this.isIGSTTax;
    const sub: Subscription = componentRef.instance.newAddedProductsIds.subscribe(
      event => {
        this.newAddedProductsIdsUpdate(event)
      }
    );
    componentRef.onDestroy(() => { sub.unsubscribe(); });
  }

  newAddedProductsIdsUpdate(ids) {
    this.addedProductsIds = ids.addedProductsIds;
  }

  is_direct_purchase_toggle(event) {
    this.addDistributorPurchaseForm.controls['poID'].setValue('');
    this.resetProductData();
    if (!event.checked) {
      this.viewOrderSelect = true;
      //Load distribiutor
      this.store.select(fromDistributorposelect.selectDistributorposelectLoaded).pipe().subscribe(data => {
        if (data) {
          this.orderSelect$ = this.store.pipe(select(fromDistributorposelect.selectAllDistributorposelect));
        } else {
          let httpParams = new HttpParams();
          httpParams = httpParams.append('ss_distributor_id', JSON.parse(this.userSession).ID);

          this.store.dispatch(new fromDistributorposelect.LoadDistributorposelect(httpParams))
          this.orderSelect$ = this.store.pipe(select(fromDistributorposelect.selectAllDistributorposelect));
        }
      });
      this.viewOrderSelectLoading$ = this.store.pipe(select(fromDistributorposelect.selectDistributorposelectLoading));
    } else {
      this.viewOrderSelect = false;
    }

  }

  purchaseOrderChange(event) {
    this.resetProductData();
    const numberPatern = '^[0-9.,]+$';
    this.store.pipe(select(selectOrderById(event.value))).subscribe((data: any) => {
      this.addDistributorPurchaseForm.controls['vendor_id'].setValue(data.ss_vendor_id)
      this.vendorChange({ value: data.ss_vendor_id })
      const productObject = data.product;
      productObject.forEach((orderProduct: orderProduct) => {
        let productFormArray = {
          productCategoryCtrl: [orderProduct.ProductCatId],
          productSubCategoryCtrl: [orderProduct.ProductSubCatId],
          productCtrl: [orderProduct.ProductID],
          productNameCtrl: [orderProduct.Name],
          productPriceCtrl: [orderProduct.Price],
          productTaxSGSTCtrl: [orderProduct.SGSTTax],
          productTaxSGSTSurchargesCtrl: [orderProduct.SGSTSurcharges],
          productTaxCGSTCtrl: [orderProduct.CGSTTax],
          productTaxCGSTSurchargesCtrl: [orderProduct.CSTSurcharge],
          productTaxIGSTCtrl: [orderProduct.IGSTTax],
          productTaxIGSTSurchargesCtrl: [orderProduct.IGSTSurcharges],
          productOriginalQuantityCtrl: [orderProduct.Quantity],
          productReturnedQuantityCtrl: [0],
          productAcceptedQuantityCtrl: [0],
          productQuantityCtrl: [orderProduct.Quantity,
          Validators.compose([
            Validators.required,
            Validators.pattern(numberPatern),
            Validators.minLength(1),
            Validators.maxLength(5)
          ])

          ],
          productDiscountCtrl: [orderProduct.Discount],
          productLoyaltyPointCtrl: [orderProduct.LoyaltyPoint],
          productBarCodeCtrl: [''],
          productProductCodeCtrl: [''],
          VATPercentageCtrl: [orderProduct.VATPercentage],
          InclusiveExclusiveCtrl: [orderProduct.InclusiveExclusive],
          VATFromCtrl: [orderProduct.VATFrom],
          VATCodeCtrl: [''],
          productsSerialNoCtrl: this.prepareProductSrNoView(orderProduct.Quantity),
        }
        this.createProduct(productFormArray);
      });
    })
  }

  prepareProductSrNoView(quantity): FormArray {
    // const currentProductSerialNoArray = <FormArray>this.saleForm.controls['products']['controls']['productsSerialNoCtrl'];
    const currentProductSerialNoArray = this.distributorPurchaseFB.array([]);

    const numberPatern = '^[0-9.,]+$';
    for (let index = 0; index < quantity; index++) {
      currentProductSerialNoArray.push(
        // this.fb.group({serialNumber:['', Validators.required]})
        this.distributorPurchaseFB.group({serialNumber:['', Validators.compose([
          Validators.required,
          Validators.pattern(numberPatern),
          Validators.minLength(this.userData.companySettings.TotalCharsInSrNo),
          Validators.maxLength(this.userData.companySettings.TotalCharsInSrNo),
        ])]})
        )
    }
    return currentProductSerialNoArray;
  }
  
  resetProductData() {
    const currentProductArray = <FormArray>this.addDistributorPurchaseForm.controls['products'];
    //Clear
    currentProductArray.reset();
    while (currentProductArray.length !== 0) {
      currentProductArray.removeAt(0)
    }
    this.commonCalculation()
  }

  isShippingAddressSameAsDispatch_toggle(event) {
    if (event.checked) {
      this.viewShippingAddress = false;
    } else {
      this.viewShippingAddress = true;
    }
  }

  vendorChange(event) {
    this.resetProductData();
    this.addDistributorPurchaseForm.controls['vendor_Address_Master_ID'].setValue('');
    this.addDistributorPurchaseForm.controls['vendor_name'].setValue('');
    this.vendorAddressString = '';
    this.store.pipe(select(selectVendorById(event.value))).subscribe((data: any) => {
console.log(data);

      if (this.userData.companySettings.ManageSGST == '1') {
        if (this.userData.Tax_Type == 'VAT') this.isSGSTTax = true;
      } else if (this.userData.companySettings.ManageIGST == '1') {
        if (this.userData.Tax_Type == 'CST') this.isIGSTTax = true;
      }

      this.addDistributorPurchaseForm.controls['vendor_Address_Master_ID'].setValue(data.Address_Master_ID);
      this.addDistributorPurchaseForm.controls['vendor_name'].setValue(data.Name);
      this.vendorAddressString = data.Address_Line1;
      this.vendorAddressString += ', ' + data.Address_Line2;
      this.vendorAddressString += ', ' + data.City;
      this.vendorAddressString += ', ' + data.State;
      this.vendorAddressString += ', (' + data.Pincode + ')';
      this.vendorAddressString += ', ' + data.Country;

    })
  }

  formControlValueChanged() {
    this.addDistributorPurchaseForm.get('isShippingAddressSameAsDispatch').valueChanges.subscribe(data => {
      if (data) {
        this.addDistributorPurchaseForm.get('AddressLine1').clearValidators()
        this.addDistributorPurchaseForm.get('AddressLine2').clearValidators()
        this.addDistributorPurchaseForm.get('City').clearValidators()
        this.addDistributorPurchaseForm.get('State').clearValidators()
        this.addDistributorPurchaseForm.get('Country').clearValidators()
      } else {
        this.addDistributorPurchaseForm.get('AddressLine1').setValidators([Validators.required])
        this.addDistributorPurchaseForm.get('AddressLine2').setValidators([Validators.required])
        this.addDistributorPurchaseForm.get('City').setValidators([Validators.required])
        this.addDistributorPurchaseForm.get('State').setValidators([Validators.required])
        this.addDistributorPurchaseForm.get('Country').setValidators([Validators.required])
      }

      this.addDistributorPurchaseForm.get('AddressLine1').updateValueAndValidity();
      this.addDistributorPurchaseForm.get('AddressLine2').updateValueAndValidity();
      this.addDistributorPurchaseForm.get('City').updateValueAndValidity();
      this.addDistributorPurchaseForm.get('State').updateValueAndValidity();
      this.addDistributorPurchaseForm.get('Country').updateValueAndValidity();

    });
  }

  /**
* Checking control validation
*
* @param controlName: string => Equals to formControlName
* @param validationType: string => Equals to valitors name
*/
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.addDistributorPurchaseForm.controls[controlName];
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