// Angular
import {
	ViewContainerRef,
	ViewChild,
	ComponentFactoryResolver,
	ComponentRef,
	ComponentFactory,
	Component,
	OnInit,
	OnDestroy,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	ViewEncapsulation
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { HttpParams } from "@angular/common/http";
// RxJS
import {
	BehaviorSubject,
	Observable,
	of,
	Subscription,
	Subject,
	concat
} from "rxjs";
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
import { Store, select } from "@ngrx/store";
import { Update } from "@ngrx/entity";
import { AppState } from "../../../../core/reducers";
// Layout
import {
	SubheaderService,
	LayoutConfigService
} from "../../../../core/_base/layout";
import { LayoutUtilsService, MessageType } from "../../../../core/_base/crud";
// Services and Models
import { DistributorPurchaseOrder } from "../../../../core/distributorPurchaseOrder/_models/distributorPurchaseOrder.model";
import { EncrDecrServiceService } from "../../../../core/auth/_services/encr-decr-service.service";
import { environment } from "../../../../../environments/environment";
// Components
import { PopupProductComponent } from "../../popup-product/popup-product.component";
import { PopupAddProductComponent } from "../../popup-product/popup-add-product/popup-add-product.component";
import { Product } from "../../../../core/product/_models/product.model";
import { Distributor } from "../../../../core/distributor/_models/distributor.model";
import { Vendor } from "../../../../core/vendor/_models/vendor.model";
import { DistributorPurchaseOrderService } from "../../../../core/distributorPurchaseOrder/_services/index";
import { Order, AddEditOrder } from '../../../../core/order/_models/order.model';
import { APP_CONSTANTS } from "../../../../../config/default/constants";
import { Logout } from "../../../../core/auth";
import { PopupProductTotalCalculationComponent } from "../../popup-product/popup-add-product/popup-product-total-calculation/popup-product-total-calculation.component";
import { dynamicProductTemplateSetting } from "../../../../core/common/common.model";
import * as fromDistributor from "../../../../core/distributor";
import * as fromVendor from "../../../../core/vendor";
import { DistributorService } from "../../../../core/distributor/_services/distributor.services";
import { VendorService } from "../../../../core/vendor/_services/vendor.services";
import { isInteger } from 'lodash';

@Component({
	selector: "kt-add-distributorPurchaseOrder",
	templateUrl: "./add-distributorPurchaseOrder.component.html",
	providers: [DatePipe],
	encapsulation: ViewEncapsulation.None
	// styleUrls: ['./add-distributorPurchaseOrder.component.scss'],
	// changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDistributorPurchaseOrderComponent implements OnInit, OnDestroy {
	// Public properties
	distributorPurchaseOrder: DistributorPurchaseOrder;
	distributorPurchaseOrderForm: FormGroup;
	hasFormErrors: boolean = false;
	userData: any;
	componentRef: any;
	loading = false;
	OptionalSetting: dynamicProductTemplateSetting;
	pageAction: string;
	viewLoading$: Observable<boolean>;
	/** 
	 * Autocomplate distributor
	 */
	vendor$: Observable<Vendor[]>;
	filteredVendors: Vendor[] = [];
	isLoadingAutosearch = false;
	vendorCharacterLength: Number = 0;
	selectedVendor = "";
	vendorInput$ = new Subject<string>();
	// Private properties
	private subscriptions: Subscription[] = [];
	@ViewChild("popupProductCalculation", {
		read: ViewContainerRef,
		static: true
	})
	entry: ViewContainerRef;
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
	 * @param distributorPurchaseOrderFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 * @param EncrDecr: EncrDecrServiceService
	 * @param dialog: MatDialog
	 * @param datePipe: DatePipe
	 * @param distributorPurchaseOrderService: DistributorPurchaseOrderService,
	 * @param vendorService: VendorService,
	 * @param cdr
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private distributorPurchaseOrderFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService,
		private EncrDecr: EncrDecrServiceService,
		public dialog: MatDialog,
		private datePipe: DatePipe,
		private distributorPurchaseOrderService: DistributorPurchaseOrderService,
		private vendorService: VendorService,
		private cdr: ChangeDetectorRef,
		private resolver: ComponentFactoryResolver
	) {
		this.unsubscribe = new Subject();
		const OptionalSetting = new dynamicProductTemplateSetting();
		OptionalSetting.clear();
		this.OptionalSetting = OptionalSetting;
		this.OptionalSetting.displayPointCalculation = false;
		this.pageAction = "addDistributorPurchaseOrder";
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(
			params => {
				let sessionStorage = this.EncrDecr.getLocalStorage(
					environment.localStorageKey
				);
				this.userData = JSON.parse(sessionStorage);

				if(this.userData.companySettings.PriceEditableDistributorPOSTrade == '1'){
						this.OptionalSetting.isPriceEditable = true;
					}

				if (this.userData.companySettings.ManageSGST == "1") {
					if (this.userData.Tax_Type == "VAT") this.isSGSTTax = true;
				} else if (this.userData.companySettings.ManageIGST == "1") {
					if (this.userData.Tax_Type == "CST") this.isIGSTTax = true;
				}

				this.distributorPurchaseOrder = new DistributorPurchaseOrder();
				this.distributorPurchaseOrder.clear();
				this.initDistributorPurchaseOrder();
			}
		);
		this.subscriptions.push(routeSubscription);

		
	}
	ngAfterViewInit(): void {
		this.loadDistributor();	
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

		this.distributorPurchaseOrderForm
			.get("vendor_name")
			.valueChanges.pipe(
				debounceTime(300),
				tap(value => {
					if(!value.ID){
						this.distributorPurchaseOrderForm.controls["vendor_id"].setValue(null);
					}else{
						this.distributorPurchaseOrderForm.controls["vendor_id"].setValue(value.ID);
					}
					if (value != null) {
						this.vendorCharacterLength = value.length;
						if (value.length > 2) {
							this.isLoadingAutosearch = true;
						}
					} else {
						this.vendorCharacterLength = 0;
					}
				}),
				switchMap((value: string) => {
					if (value != null && value.length > 2) {
						httpParams = httpParams.set("Filter", value);
						return this.vendorService
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
			.subscribe(vendors => {
				this.filteredVendors = vendors.map;
			});
	}
	displayFn(vendor?: any): string | undefined {
		this.selectedVendor = vendor ? vendor.ID : "";
		return vendor ? vendor.Name : undefined;
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
	initDistributorPurchaseOrder() {
		this.createForm();
		this.subheaderService.setTitle("Add Distributor Purchase Order");
		this.subheaderService.setBreadcrumbs([
			{ title: "Distributor PurchaseOrder", page: `distributorPurchaseOrder` },
			{ title: "Add Distributor PurchaseOrder", page: `add-distributorPurchaseOrder` }
		]);
	}

	/**
	 * Create form
	 */
	createForm() {
		this.distributorPurchaseOrderForm = this.distributorPurchaseOrderFB.group({
			vendor_id: ["", Validators.required],
			vendor_name: [""],
			Description: [''],
			products: this.distributorPurchaseOrderFB.array([], Validators.required)
		});
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	submit() {
		this.hasFormErrors = false;
		const controls = this.distributorPurchaseOrderForm.controls;
		/** check form */
		if (this.distributorPurchaseOrderForm.invalid) {
			Object.keys(controls).forEach(controlName => {
				return controls[controlName].markAsTouched();
			});

			this.hasFormErrors = true;
			return;
		}

		const addEditDistributorPurchaseOrder = this.prepareDistributorPurchaseOrder();
		this.addEditDistributorPurchaseOrder(addEditDistributorPurchaseOrder);
	}

	/**
	 * Returns prepared data for save
	 */
	prepareDistributorPurchaseOrder(): DistributorPurchaseOrder {
		const controls = this.distributorPurchaseOrderForm.controls;
		const _distributorPurchaseOrder = new DistributorPurchaseOrder();
		_distributorPurchaseOrder.clear();
		_distributorPurchaseOrder.vendor_Name = controls["vendor_name"].value;
		_distributorPurchaseOrder.ss_vendor_id = controls["vendor_id"].value;
		_distributorPurchaseOrder.ss_distributor_id = this.userData.ID;
		_distributorPurchaseOrder.remarks = controls["Description"].value;
		_distributorPurchaseOrder.date = this.datePipe.transform(new Date(), "yyyy-MM-dd");
		_distributorPurchaseOrder.Tax_Type = this.isSGSTTax
			? "SGST"
			: this.isIGSTTax
			? "IGST"
			: "";
		_distributorPurchaseOrder.products_json = JSON.stringify(this.prepareProduct());
		_distributorPurchaseOrder.addsalesorderjson = JSON.stringify(this.prepareOrder())
		return _distributorPurchaseOrder;
	}

	
  /**
	 * Returns prepared data for save
	 */
	prepareOrder(): Order {
		const controls = this.distributorPurchaseOrderForm.controls;
		const _order = new Order();
		_order.clear();
		_order.SOMadeBy = 'Distributor'
		_order.AssignedTo = this.userData.Tagged_To;
		_order.CreatedBy = this.userData.Tagged_To;
		_order.CompanyID = this.userData.Company_ID;
		_order.CustomerID = controls['vendor_id'].value
		_order.FulfilledByID = this.userData.ID;
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
		const controls = this.distributorPurchaseOrderForm.controls['products'].value;;
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
		const controls = this.distributorPurchaseOrderForm.controls["products"].value;
		const _products = [];

		controls.forEach(data => {
			//Clear Product and set default value
			const product = new Product();
			product.clear();
			product.ProductID = data.productCtrl; //Product Original ID
			product.ProductCode = data.productProductCodeCtrl; //Product Original ID
			product.serial_no = ""; //Serial number
			product.ProductAmount =
				data.productPriceCtrl * data.productQuantityCtrl; //Product Amount:: Product prive * Quantity
			product.Price = data.productPriceCtrl; //Product original price
			product.Quantity = data.productQuantityCtrl; //product original distributorPurchaseOrder quantity
			product.Discount = data.productDiscountCtrl; //product original discount(%)
			product.SGSTTax = data.productTaxSGSTCtrl; //Product original SGST Tax(%)
			product.SGSTSurcharges = data.productTaxSGSTSurchargesCtrl; //Product original SGST Surcharges Tax(%)
			product.CGSTTax = data.productTaxCGSTCtrl; //Product original CGST Tax(%)
			product.CGSTSurcharges = data.productTaxCGSTSurchargesCtrl; //Product original CGST Surcharges Tax(%)
			product.IGSTTax = data.productTaxIGSTCtrl; //Product original IGST Tax(%)
			product.IGSTSurcharges = data.productTaxIGSTSurchargesCtrl; //Product original IGST Surcharges Tax(%)
			product.VATPercentage = data.productVATPercentage; //Product original Vat perchantage(%)
			product.InclusiveExclusive = data.InclusiveExclusiveTax; //Product TAX inclusive or exclusive:: no any effect of this field
			product.VATFrom = data.productVATFrom; //Product vat from customer OR Other side
			
			_products.push(product);
		});
		return _products;
	}

	/**
	 * Add User
	 *
	 * @param _distributorPurchaseOrder: User
	 */
	addEditDistributorPurchaseOrder(_distributorPurchaseOrder: DistributorPurchaseOrder) {
		this.loading = true;
		let httpParams = new HttpParams();
		Object.keys(_distributorPurchaseOrder).forEach(function(key) {
			httpParams = httpParams.append(key, _distributorPurchaseOrder[key]);
		});

		this.distributorPurchaseOrderService
			.createDistributorPurchaseOrder(httpParams)
			.pipe(
				tap(response => {
					if (response.status == APP_CONSTANTS.response.SUCCESS) {
						const message = `Distributor PurchaseOrder successfully has been added.`;
						this.layoutUtilsService.showActionNotification(
							message,
							MessageType.Create,
							5000,
							false,
							false
						);
						this.router.navigateByUrl("distributor-purchase-order"); // distributorPurchaseOrder listing page
					} else if (
						response.status == APP_CONSTANTS.response.ERROR
					) {
						const message = response.message;
						this.layoutUtilsService.showActionNotification(
							message,
							MessageType.Create,
							5000,
							false,
							false
						);
					} else {
						const message = "Invalid token! Please login again";
						this.layoutUtilsService.showActionNotification(
							message,
							MessageType.Create,
							5000,
							false,
							false
						);
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
		let result = "Create DistributorPurchaseOrder";
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
			data: {
				addedProductsIds: this.addedProductsIds,
				isDiscount: false,
				pageAction:this.pageAction, 
				OptionalSetting:this.OptionalSetting
			},
			// data: { addedProductsIds: [] },
			width: "600px"
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			/**
			 * try to add dynamic child
			 */
			this.createProduct(res);

			this.layoutUtilsService.showActionNotification(
				_saveMessage,
				_messageType,
				2000,
				false,
				false
			);
		});
	}

	/**
	 * try to add dynamic product
	 */
	createProduct(res) {
		const currentProductArray = <FormArray>(
			this.distributorPurchaseOrderForm.controls["products"]
		);
		currentProductArray.push(this.distributorPurchaseOrderFB.group(res));
		this.commonCalculation();
	}

	commonCalculation() {
		// this.calculateAllProductsTotal()

		//Total Calculate
		const componentFactory = this.resolver.resolveComponentFactory(
			PopupProductTotalCalculationComponent
		);
		// const viewContainerRef = this.entry.viewContainerRef;
		const viewContainerRef = this.entry;
		viewContainerRef.clear();
		const componentRef = viewContainerRef.createComponent(componentFactory);
		componentRef.instance.mainForm = this.distributorPurchaseOrderForm;
		componentRef.instance.isSGSTTax = this.isSGSTTax;
		componentRef.instance.isIGSTTax = this.isIGSTTax;
		const sub: Subscription = componentRef.instance.newAddedProductsIds.subscribe(
			event => {
				// console.log(event)
				this.newAddedProductsIdsUpdate(event);
			}
		);
		componentRef.onDestroy(() => {
			sub.unsubscribe();
		});
	}

	newAddedProductsIdsUpdate(ids) {
		this.addedProductsIds = ids.addedProductsIds;
		// console.log(this.addedProductsIds);
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.distributorPurchaseOrderForm.controls[controlName];
		if (!control) {
			return false;
		}
		if (controlName == "products") {
			const result = control.hasError(validationType);
			return result;
		}else if (controlName == "vendor_id") {
			const result = control.hasError(validationType)
			return result;
		} else {
			const result =
				control.hasError(validationType) &&
				(control.dirty || control.touched);
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