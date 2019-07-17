import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";
@Component({
  selector: 'kt-popup-add-product',
  templateUrl: './popup-add-product.component.html',
  moduleId: module.id,
})
export class PopupAddProductComponent {

  @Input('group')
  public productForm: FormGroup;

  @Input('parantGroup')
  public saleForm: FormGroup;

  panelOpenState: boolean = false;
  @Input() index: number;

  @Output() quantityChange = new EventEmitter();

  //Variable
  productAmount: number;
  productGrossAmount: number;
  productDiscount: number;
  productCGST: number;
  productSGST: number;
  productNetAmount: number;

  constructor() { }

  ngAfterContentInit(): void {
    this.productAmount = this.productForm.controls['productPriceCtrl'].value * this.productForm.controls['productQuantityCtrl'].value;
    this.productDiscount = (this.productAmount * this.productForm.controls['productDiscountCtrl'].value) / 100;
    this.productGrossAmount = this.productAmount - this.productDiscount;
    this.productCGST = (this.productGrossAmount * this.productForm.controls['productTaxCGSTCtrl'].value) / 100;
    this.productSGST = (this.productGrossAmount * this.productForm.controls['productTaxSGSTCtrl'].value) / 100;
    this.productNetAmount = this.productGrossAmount + this.productCGST + this.productSGST;
  }
  getControlLabel(type: string) {
    return this.productForm.controls[type].value;
  }

  getProductAmount(quantity) {
    let price = this.productForm.controls['productPriceCtrl'].value;
    if (quantity != '') {
      this.productAmount = price * quantity;
      this.productDiscount = (this.productAmount * this.productForm.controls['productDiscountCtrl'].value) / 100;
      this.productGrossAmount = this.productAmount - this.productDiscount;
      this.productCGST = (this.productGrossAmount * this.productForm.controls['productTaxCGSTCtrl'].value) / 100;
      this.productSGST = (this.productGrossAmount * this.productForm.controls['productTaxSGSTCtrl'].value) / 100;
      this.productNetAmount = this.productGrossAmount + this.productCGST + this.productSGST;
    } else {
      this.productAmount = 0;
      this.productDiscount = 0;
      this.productGrossAmount = 0;
      this.productCGST = 0;
      this.productSGST = 0;
      this.productNetAmount = 0;
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
