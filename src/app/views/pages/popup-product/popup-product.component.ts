// Angular
import {
	ChangeDetectorRef,
	Component,
	OnInit,
	Inject,
	ChangeDetectionStrategy
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
	FormControl,
	FormBuilder,
	FormGroup,
	Validators,
	FormArray
} from "@angular/forms";
// RxJS
import { Observable, Subject } from "rxjs";
import { finalize, takeUntil, tap, filter, first } from "rxjs/operators";
// Translate
import { TranslateService } from "@ngx-translate/core";
// Store
import { Store, select } from "@ngrx/store";
import { AppState } from "../../../core/reducers";
import { Product } from "../../../core/product/_models/product.model";
import { ProductService } from "../../../core/product/_services";
import { HttpParams } from "@angular/common/http";
import { APP_CONSTANTS } from "../../../../config/default/constants";
import { CommonResponse } from "../../../core/common/common.model";
import { EncrDecrServiceService } from '../../../core/auth/_services/encr-decr-service.service'
import { environment } from '../../../../environments/environment';
import * as fromProduct from "../../../core/product";
import { async } from "@angular/core/testing";
import { LayoutUtilsService, MessageType } from "../../../core/_base/crud";
// import { filter } from 'minimatch';
import { CustomValidator } from "../../../core/_base/layout/validators/custom-validator";

@Component({
	selector: "kt-popup-product",
	templateUrl: "./popup-product.component.html"
	// changeDetection: ChangeDetectionStrategy.Default,
})
export class PopupProductComponent implements OnInit {
	productFormArray: any;
	popupProductForm: FormGroup;
	// viewLoading: boolean = false;
	categoryLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	userData: any;
	errors: any = [];
	isProductloaded$: Observable<boolean>;
	viewLoading$: Observable<boolean>;
	categories$: Observable<Product[]>;
	subCategoryArray;
	productArray;

	private unsubscribe: Subject<any>;
	/**
	 * Component constructor
	 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
	 * @param data: any
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param EncrDecr: EncrDecrServiceService
	 */
	constructor(
		public dialogRef: MatDialogRef<PopupProductComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private ProductSer: ProductService,
		private layoutUtilsService: LayoutUtilsService,
		private EncrDecr: EncrDecrServiceService,
	) {
		this.unsubscribe = new Subject();
		let sessionStorage = this.EncrDecr.getLocalStorage(environment.localStorageKey);
      	this.userData = JSON.parse(sessionStorage)
	}

	ngOnInit(): void {
		this.initPopupProductForm();
		this.store
			.select(fromProduct.selectProductLoaded)
			.pipe()
			.subscribe(data => {
				if (data) {
					this.categories$ = this.store.pipe(
						select(fromProduct.selectAllProducts)
					);
				} else {
					this.store.dispatch(new fromProduct.LoadProducts());
					// this.categories$ = this.store.pipe(select(fromProduct.selectAllProducts));
				}
				if (data) {
					this.categories$
						.pipe(first())
						.subscribe(categoryDataArray => {
							this.resetProduct(categoryDataArray);
						});
				}
			});
		this.viewLoading$ = this.store.pipe(
			select(fromProduct.selectProductLoading)
		);
	}
	/**
	 * Form initalization
	 * Default params, validators
	 */
	initPopupProductForm() {
		const numberPatern = "^[0-9.,]+$";
		this.popupProductForm = this.fb.group({
			productCategoryCtrl: ["", Validators.required],
			productSubCategoryCtrl: ["", Validators.required],
			// productsSerialNoCtrl: this.fb.array([], Validators.required),
			productsSerialNoCtrl: this.fb.array([]),
			productCtrl: ["", Validators.required],
			productNameCtrl: [""],
			productPriceCtrl: [""],
			productTaxSGSTCtrl: [""],
			productTaxSGSTSurchargesCtrl: [""],
			productTaxCGSTCtrl: [""],
			productTaxCGSTSurchargesCtrl: [""],
			productTaxIGSTCtrl: [""],
			productTaxIGSTSurchargesCtrl: [""],
			productQuantityCtrl: [
				"",
				[
					Validators.required,
					Validators.pattern(numberPatern),
					Validators.minLength(1),
					Validators.maxLength(5),
					Validators.min(1),
					CustomValidator
				]
			],
			productDiscountCtrl: [""],
			productDistributorMaxDiscountCtrl: [""],
			productLoyaltyPointCtrl: [""],
			productBarCodeCtrl: [""],
			productProductCodeCtrl: [""],
			VATPercentageCtrl: [""],
			InclusiveExclusiveCtrl: [""],
			VATFromCtrl: [""],
			VATCodeCtrl: [""]
		});
	}

	getProductSrNo(){
		const numberPatern = "^[0-9.,]+$";
		if(this.userData.companySettings.ProductSelectionTypeInSTrade == 1){
			let quantity = this.popupProductForm.controls["productQuantityCtrl"].value
			let currentProductSerialNoArray = <FormArray>this.popupProductForm.controls['productsSerialNoCtrl'];
			currentProductSerialNoArray.clear();
			var i:number; 
			for(i = quantity;i>=1;i--) {
				currentProductSerialNoArray.push(
					// this.fb.group({serialNumber:['', Validators.required]})
					this.fb.group({serialNumber:['', Validators.compose([
						Validators.required,
						Validators.pattern(numberPatern),
						Validators.minLength(this.userData.companySettings.TotalCharsInSrNo),
						Validators.maxLength(this.userData.companySettings.TotalCharsInSrNo),
					])]})
				  )
			 }
			}
	}
	/**
	 * Form Submit
	 */
	onSubmit() {
		const controls = this.popupProductForm.controls;
		/** check form */
		if (this.popupProductForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		const numberPatern = "^[0-9.,]+$";
		this.productFormArray = {
			productCategoryCtrl: [
				this.popupProductForm.controls["productCategoryCtrl"].value
			],
			productSubCategoryCtrl: [
				this.popupProductForm.controls["productSubCategoryCtrl"].value
			],
			// productsSerialNoCtrl: this.fb.array(this.popupProductForm.controls["productsSerialNoCtrl"].value),
			productsSerialNoCtrl: <FormArray>this.popupProductForm.controls['productsSerialNoCtrl'],
			// productsSerialNoCtrl: this.fb.array([]),

			productCtrl: [this.popupProductForm.controls["productCtrl"].value],
			productNameCtrl: [
				this.popupProductForm.controls["productNameCtrl"].value
			],
			productPriceCtrl: [
				this.popupProductForm.controls["productPriceCtrl"].value
			],
			productTaxSGSTCtrl: [
				this.popupProductForm.controls["productTaxSGSTCtrl"].value
			],
			productTaxSGSTSurchargesCtrl: [
				this.popupProductForm.controls["productTaxSGSTSurchargesCtrl"]
					.value
			],
			productTaxCGSTCtrl: [
				this.popupProductForm.controls["productTaxCGSTCtrl"].value
			],
			productTaxCGSTSurchargesCtrl: [
				this.popupProductForm.controls["productTaxCGSTSurchargesCtrl"]
					.value
			],
			productTaxIGSTCtrl: [
				this.popupProductForm.controls["productTaxIGSTCtrl"].value
			],
			productTaxIGSTSurchargesCtrl: [
				this.popupProductForm.controls["productTaxIGSTSurchargesCtrl"]
					.value
			],
			productOriginalQuantityCtrl: [
				this.popupProductForm.controls["productQuantityCtrl"].value
			],
			productReturnedQuantityCtrl: [0],
			productQuantityCtrl: [
				this.popupProductForm.controls["productQuantityCtrl"].value,
				Validators.compose([
					Validators.required,
					Validators.pattern(numberPatern),
					Validators.minLength(1),
					Validators.maxLength(5),
					Validators.min(1),
					CustomValidator
				])
			],
			productDiscountCtrl: [
				this.popupProductForm.controls["productDiscountCtrl"].value
			],
			productDistributorMaxDiscountCtrl: [
				this.popupProductForm.controls["productDistributorMaxDiscountCtrl"].value
			],
			productLoyaltyPointCtrl: [
				this.popupProductForm.controls["productLoyaltyPointCtrl"].value
			],
			productBarCodeCtrl: [
				this.popupProductForm.controls["productBarCodeCtrl"].value
			],
			productProductCodeCtrl: [
				this.popupProductForm.controls["productProductCodeCtrl"].value
			],
			VATPercentageCtrl: [
				this.popupProductForm.controls["VATPercentageCtrl"].value
			],
			InclusiveExclusiveCtrl: [
				this.popupProductForm.controls["InclusiveExclusiveCtrl"].value
			],
			VATFromCtrl: [this.popupProductForm.controls["VATFromCtrl"].value],
			VATCodeCtrl: [this.popupProductForm.controls["VATCodeCtrl"].value]
		};

		this.dialogRef.close(this.productFormArray);
	}

	close() {
		this.dialogRef.close();
	}

	changeCategory(category) {
		this.subCategoryArray = [];
		this.productArray = [];
		let allCategory;
		this.categories$.subscribe(changes => {
			allCategory = changes;
		});

		allCategory.filter((data: any) => {
			if (data.ID == category) {
				this.subCategoryArray = data.subcategories;
			}
		});
	}

	changeSubCategory(subCategory) {
		this.productArray = [];
		let allSubCategory = this.subCategoryArray;
		allSubCategory.filter((data: any) => {
			if (data.ID == subCategory) {
				this.productArray = data.products;
				this.popupProductForm.controls["productTaxSGSTCtrl"].setValue(
					data.SGSTTax
				);
				this.popupProductForm.controls[
					"productTaxSGSTSurchargesCtrl"
				].setValue(data.SGSTSurcharges);
				this.popupProductForm.controls["productTaxCGSTCtrl"].setValue(
					data.CGSTTax
				);
				this.popupProductForm.controls[
					"productTaxCGSTSurchargesCtrl"
				].setValue(data.CGSTSurcharges);
				this.popupProductForm.controls["productTaxIGSTCtrl"].setValue(
					data.IGSTTax
				);
				this.popupProductForm.controls[
					"productTaxIGSTSurchargesCtrl"
				].setValue(data.IGSTSurcharges);
				this.popupProductForm.controls["VATCodeCtrl"].setValue(
					data.VAT_Code
				);
			}
		});
	}

	changeProduct(productID) {
		if (this.data.addedProductsIds.indexOf(productID) > -1) {
			this.popupProductForm.controls["productCtrl"].setValue("");
			const message = `Already product added`;
			this.layoutUtilsService.showActionNotification(
				message,
				MessageType.Read,
				5000,
				false,
				false
			);
			return;
		}
		let allProducts = this.productArray;
		allProducts.filter((data: any) => {
			if (data.ID == productID) {
				let eligibleDiscount = 0;
				/** 
				 * Discount calculation
				 */
					
				 console.log(data);
				 console.log('this.data.pageAction: =>'+this.data.pageAction);
				 console.log(this.data.OptionalSetting);
				 console.log('data.DistributorMaxDiscount: =>'+data.DistributorMaxDiscount);
				 console.log('data.MaxDiscount: =>'+data.MaxDiscount);
				 console.log('data.Sales_Discount: =>'+data.Sales_Discount);
				 console.log('data.Purchase_Discount: =>'+data.Purchase_Discount);
				 
				 if(
					 this.data.pageAction == 'addOrder'
					 || this.data.pageAction == 'addPurchase'
					 || this.data.pageAction == 'addDistributorSale'
					 ){
						eligibleDiscount = data.Sales_Discount;
					// if(this.userData.Company_Type_ID == APP_CONSTANTS.USER_ROLE.RETAILER_TYPE){
					// 	eligibleDiscount = data.Sales_Discount;
					// }
					// else if(this.userData.Company_Type_ID == APP_CONSTANTS.USER_ROLE.DISTRIBUTOR_TYPE){
					// 	eligibleDiscount = data.Purchase_Discount;
					// }
					
				 }else if(this.data.pageAction == 'addDistributorPurchaseOrder' || this.data.pageAction == 'addDistributorPurchase'
				 
				 ){
					eligibleDiscount = data.Purchase_Discount;
				 }

				this.popupProductForm.controls["productCategoryCtrl"].setValue(
					data.Product_Cat_ID
				);
				this.changeCategory(data.Product_Cat_ID);

				this.popupProductForm.controls[
					"productSubCategoryCtrl"
				].setValue(data.Product_Sub_Cat_ID);

				this.changeSubCategory(data.Product_Sub_Cat_ID);

				// if (this.data.isDiscount){
					this.popupProductForm.controls[
						"productDiscountCtrl"
					].setValue(eligibleDiscount);
					
					this.popupProductForm.controls[
						"productDistributorMaxDiscountCtrl"
					].setValue(data.DistributorMaxDiscount);
					
				// }
					
				// else
				// 	this.popupProductForm.controls[
				// 		"productDiscountCtrl"
				// 	].setValue(0);

				this.popupProductForm.controls[
					"productLoyaltyPointCtrl"
				].setValue(data.loyalty_point);
				this.popupProductForm.controls["productPriceCtrl"].setValue(
					data.Price
				);
				this.popupProductForm.controls["productBarCodeCtrl"].setValue(
					data.BarCode
				);
				this.popupProductForm.controls["productNameCtrl"].setValue(
					data.Name
				);
				this.popupProductForm.controls[
					"productProductCodeCtrl"
				].setValue(data.ProductCode);
			}
		});
	}

	resetProduct(categoryDataArray) {
		this.popupProductForm.controls["productCategoryCtrl"].setValue(0);

		this.popupProductForm.controls["productSubCategoryCtrl"].setValue(0);

		this.popupProductForm.controls["productCtrl"].setValue(0);

		this.subCategoryArray = [];
		this.productArray = [];
		categoryDataArray.forEach(categoryDataRow => {
			categoryDataRow.subcategories.forEach(subcategoriesArray => {
				subcategoriesArray.products.forEach(productsArray => {
					this.productArray.push(productsArray);
				});
			});
		});
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.popupProductForm.controls[controlName];

		if (!control) {
			return false;
		}
		const result =
			control.hasError(validationType) &&
			(control.dirty || control.touched);
		return result;
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isSrNoHasError(validationType: string): boolean {
		
		// const control = this.popupProductForm.controls['productsSerialNoCtrl'].controls[0][controlName];
		const control = this.popupProductForm.controls['productsSerialNoCtrl']['controls'][0]['controls']['serialNumber']

		if (!control) {
			return false;
		}
		const result =
			control.hasError(validationType) &&
			(control.dirty || control.touched);
		return result;
	}
}
