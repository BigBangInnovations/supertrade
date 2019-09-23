import {
	Component,
	Input,
	Output,
	EventEmitter,
	Optional
} from "@angular/core";
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { EncrDecrServiceService } from "../../../../core/auth/_services/encr-decr-service.service";
import { environment } from "../../../../../environments/environment";
import { APP_CONSTANTS } from "../../../../../config/default/constants";

@Component({
	selector: "kt-popup-add-product",
	templateUrl: "./popup-add-product.component.html",
	styleUrls: ["popup-add-product.component.scss"],
	moduleId: module.id
})
export class PopupAddProductComponent {
	@Input("group")
	public productForm: FormGroup;

	@Input("parantGroup")
	// public saleForm: FormGroup;
	public mainForm: FormGroup;

	@Input() isSGSTTax;

	@Input() isIGSTTax;

	@Input() OptionalSetting: any;

	@Input() pageAction: string;

	@Input() index: number;

	@Input() step: number;

	@Output() quantityChange = new EventEmitter();

	//Variable
	productAmount: number;
	productGrossAmount: number;
	productDiscount: number;
	productCGST: number;
	productSGST: number;
	productIGST: number;
	productNetAmount: number;
	productLoyaltyPoint: number;
	productLoyaltyBoostPoint: number;
	salesActiveSchemebooster: any;
	purchaseActiveSchemebooster: any;
	userData: any;
	boost_point: number;
	coreProductLoyaltyPoint: number;
	productQuantity: number;
	productOrgPrice: number;
	productOrgDiscount: number;

	/**
	 * @param EncrDecr: EncrDecrServiceService
	 * @param fb: FormBuilder
	 */
	constructor(
		private EncrDecr: EncrDecrServiceService,
		private fb: FormBuilder,
		) {
		let sessionStorage = this.EncrDecr.getLocalStorage(
			environment.localStorageKey
		);
		this.userData = JSON.parse(sessionStorage);

		// if (this.userData.companySettings.ManageSGST == '1') {
		//   if (this.userData.Tax_Type == 'VAT') this.isSGSTTax = true;
		// } else if (this.userData.companySettings.ManageIGST == '1') {
		//   if (this.userData.Tax_Type == 'CST') this.isIGSTTax = true;
		// }

		this.salesActiveSchemebooster = this.userData.salesActiveSchemeBooster[0];
		this.purchaseActiveSchemebooster = this.userData.purchaseActiveSchemeBooster[0];
	}

	ngAfterContentInit(): void {
		console.log('this.pageAction:=> '+this.pageAction);
		
		this.boost_point = 0;
		if (
			this.pageAction == "retailerPurchaseApproval" ||
			this.pageAction == "addPurchase" ||
			this.pageAction == "viewPurchase" ||
			this.pageAction == "purchaseReturn" ||
			this.pageAction == "viewDistributorPurchase" ||
			this.pageAction == "distributorPurchaseReturn" ||
			this.pageAction == "distributorPartialAcceptPurchaseReturnApproval" || 
			this.pageAction == "addDistributorPurchase" ||
			this.pageAction == "distributorPurchaseEdit"
		) {
			console.log('purchaseActiveSchemebooster');
			
			if (this.purchaseActiveSchemebooster != undefined)
				this.boost_point = this.purchaseActiveSchemebooster.boost_point;
		} else {
			console.log('salesActiveSchemebooster');
			
			if (this.salesActiveSchemebooster != undefined)
				this.boost_point = this.salesActiveSchemebooster.boost_point;
		}
		
		// if (this.pageAction == "saleReturn") {
		// 		const arrayControl = <FormArray>this.productForm.controls['productsSerialNoCtrl']
		// 		this.productQuantity = arrayControl.length;
		// 	} else{
			this.productQuantity = this.productForm.controls[
				"productQuantityCtrl"
			].value;
		// }
		
		this.productOrgPrice = this.productForm.controls[
			"productPriceCtrl"
		].value;
		this.productOrgDiscount = this.productForm.controls[
			"productDiscountCtrl"
		].value;
		this.productAmount =
			this.productForm.controls["productPriceCtrl"].value *
			this.productQuantity;
		this.productDiscount =
			(this.productAmount *
				this.productForm.controls["productDiscountCtrl"].value) /
			100;
		this.productGrossAmount = this.productAmount - this.productDiscount;
		if (this.isSGSTTax) {
			this.productCGST =
				(this.productGrossAmount *
					this.productForm.controls["productTaxCGSTCtrl"].value) /
				100;
			this.productSGST =
				(this.productGrossAmount *
					this.productForm.controls["productTaxSGSTCtrl"].value) /
				100;
			this.productNetAmount =
				this.productGrossAmount + this.productCGST + this.productSGST;
		} else if (this.isIGSTTax) {
			this.productIGST =
				(this.productGrossAmount *
					this.productForm.controls["productTaxIGSTCtrl"].value) /
				100;
			this.productNetAmount = this.productGrossAmount + this.productIGST;
		}
		if (
			this.pageAction != "viewDistributorPurchaseOrder"  
			&& this.pageAction != "distributorPurchaseOrderEdit"
			) {
			this.coreProductLoyaltyPoint = this.productForm.controls[
				"productLoyaltyPointCtrl"
			].value;
		}
		this.productLoyaltyPoint =
			this.coreProductLoyaltyPoint * this.productQuantity;
		this.productLoyaltyBoostPoint =
			(this.productLoyaltyPoint * this.boost_point) / 100;
	}
	getControlLabel(type: string) {
		return this.productForm.controls[type].value;
	}

	serialNoAddQuantityWise(quantity:number){
		const numberPatern = "^[0-9.,]+$";
		if(this.userData.companySettings.ProductSelectionTypeInSTrade == 1){
		let currentProductSerialNoArray = <FormArray>this.productForm.controls['productsSerialNoCtrl'];
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

	getProductAmount() {
		let quantity = this.productForm.controls["productQuantityCtrl"].value;

		/** 
		 * Serial no inputbox added as per quantity
		 */
		if(
			this.pageAction != "saleReturn"
			&& this.pageAction != "viewSale"
			&& this.pageAction != "viewPurchase"
			&& this.pageAction != "purchaseReturn"
			&& this.pageAction != "viewDistributorSale"
			&& this.pageAction != "distributorSaleReturn"
			&& this.pageAction != "retailerPurchaseApproval"
			&& this.pageAction != "viewDistributorPurchase"
			&& this.pageAction != "distributorPurchaseReturn"
			){
				this.serialNoAddQuantityWise(quantity)
			}
		
		let price = this.productForm.controls["productPriceCtrl"].value;
		let discount = this.productForm.controls["productDiscountCtrl"].value;
		let distributorMaxDiscount = this.productForm.controls["productDistributorMaxDiscountCtrl"].value;

		// if( (
		// 	(this.pageAction == 'addOrder' && APP_CONSTANTS.USER_ROLE.RETAILER_TYPE)
		// 	|| this.pageAction == 'addPurchase'
		// 	|| this.pageAction == 'addDistributorPurchase'
		// 	)
		// 	&& this.OptionalSetting.isPriceEditable){
		// 	let discount = (price*this.productOrgDiscount)/this.productOrgPrice
		// 	this.productForm.controls["productDiscountCtrl"].setValue(
		// 		discount
		// 	);
		// }

		if((
			(this.pageAction == 'addOrder' || this.pageAction == 'addDistributorSale')
			 && APP_CONSTANTS.USER_ROLE.DISTRIBUTOR_TYPE)){
			if(discount > distributorMaxDiscount){
				this.productForm.controls["productDiscountCtrl"].setValue(
					distributorMaxDiscount
				);
			}
		}

		if (quantity != "") {
			this.productQuantity = quantity;
			if (
				this.pageAction != "viewDistributorPurchaseOrder"  
				&& this.pageAction != "distributorPurchaseOrderEdit"
				){
			this.coreProductLoyaltyPoint = this.productForm.controls[
				"productLoyaltyPointCtrl"
			].value;
		}
			this.productAmount = price * quantity;
			this.productDiscount = (this.productAmount * discount) / 100;
			this.productGrossAmount = this.productAmount - this.productDiscount;
			if (this.isSGSTTax) {
				this.productCGST =
					(this.productGrossAmount *
						this.productForm.controls["productTaxCGSTCtrl"].value) /
					100;
				this.productSGST =
					(this.productGrossAmount *
						this.productForm.controls["productTaxSGSTCtrl"].value) /
					100;
				this.productNetAmount =
					this.productGrossAmount +
					this.productCGST +
					this.productSGST;
			} else if (this.isIGSTTax) {
				this.productIGST =
					(this.productGrossAmount *
						this.productForm.controls["productTaxIGSTCtrl"].value) /
					100;
				this.productNetAmount =
					this.productGrossAmount + this.productIGST;
			}

			this.productLoyaltyPoint =
				this.coreProductLoyaltyPoint *
				this.productForm.controls["productQuantityCtrl"].value;
			this.productLoyaltyBoostPoint =
				(this.productLoyaltyPoint * this.boost_point) / 100;
		} else {
			this.productQuantity = 0;
			if (
				this.pageAction != "viewDistributorPurchaseOrder"  
				&& this.pageAction != "distributorPurchaseOrderEdit"
				){
			this.coreProductLoyaltyPoint = this.productForm.controls[
				"productLoyaltyPointCtrl"
			].value;
		}
			this.productAmount = 0;
			this.productDiscount = 0;
			this.productGrossAmount = 0;
			this.productCGST = 0;
			this.productSGST = 0;
			this.productIGST = 0;
			this.productNetAmount = 0;
			this.productLoyaltyPoint = 0;
			this.productLoyaltyBoostPoint = 0;
		}

		this.quantityChange.emit();
	}

	deleteProduct(index: number): void {
		// this.productForm.removeAt(index);
		// const arrayControl = <FormArray>this.saleForm.controls['products'];
		const arrayControl = <FormArray>this.mainForm.controls["products"];
		arrayControl.removeAt(index);
		this.quantityChange.emit();
	}

	deleteProductSrNo(index: number): void {
		const arrayControl = <FormArray>this.productForm.controls['productsSerialNoCtrl']
		arrayControl.removeAt(index);
		console.log('arrayControl.length');		
		console.log(arrayControl.length);		
		this.productForm.controls["productQuantityCtrl"].setValue(arrayControl.length);
		this.getProductAmount();
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.productForm.controls[controlName];
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
	isSrNoHasError(validationType: string, index:number = 0): boolean {
		// const control = this.popupProductForm.controls['productsSerialNoCtrl'].controls[0][controlName];
		const control = this.productForm.controls['productsSerialNoCtrl']['controls'][index]['controls']['serialNumber']

		if (!control) {
			return false;
		}
		const result =
			control.hasError(validationType) &&
			(control.dirty || control.touched);
		return result;
	}
}
