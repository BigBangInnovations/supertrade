import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from "@angular/forms";
import { EncrDecrServiceService } from '../../../../../core/auth/_services/encr-decr-service.service'
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'kt-popup-product-total-calculation',
  templateUrl: './popup-product-total-calculation.component.html',
  styleUrls: ['popup-product-total-calculation.component.scss'],
})
export class PopupProductTotalCalculationComponent implements OnInit {

  @Input('group')
  // public saleForm: FormGroup;
  public mainForm: FormGroup;

  @Input() isSGSTTax;
  @Input() isIGSTTax;

  @Output() newAddedProductsIds = new EventEmitter();

  private addedProductsIds: any[] = [];

  //Product properry
  totalAmount: number;
  totalDiscount: number;
  totalGrossAmount: number;
  totalSGSTTaxAmount: number;
  totalCGSTTaxAmount: number;
  totalIGSTTaxAmount: number;
  totalTaxAmount: number;
  totalNetAmount: number;
  userData: any;


  /**
  * @param EncrDecr: EncrDecrServiceService
  */
  constructor(
    private EncrDecr: EncrDecrServiceService,
  ) {
    let sessionStorage = this.EncrDecr.getLocalStorage(environment.localStorageKey);
    this.userData = JSON.parse(sessionStorage)

    // if (this.userData.companySettings.ManageSGST == '1') {
    //   if (this.userData.Tax_Type == 'VAT') this.isSGSTTax = true;
    // } else if (this.userData.companySettings.ManageIGST == '1') {
    //   if (this.userData.Tax_Type == 'CST') this.isIGSTTax = true;
    // }
  }

  ngOnInit() {
    this.calculateAllProductsTotal();
  }

  calculateAllProductsTotal() {
    this.totalAmount = 0;
    this.totalDiscount = 0;
    this.totalGrossAmount = 0;
    this.totalSGSTTaxAmount = 0;
    this.totalCGSTTaxAmount = 0;
    this.totalIGSTTaxAmount = 0;
    this.totalTaxAmount = 0;
    this.totalNetAmount = 0;

    let totalAmount = 0;
    let totalDiscount = 0;
    let totalGrossAmount = 0;
    let totalSGSTTaxAmount = 0;
    let totalCGSTTaxAmount = 0;
    let totalIGSTTaxAmount = 0;
    let totalTaxAmount = 0;
    let totalNetAmount = 0;

    // const currentProductArray = this.saleForm.get('products').value
    const currentProductArray = this.mainForm.get('products').value
    this.addedProductsIds = [];
    Object.keys(currentProductArray).forEach((index) => {
      this.addedProductsIds.push(currentProductArray[index].productCtrl)

      totalAmount = currentProductArray[index].productQuantityCtrl * currentProductArray[index].productPriceCtrl;
      totalDiscount = (totalAmount * currentProductArray[index].productDiscountCtrl) / 100;
      totalGrossAmount = totalAmount - totalDiscount;
      if (this.isSGSTTax) {
        totalSGSTTaxAmount = (totalGrossAmount * currentProductArray[index].productTaxSGSTCtrl) / 100;
        totalCGSTTaxAmount = (totalGrossAmount * currentProductArray[index].productTaxCGSTCtrl) / 100;
        totalTaxAmount = totalSGSTTaxAmount + totalCGSTTaxAmount;
      } else if (this.isIGSTTax) {
        totalIGSTTaxAmount = (totalGrossAmount * currentProductArray[index].productTaxIGSTCtrl) / 100;
        totalTaxAmount = totalIGSTTaxAmount;
      }


      totalNetAmount = totalGrossAmount + totalTaxAmount;

      this.totalAmount += totalAmount;
      this.totalDiscount += totalDiscount;
      this.totalGrossAmount += totalGrossAmount;
      this.totalTaxAmount += totalTaxAmount;
      this.totalNetAmount += totalNetAmount;
    });
    this.newAddedProductsIds.next({ addedProductsIds: this.addedProductsIds })
    // this.newAddedProductsIds.emit({addedProductsIds:this.addedProductsIds});
  }
}
