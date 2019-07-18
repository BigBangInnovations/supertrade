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
import { Sale, selectSaleById } from '../../../../core/sales';
import { delay } from 'rxjs/operators';
import { PopupProductComponent } from '../../popup-product/popup-product.component';

import { PopupProductTotalCalculationComponent } from '../../popup-product/popup-add-product/popup-product-total-calculation/popup-product-total-calculation.component'
import { dynamicProductTemplateSetting } from '../../../../core/common/common.model'

@Component({
  selector: 'kt-view-sale',
  templateUrl: './view-sale.component.html',
})
export class ViewSaleComponent implements OnInit, OnDestroy {


  sale$: Observable<Sale>;
  viewLoading$: Observable<boolean>;
  // Private properties
  private componentSubscriptions: Subscription;
  sale: Sale;
  saleForm: FormGroup;
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
 * @param saleFB: FormBuilder
 * 
 */
  constructor(public dialogRef: MatDialogRef<ViewSaleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    private saleFB: FormBuilder,
    private resolver: ComponentFactoryResolver
  ) {
    const OptionalSetting = new dynamicProductTemplateSetting();
    OptionalSetting.clear();
    OptionalSetting.displayDeleteButton = false;
    this.OptionalSetting = OptionalSetting;

  }

  ngOnInit() {
    if (this.data.saleId) {
      this.sale$ = this.store.pipe(select(selectSaleById(this.data.saleId)));
      this.sale$.subscribe(res => {
        this.createForm(res);
      });
    }
  }

  /**
	 * Create form
	 */
  createForm(res) {
    this.saleForm = this.saleFB.group({
      scheme_id: [res.scheme_id],
      name: [res.name],
      mobile_no: [res.mobile_no],
      address_line1: [res.address_line1],
      address_line2: [res.address_line2],
      landline_no: [res.landline_no],
      city: [res.city],
      pincode: [res.pincode],
      state: [res.state],
      products: this.saleFB.array([])
    });
    this.prepareProductView(res.product)
  }

  prepareProductView(products): any[] {
    const currentProductArray = <FormArray>this.saleForm.controls['products'];
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
        this.saleFB.group(res)
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
    console.log('sale view close');

  }

  /** UI */
	/**
	 * Returns component title
	 */
  getTitle(): string {
    // tslint:disable-next-line:no-string-throw
    return 'View Sale';
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
    componentRef.instance.saleForm = this.saleForm;
  }
}
