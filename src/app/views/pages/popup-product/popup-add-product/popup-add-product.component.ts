import {
	Component,
	Input,
	Output,
	EventEmitter,
	Optional
} from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";
import { EncrDecrServiceService } from "../../../../core/auth/_services/encr-decr-service.service";
import { environment } from "../../../../../environments/environment";

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

	/**
	 * @param EncrDecr: EncrDecrServiceService
	 */
	constructor(private EncrDecr: EncrDecrServiceService) {
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
    this.boost_point = 0;
    console.log("this.pageAction");
    console.log(this.pageAction);
		if (
			this.pageAction == "retailerPurchaseApproval"
			|| this.pageAction == "addPurchase"
			|| this.pageAction == "purchaseReturn"
			|| this.pageAction == "distributorPartialAcceptPurchaseReturnApproval"
		) {
			console.log("get purchaseActiveSchemebooster");

			if (this.purchaseActiveSchemebooster != undefined)
				this.boost_point = this.purchaseActiveSchemebooster.boost_point;
		} else {
			console.log("get salesActiveSchemebooster");
			if (this.salesActiveSchemebooster != undefined)
				this.boost_point = this.salesActiveSchemebooster.boost_point;
		}

		this.productQuantity = this.productForm.controls[
			"productQuantityCtrl"
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

		this.coreProductLoyaltyPoint = this.productForm.controls[
			"productLoyaltyPointCtrl"
		].value;
		this.productLoyaltyPoint =
			this.coreProductLoyaltyPoint * this.productQuantity;
		this.productLoyaltyBoostPoint =
			(this.productLoyaltyPoint * this.boost_point) / 100;
	}
	getControlLabel(type: string) {
		return this.productForm.controls[type].value;
	}

	getProductAmount(quantity) {
		let price = this.productForm.controls["productPriceCtrl"].value;
		if (quantity != "") {
			this.productQuantity = quantity;
			this.coreProductLoyaltyPoint = this.productForm.controls[
				"productLoyaltyPointCtrl"
			].value;
			this.productAmount = price * quantity;
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
			this.coreProductLoyaltyPoint = this.productForm.controls[
				"productLoyaltyPointCtrl"
			].value;
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
}
