// Angular
import { ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef, ComponentFactory, Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { HttpParams } from "@angular/common/http";
// RxJS
import { BehaviorSubject, Observable, of, Subscription, Subject } from 'rxjs';
import {
	finalize,
	takeUntil,
	tap,
	debounceTime,
	switchMap,
	catchError,
	distinctUntilChanged,
	startWith
} from "rxjs/operators";
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
// Services and Models
import { Order, AddEditOrder } from '../../../../core/order/_models/order.model';
import { EncrDecrServiceService } from '../../../../core/auth/_services/encr-decr-service.service'
import { environment } from '../../../../../environments/environment';
// Components
import { PopupProductComponent } from '../../popup-product/popup-product.component';
import { PopupAddProductComponent } from '../../popup-product/popup-add-product/popup-add-product.component';
import { Product } from '../../../../core/product/_models/product.model'
import { Distributor } from '../../../../core/distributor/_models/distributor.model'
import { OrderService } from '../../../../core/order/_services/index'
import { APP_CONSTANTS } from '../../../../../config/default/constants'
import { Logout } from '../../../../core/auth';
import { PopupProductTotalCalculationComponent } from '../../popup-product/popup-add-product/popup-product-total-calculation/popup-product-total-calculation.component'
import { dynamicProductTemplateSetting } from '../../../../core/common/common.model'
import * as fromDistributor from '../../../../core/distributor'
import * as fromRetailer from '../../../../core/retailer'
import { selectRetailerById } from '../../../../core/retailer'
import { Retailer } from '../../../../core/retailer/_models/retailer.model';
import { DistributorService } from "../../../../core/distributor/_services/distributor.services";
import { RetailerService } from "../../../../core/retailer/_services/retailer.services";
@Component({
  selector: 'kt-add-order',
  templateUrl: './add-order.component.html',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
  // styleUrls: ['./add-order.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddOrderComponent implements OnInit, OnDestroy {
  // Public properties
  order: Order;
  orderForm: FormGroup;
  hasFormErrors: boolean = false;
  orderActiveScheme: any;
  orderActiveSchemebooster: any;
  userData: any;
  componentRef: any;
  loading = false;
  isDistributor = false;
  OptionalSetting: dynamicProductTemplateSetting;
  pageAction: string;
  viewLoading$: Observable<boolean>;
  /** 
	 * Autocomplate distributor
	 */
  distributor$: Observable<Distributor[]>;
	filteredDistributors: Distributor[] = [];
	isLoadingAutosearch = false;
	distributorCharacterLength: Number = 0;
	selectedDistributor = "";
  
  /** 
	 * Autocomplate retailer
	 */
  retailers$: Observable<Retailer[]>;
	filteredRetailers: Retailer[] = [];
	retailerCharacterLength: Number = 0;
	selectedRetailer = "";
  
  // Private properties
  private subscriptions: Subscription[] = [];
  @ViewChild('popupProductCalculation', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;
  today = new Date();
  private addedProductsIds: any[] = [];
  private unsubscribe: Subject<any>;
  isSGSTTax: boolean = false;
  isIGSTTax: boolean = false;
  step: number;
	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param orderFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
   * @param EncrDecr: EncrDecrServiceService
   * @param dialog: MatDialog
   * @param datePipe: DatePipe
   * @param orderService: OrderService,
   * @param distributorService: DistributorService,
   * @param retailerService: RetailerService,
   * @param cdr
	 */
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private orderFB: FormBuilder,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private store: Store<AppState>,
    private layoutConfigService: LayoutConfigService,
    private EncrDecr: EncrDecrServiceService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private orderService: OrderService,
    private distributorService: DistributorService,
    private retailerService: RetailerService,
    private cdr: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver
  ) {
    this.unsubscribe = new Subject();
    const OptionalSetting = new dynamicProductTemplateSetting();
    OptionalSetting.clear();
    OptionalSetting.displayPointCalculation = false;
    this.OptionalSetting = OptionalSetting;

    this.pageAction = 'addOrder'

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
      this.isDistributor = (this.userData.Company_Type_ID == APP_CONSTANTS.USER_ROLE.DISTRIBUTOR_TYPE) ? true : false;
      if (!this.isDistributor) {
        if (this.userData.companySettings.ManageSGST == '1') {
          if (this.userData.Tax_Type == 'VAT') this.isSGSTTax = true;
        } else if (this.userData.companySettings.ManageIGST == '1') {
          if (this.userData.Tax_Type == 'CST') this.isIGSTTax = true;
        }
      }
      this.initOrder();

      // if (this.isDistributor) {
      //   //Load retailer
      //   this.store.select(fromRetailer.selectRetailerLoaded).pipe().subscribe(data => {
      //     if (data) {
      //       this.retailers$ = this.store.pipe(select(fromRetailer.selectAllRetailer));
      //     } else {
      //       let httpParams = new HttpParams();
      //       this.store.dispatch(new fromRetailer.LoadRetailer(httpParams))
      //       this.retailers$ = this.store.pipe(select(fromRetailer.selectAllRetailer));
      //     }
      //   });
      //   this.viewLoading$ = this.store.pipe(select(fromRetailer.selectRetailerLoading));
      // } else {
      //   //Load distribiutor
      //   this.store.select(fromDistributor.selectDistributorLoaded).pipe().subscribe(data => {
      //     if (data) {
      //       this.distributor$ = this.store.pipe(select(fromDistributor.selectAllDistributor));
      //     } else {
      //       let httpParams = new HttpParams();
      //       this.store.dispatch(new fromDistributor.LoadDistributor(httpParams))
      //       this.distributor$ = this.store.pipe(select(fromDistributor.selectAllDistributor));
      //     }
      //   });
      //   this.viewLoading$ = this.store.pipe(select(fromDistributor.selectDistributorLoading));
      // }
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
  initOrder() {
    this.createForm();
    this.subheaderService.setTitle('Add Order');
    this.subheaderService.setBreadcrumbs([
      { title: 'Order', page: `order` },
      { title: 'Add Order', page: `add-order` }
    ]);
  }

	/**
	 * Create form
	 */
  createForm() {
    this.orderForm = this.orderFB.group({
      Description: [''],
      products: this.orderFB.array([], Validators.required)
    });
    if (this.userData.Company_Type_ID == APP_CONSTANTS.USER_ROLE.DISTRIBUTOR_TYPE) {
      this.orderForm.addControl('retailer_id', new FormControl('', Validators.required));
      this.orderForm.addControl('retailer_name', new FormControl(''));
    } else {
      this.orderForm.addControl('distributor_id', new FormControl('', Validators.required));
      this.orderForm.addControl('distributor_name', new FormControl(''));
    }


  }

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
  submit() {
    this.hasFormErrors = false;
    const controls = this.orderForm.controls;
    /** check form */
    if (this.orderForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        return controls[controlName].markAsTouched()
      }
      );

      this.hasFormErrors = true;
      return;
    }

    const addEditOrder = this.prepareAddEditOrder();
    this.addEditOrder(addEditOrder);
  }

	/**
	 * Returns prepared data for save
	 */
  prepareAddEditOrder(): AddEditOrder {
    const _addEditOrder = new AddEditOrder();
    _addEditOrder.clear();
    _addEditOrder.addsalesorderproductjson = JSON.stringify(this.prepareProduct())
    _addEditOrder.addsalesorderjson = JSON.stringify(this.prepareOrder())
    _addEditOrder.CompanyID = this.userData.Company_ID;
    _addEditOrder.UserID = this.userData.ID;
    _addEditOrder.TokenID = this.userData.Security_Token;
    return _addEditOrder;
  }

  /**
	 * Returns prepared data for save
	 */
  prepareOrder(): Order {
    const controls = this.orderForm.controls;
    const _order = new Order();
    _order.clear();
    _order.SOMadeBy = (this.userData.Company_Type_ID == APP_CONSTANTS.USER_ROLE.RETAILER_TYPE) ? 'Retailer' : 'Distributor'
    _order.AssignedTo = this.userData.Tagged_To;
    _order.CreatedBy = this.userData.Tagged_To;
    _order.CompanyID = this.userData.Company_ID;
    _order.CustomerID = (this.userData.Company_Type_ID == APP_CONSTANTS.USER_ROLE.RETAILER_TYPE) ? this.userData.ID : controls['retailer_id'].value;
    _order.FulfilledByID = (this.userData.Company_Type_ID == APP_CONSTANTS.USER_ROLE.RETAILER_TYPE) ? controls['distributor_id'].value : this.userData.ID;
    _order.Description = controls['Description'].value;
    _order.SeriesPrefix = _order.SeriesPrefix + '' + this.userData.companySettings.SalesOrderFormat;
    let productDataCalculation = this.productDataCalculation();
    
    _order.NetAmount = productDataCalculation['totalProductNetAmount'];
    _order.GrossAmount = productDataCalculation['totalGrossAmount'];
    _order.LocalTaxValue = productDataCalculation['totalLocalTaxValue'];
    return _order;
  }

  /**
	 * Returns prepared data for product
	 */
  productDataCalculation(): any[] {
    const controls = this.orderForm.controls['products'].value;;
    let totalProduct = new Array();
    let _totalProductAmount = 0;
    let _totalProductDiscountAmount = 0;
    let _totalGrossAmount = 0;
    let _totalLocalTaxValue = 0;
    let _totalProductNetAmount = 0;

    controls.forEach(data => {
      let productAmount = 0
      let productDiscount = 0
      let productGrossAmount = 0
      let productSGSTTaxAmount = 0
      let productCGSTTaxAmount = 0
      let productIGSTTaxAmount = 0
      let productTaxAmount = 0;
      let productNetAmount = 0;

      productAmount = data.productPriceCtrl * data.productQuantityCtrl;
      productDiscount = (productAmount * data.productDiscountCtrl)/100;
      productGrossAmount = productAmount - productDiscount;
      productSGSTTaxAmount = (productGrossAmount * data.productTaxSGSTCtrl)/100;
      productCGSTTaxAmount = (productGrossAmount * data.productTaxCGSTCtrl)/100;
      productIGSTTaxAmount = (productGrossAmount * data.productTaxIGSTCtrl)/100;
      _totalProductAmount += productAmount;
      _totalProductDiscountAmount += productDiscount;
      _totalGrossAmount += productGrossAmount;

      if(this.isSGSTTax){
        productTaxAmount = (productSGSTTaxAmount + productCGSTTaxAmount);
      } else if(this.isIGSTTax){
        productTaxAmount = productIGSTTaxAmount;
        }
      _totalLocalTaxValue += productTaxAmount;

      productNetAmount = productGrossAmount + productTaxAmount;
      _totalProductNetAmount  += productNetAmount;

    });
    totalProduct['totalProductAmount'] = _totalProductAmount;
    totalProduct['totalProductDiscountAmount'] = _totalProductDiscountAmount;
    totalProduct['totalGrossAmount'] = _totalGrossAmount;
    totalProduct['totalLocalTaxValue'] = _totalLocalTaxValue;
    totalProduct['totalProductNetAmount'] = _totalProductNetAmount;
    
    return totalProduct;
  }

    /**
	 * Returns prepared data for product
	 */
  prepareProduct(): Product[] {
    const controls = this.orderForm.controls['products'].value;;
    const _products = [];

    controls.forEach(data => {
      //Clear Product and set default value
      const product = new Product();
      product.clear();
      product.ProductID = data.productCtrl;//Product Original ID
      product.ProductCode = data.productProductCodeCtrl;//Product Original ID
      product.serial_no = '';//Serial number
      product.ProductAmount = data.productPriceCtrl * data.productQuantityCtrl;//Product Amount:: Product prive * Quantity
      product.Price = data.productPriceCtrl;//Product original price
      product.Quantity = data.productQuantityCtrl;//product original order quantity
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
    });
    return _products;
  }

	/**
	 * Add User
	 *
	 * @param _order: User
	 */
  addEditOrder(_order: AddEditOrder) {
    this.loading = true;
    let httpParams = new HttpParams();
    Object.keys(_order).forEach(function (key) {
      httpParams = httpParams.append(key, _order[key]);
    });

    this.orderService
      .createOrder(httpParams)
      .pipe(
        tap(response => {
          if (response.status == APP_CONSTANTS.response.SUCCESS) {
            const message = `Order successfully has been added.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
            this.router.navigateByUrl('order'); // order listing page
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
    let result = 'Create Order';
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
    const currentProductArray = <FormArray>this.orderForm.controls['products'];
    currentProductArray.push(
      this.orderFB.group(res)
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
    componentRef.instance.mainForm = this.orderForm;
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

  retailerChange(event) {
    let data = event.option.value;
    // this.store.pipe(select(selectRetailerById(event.value))).subscribe((data: any) => {
      if (this.userData.companySettings.ManageSGST == '1') {
        if (data.Tax_Type == 'VAT') this.isSGSTTax = true;
      } else if (this.userData.companySettings.ManageIGST == '1') {
        if (data.Tax_Type == 'CST') this.isIGSTTax = true;
      }
    // })
  }

  /**
* Checking control validation
*
* @param controlName: string => Equals to formControlName
* @param validationType: string => Equals to valitors name
*/
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.orderForm.controls[controlName];
    if (!control) {
      return false;
    }
    if (controlName == 'products') {
      const result = control.hasError(validationType);
      return result;
    }else if (controlName == "distributor_id") {
			const result = control.hasError(validationType)
			return result;
		}else if (controlName == "retailer_id") {
			const result = control.hasError(validationType)
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

  /** 
   * Distributor Autocomplate
   */
  ngAfterViewInit(): void {
    if (this.userData.Company_Type_ID == APP_CONSTANTS.USER_ROLE.DISTRIBUTOR_TYPE) {
      this.loadRetailer();	
    }else{
      this.loadDistributor();	
    }
	}
	loadDistributor() {
		/**
		 * Autosearch impliment
		 */
		let httpParams = new HttpParams();
		// httpParams = httpParams.append("CompanyID", this.userData.Company_ID);
		// httpParams = httpParams.append("UserID", this.userData.Tagged_To);
		httpParams = httpParams.append("device_name", 'web');
		httpParams = httpParams.append("token_id", this.userData.Security_Token);
		httpParams = httpParams.append("company_id", this.userData.Company_ID);
		httpParams = httpParams.append("user_id", this.userData.ID);
		httpParams = httpParams.append("pageNumber", "0");
		httpParams = httpParams.append("pageSize", "20");
		httpParams = httpParams.append("Filter", "");

		this.orderForm
			.get("distributor_name")
			.valueChanges.pipe(
				debounceTime(300),
				tap((value:any) => {
					if(!value.ID){
						this.orderForm.controls["distributor_id"].setValue(null);
					}else{
						this.orderForm.controls["distributor_id"].setValue(value.ID);
					}
					if (value != null) {
						this.distributorCharacterLength = value.length;
						if (value.length > 2) {
							this.isLoadingAutosearch = true;
						}
					} else {
						this.distributorCharacterLength = 0;
					}
				}),
				switchMap((value: string) => {
					if (value != null && value.length > 2) {
						httpParams = httpParams.set("Filter", value);
						return this.distributorService
							.search(httpParams)
							.pipe(
								finalize(
									() => (this.isLoadingAutosearch = false)
								)
							);
					} else {
						return [];
					}
				})
			)
			.subscribe(distribiutors => {
				this.filteredDistributors = distribiutors.map;
			});
  }
  
	displayFn(distribiutor?: any): string | undefined {
		this.selectedDistributor = distribiutor ? distribiutor.ID : "";
		return distribiutor ? distribiutor.Name : undefined;
	}
  
  loadRetailer() {
		/**
		 * Autosearch impliment
		 */
		let httpParams = new HttpParams();
		// httpParams = httpParams.append("CompanyID", this.userData.Company_ID);
		// httpParams = httpParams.append("UserID", this.userData.Tagged_To);
		httpParams = httpParams.append("device_name", 'web');
		httpParams = httpParams.append("token_id", this.userData.Security_Token);
		httpParams = httpParams.append("company_id", this.userData.Company_ID);
		httpParams = httpParams.append("user_id", this.userData.ID);
		httpParams = httpParams.append("pageNumber", "0");
		httpParams = httpParams.append("pageSize", "20");
		httpParams = httpParams.append("Filter", "");

		this.orderForm
			.get("retailer_name")
			.valueChanges.pipe(
				debounceTime(300),
				tap((value:any) => {
					if(!value.ID){
						this.orderForm.controls["retailer_id"].setValue(null);
					}else{
						this.orderForm.controls["retailer_id"].setValue(value.ID);
					}
					if (value != null) {
						this.retailerCharacterLength = value.length;
						if (value.length > 2) {
							this.isLoadingAutosearch = true;
						}
					} else {
						this.retailerCharacterLength = 0;
					}
				}),
				switchMap((value: string) => {
					if (value != null && value.length > 2) {
						httpParams = httpParams.set("Filter", value);
						return this.retailerService
							.search(httpParams)
							.pipe(
								finalize(
									() => (this.isLoadingAutosearch = false)
								)
							);
					} else {
						return [];
					}
				})
			)
			.subscribe(retailers => {
				this.filteredRetailers = retailers.map;
			});
  }
  
  displayFnRetailer(retailers?: any): string | undefined {
		this.selectedRetailer = retailers ? retailers.ID : "";
		return retailers ? retailers.Name : undefined;
  }

}