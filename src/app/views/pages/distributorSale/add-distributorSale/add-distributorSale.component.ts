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
import { DistributorSale } from '../../../../core/distributorSale/_models/distributorSale.model';
import { EncrDecrServiceService } from '../../../../core/auth/_services/encr-decr-service.service'
import { environment } from '../../../../../environments/environment';
// Components
import { PopupProductComponent } from '../../popup-product/popup-product.component';
import { PopupAddProductComponent } from '../../popup-product/popup-add-product/popup-add-product.component';
import { Product } from '../../../../core/product/_models/product.model'
// import { Distributor } from '../../../../core/distributor/_models/distributor.model'
import { Retailer } from '../../../../core/retailer/_models/retailer.model'
import { DistributorSaleService } from '../../../../core/distributorSale/_services/index'
import { APP_CONSTANTS } from '../../../../../config/default/constants'
import { Logout } from '../../../../core/auth';
import { PopupProductTotalCalculationComponent } from '../../popup-product/popup-add-product/popup-product-total-calculation/popup-product-total-calculation.component'
import { dynamicProductTemplateSetting } from '../../../../core/common/common.model'
// import * as fromDistributor from '../../../../core/distributor'
import * as fromRetailer from '../../../../core/retailer'
import * as fromOrderselect from '../../../../core/orderselect'
import * as fromMetadata from '../../../../core/metadata'
import { selectOrderById } from '../../../../core/orderselect'
import { selectRetailerById } from '../../../../core/retailer'
import { Order, orderProduct } from '../../../../core/order/_models/order.model';
import { FrightTerm, Godown, PaymentMode } from '../../../../core/metadata';

@Component({
  selector: 'kt-add-distributorSale',
  templateUrl: './add-distributorSale.component.html',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
  // styleUrls: ['./add-distributorSale.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDistributorSaleComponent implements OnInit, OnDestroy {
  // Public properties
  distributorSale: DistributorSale;
  addDistributorSaleForm: FormGroup;
  hasFormErrors: boolean = false;
  salesActiveScheme: any;
  salesActiveSchemebooster: any;
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
  retailers$: Observable<Retailer[]>;

  frightTerm$: Observable<FrightTerm[]>;
  godown$: Observable<Godown[]>;
  paymentMode$: Observable<PaymentMode[]>;

  isSGSTTax: boolean = false;
  isIGSTTax: boolean = false;
  step: number;

  orderSelect$: Observable<Order[]>;
  userSession: string;
  retailerAddressString: string = '';
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
	 * @param distributorSaleFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
   * @param EncrDecr: EncrDecrServiceService
   * @param dialog: MatDialog
   * @param datePipe: DatePipe
   * @param distributorSaleService: DistributorSaleService,
   * @param cdr
	 */
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private distributorSaleFB: FormBuilder,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private store: Store<AppState>,
    private layoutConfigService: LayoutConfigService,
    private EncrDecr: EncrDecrServiceService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private distributorSaleService: DistributorSaleService,
    private cdr: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver
  ) {
    this.unsubscribe = new Subject();
    const OptionalSetting = new dynamicProductTemplateSetting();
    OptionalSetting.clear();
    this.OptionalSetting = OptionalSetting;
    this.pageAction = 'addDistributorSale'
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

      this.distributorSale = new DistributorSale();
      this.distributorSale.clear();
      this.initDistributorSale();

      //Load retailer
      this.store.select(fromRetailer.selectRetailerLoaded).pipe().subscribe(data => {
        if (data) {
          this.retailers$ = this.store.pipe(select(fromRetailer.selectAllRetailer));
        } else {
          let httpParams = new HttpParams();
          this.store.dispatch(new fromRetailer.LoadRetailer(httpParams))
          this.retailers$ = this.store.pipe(select(fromRetailer.selectAllRetailer));
        }
      });
      this.viewLoading$ = this.store.pipe(select(fromRetailer.selectRetailerLoading));

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
  initDistributorSale() {
    this.createForm();
    this.subheaderService.setTitle('Add Distributor Sale');
    this.subheaderService.setBreadcrumbs([
      { title: 'Distributor Sale', page: `distributorSale` },
      { title: 'Add Distributor Sale', page: `add-distributorSale` }
    ]);
  }

	/**
	 * Create form
	 */
  createForm() {
    const numberPatern = '^[0-9.,]+$';
    this.addDistributorSaleForm = this.distributorSaleFB.group({
      scheme_id: [this.salesActiveScheme.scheme_id, Validators.required],
      retailer_id: ['', Validators.required],
      retailer_name: [''],
      soID: [''],
      is_direct_sale: [true],
      isShippingAddressSameAsDispatch: [true],
      godownID: ['', Validators.required],
      Address_Master_ID: [''],
      AddressLine1: [''],
      AddressLine2: [''],
      City: [''],
      Pincode: [''],
      State: [''],
      Country: [''],
      products: this.distributorSaleFB.array([], Validators.required),
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
  }

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
  submit() {
    this.hasFormErrors = false;
    const controls = this.addDistributorSaleForm.controls;
    /** check form */
    if (this.addDistributorSaleForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        return controls[controlName].markAsTouched()
      }
      );

      this.hasFormErrors = true;
      return;
    }

    const addEditDistributorSale = this.prepareDistributorSale();
    this.addEditDistributorSale(addEditDistributorSale);
  }


	/**
	 * Returns prepared data for save
	 */
  prepareDistributorSale(): DistributorSale {
    const controls = this.addDistributorSaleForm.controls;
    const _distributorSale = new DistributorSale();
    _distributorSale.clear();
    _distributorSale.loyalty_id = this.salesActiveScheme.id;
    _distributorSale.scheme_id = controls['scheme_id'].value;
    _distributorSale.retailer_id = controls['retailer_id'].value;
    _distributorSale.retailer_name = controls['retailer_name'].value;
    _distributorSale.distributor_id = this.userData.ID;
    _distributorSale.soID = controls['soID'].value;
    _distributorSale.godownID = controls['godownID'].value;
    _distributorSale.isShippingAddressSameAsDispatch = controls['isShippingAddressSameAsDispatch'].value;
    _distributorSale.Address_Master_ID = controls['Address_Master_ID'].value;
    _distributorSale.AddressLine1 = controls['AddressLine1'].value;
    _distributorSale.AddressLine2 = controls['AddressLine2'].value;
    _distributorSale.City = controls['City'].value;
    _distributorSale.State = controls['State'].value;
    _distributorSale.Country = controls['Country'].value;
    _distributorSale.Pincode = controls['Pincode'].value;
    _distributorSale.paymentMode = controls['paymentMode'].value;
    _distributorSale.bankName = controls['bankName'].value;
    _distributorSale.cheqNo = controls['cheqNo'].value;
    _distributorSale.cheqDate = this.datePipe.transform(controls['cheqDate'].value, "yyyy-MM-dd");
    _distributorSale.frightTerm = controls['frightTerm'].value;
    _distributorSale.dcNo = controls['dcNo'].value;
    _distributorSale.grNo = controls['grNo'].value;
    _distributorSale.transporter = controls['transporter'].value;
    _distributorSale.deliveryDays = controls['deliveryDays'].value;
    _distributorSale.remarks = controls['remarks'].value;
    _distributorSale.erpInvoiceNo = controls['erpInvoiceNo'].value;
    _distributorSale.erpInvoiceNo = controls['erpInvoiceNo'].value;
    _distributorSale.date = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    _distributorSale.Tax_Type = (this.isSGSTTax) ? 'SGST' : (this.isIGSTTax ? 'IGST' : '');
    _distributorSale.products_json = JSON.stringify(this.prepareProduct())
    return _distributorSale;
  }

  /**
	 * Returns prepared data for product
	 */
  prepareProduct(): Product[] {
    const controls = this.addDistributorSaleForm.controls['products'].value;;
    const _products = [];

    let boost_point = 0;
    if (this.salesActiveSchemebooster != undefined)
      boost_point = this.salesActiveSchemebooster.boost_point;
    controls.forEach(data => {
      //Clear Product and set default value
      const product = new Product();
      product.clear();
      product.ProductID = data.productCtrl;//Product Original ID
      product.ProductCode = data.productProductCodeCtrl;//Product Original ID
      product.serial_no = '';//Serial number
      product.ProductAmount = data.productPriceCtrl * data.productQuantityCtrl;//Product Amount:: Product prive * Quantity
      product.Price = data.productPriceCtrl;//Product original price
      product.points = data.productLoyaltyPointCtrl;//Product original point
      product.Quantity = data.productQuantityCtrl;//product original distributorSale quantity
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
	 * @param _distributorSale: User
	 */
  addEditDistributorSale(_distributorSale: DistributorSale) {
    this.loading = true;
    let httpParams = new HttpParams();
    Object.keys(_distributorSale).forEach(function (key) {
      httpParams = httpParams.append(key, _distributorSale[key]);
    });

    this.distributorSaleService
      .createDistributorSale(httpParams)
      .pipe(
        tap(response => {
          if (response.status == APP_CONSTANTS.response.SUCCESS) {
            const message = `Distributor Sale has been successfully added.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
            this.router.navigateByUrl('distributor-sales'); // distributorSale listing page
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
    let result = 'Create DistributorSale';
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
      data: { addedProductsIds: this.addedProductsIds, isDiscount: true },
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
    const currentProductArray = <FormArray>this.addDistributorSaleForm.controls['products'];
    currentProductArray.push(
      this.distributorSaleFB.group(res)
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
    componentRef.instance.mainForm = this.addDistributorSaleForm;
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

  is_direct_sale_toggle(event) {
    this.addDistributorSaleForm.controls['soID'].setValue('');
    this.resetProductData();
    if (!event.checked) {
      this.viewOrderSelect = true;
      //Load distribiutor
      this.store.select(fromOrderselect.selectOrderselectLoaded).pipe().subscribe(data => {
        if (data) {
          this.orderSelect$ = this.store.pipe(select(fromOrderselect.selectAllOrderselect));
        } else {
          let httpParams = new HttpParams();
          let getsalesordersArray = {};
          getsalesordersArray['CompanyID'] = JSON.parse(this.userSession).Company_ID;
          if (JSON.parse(this.userSession).Company_Type_ID == APP_CONSTANTS.USER_ROLE.RETAILER_TYPE)
            getsalesordersArray['CustomerID'] = JSON.parse(this.userSession).ID;
          else
            getsalesordersArray['FulfilledByID'] = JSON.parse(this.userSession).ID;
          httpParams = httpParams.append('TokenID', JSON.parse(this.userSession).Security_Token);
          httpParams = httpParams.append('CompanyID', JSON.parse(this.userSession).Company_ID);
          httpParams = httpParams.append('UserID', JSON.parse(this.userSession).Tagged_To);
          httpParams = httpParams.append('getsalesordersjson', JSON.stringify(getsalesordersArray));

          this.store.dispatch(new fromOrderselect.LoadOrderselect(httpParams))
          this.orderSelect$ = this.store.pipe(select(fromOrderselect.selectAllOrderselect));
        }
      });
      this.viewOrderSelectLoading$ = this.store.pipe(select(fromOrderselect.selectOrderselectLoading));
    } else {
      this.viewOrderSelect = false;
    }

  }

  salesOrderChange(event) {
    this.resetProductData();
    const numberPatern = '^[0-9.,]+$';
    this.store.pipe(select(selectOrderById(event.value))).subscribe((data: any) => {
      this.addDistributorSaleForm.controls['retailer_id'].setValue(data.CustomerID)
      this.retailerChange({ value: data.CustomerID })
      const productObject = data.Products;
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
        }
        this.createProduct(productFormArray);
      });
    })
  }

  resetProductData() {
    const currentProductArray = <FormArray>this.addDistributorSaleForm.controls['products'];
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

  retailerChange(event) {
    this.addDistributorSaleForm.controls['Address_Master_ID'].setValue('');
    this.addDistributorSaleForm.controls['retailer_name'].setValue('');
    this.retailerAddressString = '';
    this.store.pipe(select(selectRetailerById(event.value))).subscribe((data: any) => {

      if (this.userData.companySettings.ManageSGST == '1') {
        if (data.Tax_Type == 'VAT') this.isSGSTTax = true;
      } else if (this.userData.companySettings.ManageIGST == '1') {
        if (data.Tax_Type == 'CST') this.isIGSTTax = true;
      }

      this.addDistributorSaleForm.controls['Address_Master_ID'].setValue(data.Address_Master_ID);
      this.addDistributorSaleForm.controls['retailer_name'].setValue(data.Name);
      this.retailerAddressString = data.Address_Line1;
      this.retailerAddressString += ', ' + data.Address_Line2;
      this.retailerAddressString += ', ' + data.City;
      this.retailerAddressString += ', ' + data.State;
      this.retailerAddressString += ', (' + data.Pincode + ')';
      this.retailerAddressString += ', ' + data.Country;

      this.addDistributorSaleForm.controls['AddressLine1'].setValue(data.Address_Line1);
      this.addDistributorSaleForm.controls['AddressLine2'].setValue(data.Address_Line2);
      this.addDistributorSaleForm.controls['City'].setValue(data.City);
      this.addDistributorSaleForm.controls['State'].setValue(data.State);
      this.addDistributorSaleForm.controls['Country'].setValue(data.Country);

    })
  }

  formControlValueChanged() {
    this.addDistributorSaleForm.get('isShippingAddressSameAsDispatch').valueChanges.subscribe(data => {
      if (data) {
        this.addDistributorSaleForm.get('AddressLine1').clearValidators()
        this.addDistributorSaleForm.get('AddressLine2').clearValidators()
        this.addDistributorSaleForm.get('City').clearValidators()
        this.addDistributorSaleForm.get('State').clearValidators()
        this.addDistributorSaleForm.get('Country').clearValidators()
      } else {
        this.addDistributorSaleForm.get('AddressLine1').setValidators([Validators.required])
        this.addDistributorSaleForm.get('AddressLine2').setValidators([Validators.required])
        this.addDistributorSaleForm.get('City').setValidators([Validators.required])
        this.addDistributorSaleForm.get('State').setValidators([Validators.required])
        this.addDistributorSaleForm.get('Country').setValidators([Validators.required])
      }

      this.addDistributorSaleForm.get('AddressLine1').updateValueAndValidity();
      this.addDistributorSaleForm.get('AddressLine2').updateValueAndValidity();
      this.addDistributorSaleForm.get('City').updateValueAndValidity();
      this.addDistributorSaleForm.get('State').updateValueAndValidity();
      this.addDistributorSaleForm.get('Country').updateValueAndValidity();

    });
  }

  /**
* Checking control validation
*
* @param controlName: string => Equals to formControlName
* @param validationType: string => Equals to valitors name
*/
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.addDistributorSaleForm.controls[controlName];
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