import { Component, Input, Output, EventEmitter, Optional } from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";
import { EncrDecrServiceService } from '../../../../core/auth/_services/encr-decr-service.service'
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'kt-popup-add-product',
  templateUrl: './popup-add-product.component.html',
  styleUrls: ['popup-add-product.component.scss'],
  moduleId: module.id,
})
export class PopupAddProductComponent {

  @Input('group')
  public productForm: FormGroup;

  @Input('parantGroup')
  public saleForm: FormGroup;

  @Input() OptionalSetting: any;

  @Input() index: number;

  @Output() quantityChange = new EventEmitter();

  //Variable
  productAmount: number;
  productGrossAmount: number;
  productDiscount: number;
  productCGST: number;
  productSGST: number;
  productNetAmount: number;
  productLoyaltyPoint: number;
  productLoyaltyBoostPoint: number;
  displayPointCalculation: boolean;
  salesActiveSchemebooster: any;
  userData: any;
  boost_point: number;
  coreProductLoyaltyPoint:number;
  productQuantity:number;

  /**
  * @param EncrDecr: EncrDecrServiceService
  */
  constructor(
    private EncrDecr: EncrDecrServiceService,
  ) {
    this.displayPointCalculation = true;
    let sessionStorage = this.EncrDecr.getLocalStorage(environment.localStorageKey);
    this.userData = JSON.parse(sessionStorage)
    this.salesActiveSchemebooster = this.userData.salesActiveSchemeBooster[0];

    this.boost_point = 0;
    if (this.salesActiveSchemebooster != undefined)
      this.boost_point = this.salesActiveSchemebooster.boost_point;

  }

  ngAfterContentInit(): void {
    this.productQuantity = this.productForm.controls['productQuantityCtrl'].value;
    this.productAmount = this.productForm.controls['productPriceCtrl'].value * this.productQuantity;
    this.productDiscount = (this.productAmount * this.productForm.controls['productDiscountCtrl'].value) / 100;
    this.productGrossAmount = this.productAmount - this.productDiscount;
    this.productCGST = (this.productGrossAmount * this.productForm.controls['productTaxCGSTCtrl'].value) / 100;
    this.productSGST = (this.productGrossAmount * this.productForm.controls['productTaxSGSTCtrl'].value) / 100;
    this.productNetAmount = this.productGrossAmount + this.productCGST + this.productSGST;
    this.coreProductLoyaltyPoint = this.productForm.controls['productLoyaltyPointCtrl'].value;
    this.productLoyaltyPoint =  this.coreProductLoyaltyPoint * this.productQuantity;
    this.productLoyaltyBoostPoint = (this.productLoyaltyPoint * this.boost_point) / 100;
  }
  getControlLabel(type: string) {
    return this.productForm.controls[type].value;
  }

  getProductAmount(quantity) {
    let price = this.productForm.controls['productPriceCtrl'].value;
    if (quantity != '') {
      this.productQuantity = quantity;
      this.coreProductLoyaltyPoint = this.productForm.controls['productLoyaltyPointCtrl'].value;
      this.productAmount = price * quantity;
      this.productDiscount = (this.productAmount * this.productForm.controls['productDiscountCtrl'].value) / 100;
      this.productGrossAmount = this.productAmount - this.productDiscount;
      this.productCGST = (this.productGrossAmount * this.productForm.controls['productTaxCGSTCtrl'].value) / 100;
      this.productSGST = (this.productGrossAmount * this.productForm.controls['productTaxSGSTCtrl'].value) / 100;
      this.productNetAmount = this.productGrossAmount + this.productCGST + this.productSGST;
      this.productLoyaltyPoint = this.coreProductLoyaltyPoint * this.productForm.controls['productQuantityCtrl'].value;
      this.productLoyaltyBoostPoint = (this.productLoyaltyPoint * this.boost_point) / 100;
    } else {
      this.productQuantity = 0;
      this.coreProductLoyaltyPoint = this.productForm.controls['productLoyaltyPointCtrl'].value;
      this.productAmount = 0;
      this.productDiscount = 0;
      this.productGrossAmount = 0;
      this.productCGST = 0;
      this.productSGST = 0;
      this.productNetAmount = 0;
      this.productLoyaltyPoint = 0;
      this.productLoyaltyBoostPoint = 0;
    }

    this.quantityChange.emit();
  }

  deleteProduct(index: number): void {
    // this.productForm.removeAt(index);
    const arrayControl = <FormArray>this.saleForm.controls['products'];
    arrayControl.removeAt(index);
    this.quantityChange.emit();
  }
}
