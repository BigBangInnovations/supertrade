// Angular
import { ViewContainerRef, Inject, ViewChild, ComponentFactoryResolver, ComponentRef, ComponentFactory, Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
// RxJS
import { Observable, of, Subscription } from 'rxjs';
// Lodash
import { each, find, some } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../core/reducers';
// Services and Models
import { Purchase, selectPurchaseById } from '../../../../core/purchase';
import { delay } from 'rxjs/operators';
import { PopupProductComponent } from '../../popup-product/popup-product.component';

import { PopupProductTotalCalculationComponent } from '../../popup-product/popup-add-product/popup-product-total-calculation/popup-product-total-calculation.component'
import { dynamicProductTemplateSetting } from '../../../../core/common/common.model'

@Component({
  selector: 'kt-view-purchase',
  templateUrl: './view-purchase.component.html',
})
export class ViewPurchaseComponent implements OnInit, OnDestroy {


  purchase$: Observable<Purchase>;
  viewLoading$: Observable<boolean>;
  // Private properties
  private componentSubscriptions: Subscription;
  purchase: Purchase;
  purchaseForm: FormGroup;
  hasFormErrors: boolean = false;
  componentRef: any;
  OptionalSetting: dynamicProductTemplateSetting;

  @ViewChild('popupProductCalculation', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;

  //Product properry
  totalAmount: number;
  totalDiscount: number;
  totalGrossAmount: number;
  totalSGSTTaxAmount: number;
  totalCGSTTaxAmount: number;
  totalTaxAmount: number;
  totalNetAmount: number;

  /**
 * Component constructor
 *
 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
 * @param data: any
 * @param store: Store<AppState>
 * @param purchaseFB: FormBuilder
 * 
 */
  constructor(public dialogRef: MatDialogRef<ViewPurchaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    private purchaseFB: FormBuilder,
    private resolver: ComponentFactoryResolver
  ) {
    const OptionalSetting = new dynamicProductTemplateSetting();
    OptionalSetting.clear();
    OptionalSetting.displayDeleteButton = false;
    this.OptionalSetting = OptionalSetting;

  }

  ngOnInit() {
    if (this.data.purchaseId) {
      this.purchase$ = this.store.pipe(select(selectPurchaseById(this.data.purchaseId)));
      this.purchase$.subscribe(res => {
        this.createForm(res);
      });
    }
  }

  /**
	 * Create form
	 */
  createForm(res) {
    this.purchaseForm = this.purchaseFB.group({
      scheme_id: [res.scheme_id],
      name: [res.name],
      mobile_no: [res.mobile_no],
      address_line1: [res.address_line1],
      address_line2: [res.address_line2],
      landline_no: [res.landline_no],
      city: [res.city],
      pincode: [res.pincode],
      state: [res.state],
      products: this.purchaseFB.array([])
    });
    this.prepareProductView(res.product)
  }

  prepareProductView(products): any[] {
    const currentProductArray = <FormArray>this.purchaseForm.controls['products'];
    products.forEach(element => {
      let res = {
        productCategoryCtrl: [''],
        productSubCategoryCtrl: [''],
        productCtrl: [''],
        productNameCtrl: [element.Name],
        productPriceCtrl: [element.Price],
        productTaxSGSTCtrl: [element.SGSTTax],
        productTaxSGSTSurchargesCtrl: [element.SGSTSurcharges],
        productTaxCGSTCtrl: [element.CGSTTax],
        productTaxCGSTSurchargesCtrl: [element.CGSTSurcharges],
        productTaxIGSTCtrl: [element.IGSTTax],
        productTaxIGSTSurchargesCtrl: [element.IGSTSurcharges],
        productQuantityCtrl: [element.Quantity],
        productDiscountCtrl: [element.Discount],
        productLoyaltyPointCtrl: [(element.points) / element.Quantity],
        productBarCodeCtrl: [''],
        productProductCodeCtrl: [''],
        VATPercentageCtrl: [''],
        InclusiveExclusiveCtrl: [''],
        VATFromCtrl: [''],
        VATCodeCtrl: [''],
      }

      currentProductArray.push(
        this.purchaseFB.group(res)
      )

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
  }

  /**
	 * Close alert
	 *
	 * @param $event: Event
	 */
  onAlertClose($event) {
    console.log('purchase view close');

  }

  /** UI */
	/**
	 * Returns component title
	 */
  getTitle(): string {
    // tslint:disable-next-line:no-string-throw
    return 'View Purchase';
  }

  close() {
    this.dialogRef.close();
  }
  commonCalculation() {
    //Total Calculate
    const componentFactory = this.resolver.resolveComponentFactory(PopupProductTotalCalculationComponent);
    const viewContainerRef = this.entry;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    // componentRef.instance.purchaseForm = this.purchaseForm;
    componentRef.instance.mainForm = this.purchaseForm;
  }
}
