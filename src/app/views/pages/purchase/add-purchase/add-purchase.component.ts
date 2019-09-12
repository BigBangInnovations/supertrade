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
import { Purchase } from "../../../../core/purchase/_models/purchase.model";
import { getPurchaseActiveScheme } from "../../../../core/auth/_selectors/auth.selectors";
import { EncrDecrServiceService } from "../../../../core/auth/_services/encr-decr-service.service";
import { environment } from "../../../../../environments/environment";
// Components
import { PopupProductComponent } from "../../popup-product/popup-product.component";
import { PopupAddProductComponent } from "../../popup-product/popup-add-product/popup-add-product.component";
import { Product } from "../../../../core/product/_models/product.model";
import { Distributor } from "../../../../core/distributor/_models/distributor.model";
import { PurchaseService } from "../../../../core/purchase/_services/index";
import { APP_CONSTANTS } from "../../../../../config/default/constants";
import { Logout } from "../../../../core/auth";
import { PopupProductTotalCalculationComponent } from "../../popup-product/popup-add-product/popup-product-total-calculation/popup-product-total-calculation.component";
import { dynamicProductTemplateSetting } from "../../../../core/common/common.model";
import * as fromDistributor from "../../../../core/distributor";
import { DistributorService } from "../../../../core/distributor/_services/distributor.services";
import { isInteger } from 'lodash';

@Component({
	selector: "kt-add-purchase",
	templateUrl: "./add-purchase.component.html",
	providers: [DatePipe],
	encapsulation: ViewEncapsulation.None
	// styleUrls: ['./add-purchase.component.scss'],
	// changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPurchaseComponent implements OnInit, OnDestroy {
	// Public properties
	purchase: Purchase;
	purchaseForm: FormGroup;
	hasFormErrors: boolean = false;
	purchaseActiveScheme: any;
	purchaseActiveSchemebooster: any;
	userData: any;
	componentRef: any;
	loading = false;
	OptionalSetting: dynamicProductTemplateSetting;
	pageAction: string;
	viewLoading$: Observable<boolean>;
	distributor$: Observable<Distributor[]>;
	distributor1$: Observable<Distributor[]>;
	filteredDistributors: Distributor[] = [];
	isLoadingAutosearch = false;
	distributorCharacterLength: Number = 0;
	selectedDistributor = "";
	distributorInput$ = new Subject<string>();
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
	 * @param purchaseFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 * @param EncrDecr: EncrDecrServiceService
	 * @param dialog: MatDialog
	 * @param datePipe: DatePipe
	 * @param purchaseService: PurchaseService,
	 * @param distributorService: DistributorService,
	 * @param cdr
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private purchaseFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService,
		private EncrDecr: EncrDecrServiceService,
		public dialog: MatDialog,
		private datePipe: DatePipe,
		private purchaseService: PurchaseService,
		private distributorService: DistributorService,
		private cdr: ChangeDetectorRef,
		private resolver: ComponentFactoryResolver
	) {
		this.unsubscribe = new Subject();
		const OptionalSetting = new dynamicProductTemplateSetting();
		OptionalSetting.clear();
		this.OptionalSetting = OptionalSetting;
		this.pageAction = "addPurchase";
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

				if (this.userData.companySettings.ManageSGST == "1") {
					if (this.userData.Tax_Type == "VAT") this.isSGSTTax = true;
				} else if (this.userData.companySettings.ManageIGST == "1") {
					if (this.userData.Tax_Type == "CST") this.isIGSTTax = true;
				}

				this.purchaseActiveScheme = this.userData.purchaseActiveScheme[0];
				this.purchaseActiveSchemebooster = this.userData.purchaseActiveSchemeBooster[0];

				this.purchase = new Purchase();
				this.purchase.clear();
				this.initPurchase();
				if (
					this.userData.companySettings
						.AllowMultipleDistributorInPurchaseSTrade == 111
				) {
					//Load distribiutor
					this.store
						.select(fromDistributor.selectDistributorLoaded)
						.pipe()
						.subscribe(data => {
							if (data) {
								this.distributor$ = this.store.pipe(
									select(fromDistributor.selectAllDistributor)
								);
							} else {
								let httpParams = new HttpParams();
								this.store.dispatch(
									new fromDistributor.LoadDistributor(
										httpParams
									)
								);
								this.distributor$ = this.store.pipe(
									select(fromDistributor.selectAllDistributor)
								);
							}
						});
					this.viewLoading$ = this.store.pipe(
						select(fromDistributor.selectDistributorLoading)
					);
				}
			}
		);
		this.subscriptions.push(routeSubscription);

		
	}
	ngAfterViewInit(): void {
		this.loadDistributor();	
	}
	trackByFn(item: Distributor) {
		console.log("trackByFn item ");
		console.log(item);

		return item.ID;
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

		this.purchaseForm
			.get("distributor_name")
			.valueChanges.pipe(
				debounceTime(300),
				tap(value => {
					if(!value.ID){
						this.purchaseForm.controls["distributor_id"].setValue(null);
					}else{
						this.purchaseForm.controls["distributor_id"].setValue(value.ID);
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

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Init user
	 */
	initPurchase() {
		this.createForm();
		this.subheaderService.setTitle("Add Purchase");
		this.subheaderService.setBreadcrumbs([
			{ title: "Purchase", page: `purchase` },
			{ title: "Add Purchase", page: `add-purchase` }
		]);
	}

	/**
	 * Create form
	 */
	createForm() {
		this.purchaseForm = this.purchaseFB.group({
			scheme_id: [
				this.purchaseActiveScheme.scheme_id,
				Validators.required
			],
			distributor_id: ["", Validators.required],
			distributor_name: [""],
			products: this.purchaseFB.array([], Validators.required)
		});
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	submit() {
		this.hasFormErrors = false;
		const controls = this.purchaseForm.controls;
		/** check form */
		if (this.purchaseForm.invalid) {
			Object.keys(controls).forEach(controlName => {
				return controls[controlName].markAsTouched();
			});

			this.hasFormErrors = true;
			return;
		}

		const addEditPurchase = this.preparePurchase();
		this.addEditPurchase(addEditPurchase);
	}

	/**
	 * Returns prepared data for save
	 */
	preparePurchase(): Purchase {
		const controls = this.purchaseForm.controls;
		const _purchase = new Purchase();
		_purchase.clear();
		_purchase.loyalty_id = this.purchaseActiveScheme.id;
		_purchase.scheme_id = controls["scheme_id"].value;
		_purchase.distributor_id = controls["distributor_id"].value;
		_purchase.date = this.datePipe.transform(new Date(), "yyyy-MM-dd");
		_purchase.Tax_Type = this.isSGSTTax
			? "SGST"
			: this.isIGSTTax
			? "IGST"
			: "";
		_purchase.products_json = JSON.stringify(this.prepareProduct());
		return _purchase;
	}

	/**
	 * Returns prepared data for product
	 */
	prepareProduct(): Product[] {
		const controls = this.purchaseForm.controls["products"].value;
		const _products = [];

		let boost_point = 0;
		if (this.purchaseActiveSchemebooster != undefined)
			boost_point = this.purchaseActiveSchemebooster.boost_point;
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
			product.points = data.productLoyaltyPointCtrl; //Product original point
			product.Quantity = data.productQuantityCtrl; //product original purchase quantity
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
			product.tot_points =
				data.productLoyaltyPointCtrl * data.productQuantityCtrl; //Total Point:: Product Org.Point * Quantity
			product.tot_points_boost = (product.tot_points * boost_point) / 100; //Total Point boost:: Product Org.boostPoint * Quantity
			_products.push(product);
		});
		return _products;
	}

	/**
	 * Add User
	 *
	 * @param _purchase: User
	 */
	addEditPurchase(_purchase: Purchase) {
		this.loading = true;
		let httpParams = new HttpParams();
		Object.keys(_purchase).forEach(function(key) {
			httpParams = httpParams.append(key, _purchase[key]);
		});

		this.purchaseService
			.createPurchase(httpParams)
			.pipe(
				tap(response => {
					if (response.status == APP_CONSTANTS.response.SUCCESS) {
						const message = `Purchase successfully has been added.`;
						this.layoutUtilsService.showActionNotification(
							message,
							MessageType.Create,
							5000,
							false,
							false
						);
						this.router.navigateByUrl("purchase"); // purchase listing page
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
		let result = "Create Purchase";
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
				isDiscount: false
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
			this.purchaseForm.controls["products"]
		);
		currentProductArray.push(this.purchaseFB.group(res));
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
		componentRef.instance.mainForm = this.purchaseForm;
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
		const control = this.purchaseForm.controls[controlName];
		if (!control) {
			return false;
		}
		if (controlName == "products") {
			const result = control.hasError(validationType);
			return result;
		}else if (controlName == "distributor_id") {
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
