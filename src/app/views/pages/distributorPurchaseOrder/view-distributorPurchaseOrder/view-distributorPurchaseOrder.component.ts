// Angular
import {
	ViewContainerRef,
	Inject,
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
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
// RxJS
import { Observable, of, Subscription, Subject } from "rxjs";
import { finalize, takeUntil, tap } from "rxjs/operators";
// Lodash
import { each, find, some } from "lodash";
// NGRX
import { Update } from "@ngrx/entity";
import { Store, select } from "@ngrx/store";
// State
import { AppState } from "../../../../core/reducers";
// Services and Models
import {
	DistributorPurchaseOrder,
	selectDistributorPurchaseOrderById,
	selectDistributorPurchaseOrderError,
	selectDistributorPurchaseOrder,
	selectLoading
} from "../../../../core/distributorPurchaseOrder";
import {
	LOAD_DISTRIBUTOR_SALE_RETURN,
	selectDistributorSale,
	selectLoading as distributorSelectLoading
} from "../../../../core/distributorSale";
import { delay } from "rxjs/operators";
import { PopupProductComponent } from "../../popup-product/popup-product.component";

import { PopupProductTotalCalculationComponent } from "../../popup-product/popup-add-product/popup-product-total-calculation/popup-product-total-calculation.component";
import { dynamicProductTemplateSetting } from "../../../../core/common/common.model";
import { Product } from "../../../../core/product/_models/product.model";
import { HttpParams } from "@angular/common/http";
import { DistributorPurchaseOrderService } from "../../../../core/distributorPurchaseOrder/_services/index";
import { APP_CONSTANTS } from "../../../../../config/default/constants";
import { Logout } from "../../../../core/auth";
// Layout
import {
	SubheaderService,
	LayoutConfigService
} from "../../../../core/_base/layout";
import { LayoutUtilsService, MessageType } from "../../../../core/_base/crud";
import { CustomValidator } from '../../../../core/_base/layout/validators/custom-validator'
import { EncrDecrServiceService } from "../../../../core/auth/_services/encr-decr-service.service";
import { environment } from "../../../../../environments/environment";

@Component({
	selector: "kt-view-distributorPurchaseOrder",
	templateUrl: "./view-distributorPurchaseOrder.component.html"
})
export class ViewDistributorPurchaseOrderComponent implements OnInit, OnDestroy {
	distributorPurchaseOrder$: Observable<DistributorPurchaseOrder>;
	viewLoading$: Observable<boolean>;
	// Private properties
	private componentSubscriptions: Subscription;
	distributorPurchaseOrder: DistributorPurchaseOrder;
	distributorPurchaseOrderForm: FormGroup;
	hasFormErrors: boolean = false;
	userData: any;
	componentRef: any;
	OptionalSetting: dynamicProductTemplateSetting;
	loading = false;
	sl_distributor_sales_id: number = 0;
	@ViewChild("popupProductCalculation", {
		read: ViewContainerRef,
		static: true
	})
	entry: ViewContainerRef;

	//Product properry
	totalAmount: number;
	totalDiscount: number;
	totalGrossAmount: number;
	totalSGSTTaxAmount: number;
	totalCGSTTaxAmount: number;
	totalTaxAmount: number;
	totalNetAmount: number;
	pageAction: string;
	private unsubscribe: Subject<any>;
	isSGSTTax: boolean = false;
	isIGSTTax: boolean = false;
	step: number;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param data: any
	 * @param store: Store<AppState>
	 * @param EncrDecr: EncrDecrServiceService
	 * @param distributorPurchaseOrderFB: FormBuilder,
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param cdr
	 *
	 */
	constructor(
		public dialogRef: MatDialogRef<ViewDistributorPurchaseOrderComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private store: Store<AppState>,
		private distributorPurchaseOrderFB: FormBuilder,
		private resolver: ComponentFactoryResolver,
		private distributorPurchaseOrderService: DistributorPurchaseOrderService,
		private subheaderService: SubheaderService,
		private EncrDecr: EncrDecrServiceService,
		private layoutUtilsService: LayoutUtilsService,
		private cdr: ChangeDetectorRef
	) {
		const OptionalSetting = new dynamicProductTemplateSetting();
		OptionalSetting.clear();
		OptionalSetting.displayDeleteButton = false;
		OptionalSetting.displayPointCalculation = false;
		if (this.data.action == "distributorPurchaseOrderEdit") {
			OptionalSetting.displayDeleteButton = true;
		}
		this.OptionalSetting = OptionalSetting;
		this.pageAction = this.data.action;
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		let sessionStorage = this.EncrDecr.getLocalStorage(
			environment.localStorageKey
		);
		this.userData = JSON.parse(sessionStorage);

		this.distributorPurchaseOrderForm = this.distributorPurchaseOrderFB.group({
			invoice_id: [""],
			vendor_id: [""],
			Description: [''],
			vendor_name: [""],
			products: this.distributorPurchaseOrderFB.array([])
		});

		if (this.data.distributorPurchaseOrderId) {
			this.distributorPurchaseOrder$ = this.store.pipe(
				select(selectDistributorPurchaseOrderById(this.data.distributorPurchaseOrderId))
			);
			this.distributorPurchaseOrder$.subscribe(res => {
				this.createForm(res);
			});
		} 
	}

	/**
	 * Create form
	 */
	createForm(res) {
		if (res.Tax_Type == "SGST") this.isSGSTTax = true;
		else if (res.Tax_Type == "IGST") this.isIGSTTax = true;

		this.distributorPurchaseOrderForm = this.distributorPurchaseOrderFB.group({
			invoice_id: [res.invoice_id],
			vendor_name: [res.Vendor_Name],
			Description: [''],
			vendor_id: [res.ss_vendor_id],
			products: this.distributorPurchaseOrderFB.array([], Validators.required)
		});
		this.prepareProductView(res.product);
	}

	prepareProductView(products): any[] {
		const currentProductArray = <FormArray>(
			this.distributorPurchaseOrderForm.controls["products"]
		);
		const numberPatern = "^[0-9.,]+$";
		products.forEach(element => {
			let quantity = element.Quantity;

			if (
				this.pageAction == "distributorPurchaseOrderReturn" ||
				this.pageAction == "retailerDistributorPurchaseOrderReturnApproval"
			)
				quantity = 0;

			if (
				this.pageAction ==
				"distributorPartialAcceptDistributorPurchaseOrderReturnApproval"
			)
				quantity = element.acceptQty;

			let maxApproveQuantity = element.Quantity - element.ReturnQuantity;
			if (this.pageAction == "retailerDistributorPurchaseOrderReturnApproval")
				maxApproveQuantity = element.Quantity;

			let res = {
				productCategoryCtrl: [""],
				productSubCategoryCtrl: [""],
				productCtrl: [element.ProductID],
				productNameCtrl: [element.Name],
				productPriceCtrl: [element.Price],
				productTaxSGSTCtrl: [element.SGSTTax],
				productTaxSGSTSurchargesCtrl: [element.SGSTSurcharges],
				productTaxCGSTCtrl: [element.CGSTTax],
				productTaxCGSTSurchargesCtrl: [element.CGSTSurcharges],
				productTaxIGSTCtrl: [element.IGSTTax],
				productTaxIGSTSurchargesCtrl: [element.IGSTSurcharges],
				productQuantityCtrl: [
					quantity,
					Validators.compose([
						Validators.required,
						Validators.min(0),
						Validators.max(maxApproveQuantity),
						Validators.pattern(numberPatern),
						Validators.maxLength(5),
						// Validators.min(1),
						CustomValidator
					])
				],
				productOriginalQuantityCtrl: [element.Quantity],
				productReturnedQuantityCtrl: [element.ReturnQuantity],
				productAcceptedQuantityCtrl: [element.acceptQty],
				productDiscountCtrl: [element.Discount],
				productBarCodeCtrl: [""],
				productProductCodeCtrl: [""],
				VATPercentageCtrl: [""],
				InclusiveExclusiveCtrl: [""],
				VATFromCtrl: [""],
				VATCodeCtrl: [""],
				productsSerialNoCtrl: this.distributorPurchaseOrderFB.array([])
			};

			currentProductArray.push(this.distributorPurchaseOrderFB.group(res));
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
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		console.log("distributorPurchaseOrder view close");
	}

	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		// tslint:disable-next-line:no-string-throw
		if (this.pageAction == "distributorPurchaseOrderEdit") {
			return "Update Distributor Purchase Order";
		}else return "View Distributor Purchase Order";
	}

	close() {
		this.dialogRef.close();
	}
	commonCalculation() {
		//Total Calculate
		const componentFactory = this.resolver.resolveComponentFactory(
			PopupProductTotalCalculationComponent
		);
		const viewContainerRef = this.entry;
		viewContainerRef.clear();
		const componentRef = viewContainerRef.createComponent(componentFactory);
		componentRef.instance.mainForm = this.distributorPurchaseOrderForm;
		componentRef.instance.isSGSTTax = this.isSGSTTax;
		componentRef.instance.isIGSTTax = this.isIGSTTax;
	}

	/**
	 * ReuturnPurchase
	 */
	updateDistributorPurchaseOrder() {
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

		const editDistributorPurchaseOrder = this.prepareDistributorPurchaseOrder();
		this.editDistributorPurchaseOrder(editDistributorPurchaseOrder);
	}

		/**
	 * Returns prepared data for save
	 */
	prepareDistributorPurchaseOrder(): DistributorPurchaseOrder {
		const controls = this.distributorPurchaseOrderForm.controls;
		const _distributorPurchaseOrder = new DistributorPurchaseOrder();
		_distributorPurchaseOrder.clear();
		_distributorPurchaseOrder.id = this.data.distributorPurchaseOrderId;
		_distributorPurchaseOrder.vendor_Name = controls["vendor_name"].value;
		_distributorPurchaseOrder.ss_vendor_id = controls["vendor_id"].value;
		_distributorPurchaseOrder.ss_distributor_id = this.userData.ID;
		_distributorPurchaseOrder.remarks = controls["Description"].value;
		_distributorPurchaseOrder.Tax_Type = this.isSGSTTax
			? "SGST"
			: this.isIGSTTax
			? "IGST"
			: "";
		_distributorPurchaseOrder.products_json = JSON.stringify(this.prepareProduct());
		return _distributorPurchaseOrder;
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
	editDistributorPurchaseOrder(_distributorPurchaseOrder: DistributorPurchaseOrder) {
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
						const message = `Distributor PurchaseOrder successfully has been updated.`;
						this.layoutUtilsService.showActionNotification(
							message,
							MessageType.Create,
							5000,
							false,
							false
						);
						this.dialogRef.close('reload');
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
