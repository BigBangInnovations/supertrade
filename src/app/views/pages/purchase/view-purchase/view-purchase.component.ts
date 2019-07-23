// Angular
import { ViewContainerRef, Inject, ViewChild, ComponentFactoryResolver, ComponentRef, ComponentFactory, Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// RxJS
import { Observable, of, Subscription, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
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
import { Product } from '../../../../core/product/_models/product.model'
import { HttpParams } from "@angular/common/http";
import { PurchaseService } from '../../../../core/purchase/_services/index'
import { APP_CONSTANTS } from '../../../../../config/default/constants'
import { Logout } from '../../../../core/auth';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';

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
  loading = false;
  sl_distributor_sales_id:number = 0;
  @ViewChild('popupProductCalculation', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;

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

  /**
 * Component constructor
 *
 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
 * @param activatedRoute: ActivatedRoute
 * @param router: Router
 * @param data: any
 * @param store: Store<AppState>
 * @param purchaseFB: FormBuilder,
 * @param subheaderService: SubheaderService
 * @param layoutUtilsService: LayoutUtilsService
 * @param cdr  
 * 
 */
  constructor(public dialogRef: MatDialogRef<ViewPurchaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private purchaseFB: FormBuilder,
    private resolver: ComponentFactoryResolver,
    private purchaseService: PurchaseService,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private cdr: ChangeDetectorRef,
  ) {
    const OptionalSetting = new dynamicProductTemplateSetting();
    OptionalSetting.clear();
    OptionalSetting.displayDeleteButton = false;
    if (
      this.data.action == 'saleReturn' ||
      this.data.action == 'PurchaseReturn' ||
      this.data.action == 'addOrder' || 
      this.data.action == 'viewSale' || 
      this.data.action == 'viewPurchase'
    ) {
      OptionalSetting.displayPointCalculation = false;
    }
    this.OptionalSetting = OptionalSetting;
    this.pageAction = this.data.action;
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    if (this.data.purchaseId) {
      this.purchase$ = this.store.pipe(select(selectPurchaseById(this.data.purchaseId)));
      this.purchase$.subscribe(res => {
        this.sl_distributor_sales_id = res.sl_distributor_sales_id;
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
      distributor_id: [res.Name],
      products: this.purchaseFB.array([])
    });
    this.prepareProductView(res.product)
  }

  prepareProductView(products): any[] {
    const currentProductArray = <FormArray>this.purchaseForm.controls['products'];
    const numberPatern = '^[0-9.,]+$';
    products.forEach(element => {
      let quantity = element.Quantity;
      if (this.pageAction == 'purchaseReturn') quantity = 0;
      let res = {
        productCategoryCtrl: [''],
        productSubCategoryCtrl: [''],
        productCtrl: [element.ProductID],
        productNameCtrl: [element.Name],
        productPriceCtrl: [element.Price],
        productTaxSGSTCtrl: [element.SGSTTax],
        productTaxSGSTSurchargesCtrl: [element.SGSTSurcharges],
        productTaxCGSTCtrl: [element.CGSTTax],
        productTaxCGSTSurchargesCtrl: [element.CGSTSurcharges],
        productTaxIGSTCtrl: [element.IGSTTax],
        productTaxIGSTSurchargesCtrl: [element.IGSTSurcharges],
        productQuantityCtrl: [quantity, Validators.compose(
          [
            Validators.required,
            Validators.min(0),
            Validators.max(element.Quantity - element.ReturnQuantity),
            Validators.pattern(numberPatern),
            Validators.maxLength(5)
          ]
        )],
        productOriginalQuantityCtrl: [element.Quantity],
        productReturnedQuantityCtrl: [element.ReturnQuantity],
        productDiscountCtrl: [element.Discount],
        productLoyaltyPointCtrl: [(element.points) / element.Quantity],
        productBarCodeCtrl: [''],
        productProductCodeCtrl: [''],
        VATPercentageCtrl: [''],
        InclusiveExclusiveCtrl: [''],
        VATFromCtrl: [''],
        VATCodeCtrl: [''],
        points: [element.points],
        points_boost: [element.points_boost],
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
    console.log('purchase view close');

  }

  /** UI */
	/**
	 * Returns component title
	 */
  getTitle(): string {
    // tslint:disable-next-line:no-string-throw
    if (this.pageAction == 'purchaseReturn')
      return 'Purchase Return'
    else return 'View Purchase';
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

  /**  
   * ReuturnPurchase
  */
  ReuturnPurchase() {
    const controls = this.purchaseForm.controls;
    
    /** check form */
    if (this.purchaseForm.invalid) {
      Object.keys(controls).forEach(controlName =>{
        controls[controlName].markAsTouched()
      }
        
      );
      return;
    }

    const returnPurchase = this.preparePurchase();
    this.returnPurchase(returnPurchase);

  }

  /**
   * Returns prepared data for save
   */
  preparePurchase(): Purchase {
    const controls = this.purchaseForm.controls;
    const _purchase = new Purchase();
    _purchase.clear();
    _purchase.sl_purchase_id = this.data.purchaseId;
    _purchase.sl_distributor_sales_id = this.sl_distributor_sales_id;
    _purchase.products_json = JSON.stringify(this.prepareProduct())
    return _purchase;
  }

  /**
   * Returns prepared data for product
   */
  prepareProduct(): Product[] {
    const controls = this.purchaseForm.controls['products'].value;;
    const _products = [];
    controls.forEach(data => {
      if (data.productQuantityCtrl > 0) {
        //Clear Product and set default value

        const product = new Product();
        product.clear();
        product.ProductID = data.productCtrl;//Product Original ID
        product.ProductCode = data.productProductCodeCtrl;//Product Original ID
        product.serial_no = '';//Serial number
        product.ProductAmount = data.productPriceCtrl * data.productQuantityCtrl;//Product Amount:: Product prive * Quantity
        product.Price = data.productPriceCtrl;//Product original price :: Return product time It's total get point in order
        product.points = data.points;//Product original point :: Return product time It's total get boost point in order
        product.points_boost = data.points_boost;//Product original point
        product.originalQty = data.productOriginalQuantityCtrl;//product original sale quantity
        product.Quantity = data.productQuantityCtrl;//product original sale quantity :: return time it's a entered quantity by user
        product.Discount = data.productDiscountCtrl;//product original discount(%)
        product.SGSTTax = data.productTaxSGSTCtrl;//Product original SGST Tax(%)
        product.SGSTSurcharges = data.productTaxSGSTSurchargesCtrl;//Product original SGST Surcharges Tax(%)
        product.CGSTTax = data.productTaxCGSTCtrl;//Product original CGST Tax(%)
        product.CGSTSurcharges = data.productTaxCGSTSurchargesCtrl;//Product original CGST Surcharges Tax(%)
        product.IGSTTax = data.productTaxIGSTCtrl;//Product original IGST Tax(%)
        product.IGSTSurcharges = data.productTaxIGSTSurchargesCtrl;//Product original IGST Surcharges Tax(%)
        product.VATPercentage = data.productVATPercentage;//Product original Vat perchantage(%)
        product.InclusiveExclusive = data.InclusiveExclusiveTax;//Product TAX inclusive or exclusive:: no any effect of this field
        product.VATFrom = data.productVATFrom;//Product vat from customer OR Other side
        _products.push(product);
      }
    });
    return _products;
  }

  /**
   * Add User
   *
   * @param _purchase: User
   */
  returnPurchase(_purchase: Purchase) {
    this.loading = true;
    let httpParams = new HttpParams();
    Object.keys(_purchase).forEach(function (key) {
      httpParams = httpParams.append(key, _purchase[key]);
    });

    this.purchaseService
      .returnPurchase(httpParams)
      .pipe(
        tap(response => {
          if (response.status == APP_CONSTANTS.response.SUCCESS) {
            const message = `Purchase return successfully.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
            this.dialogRef.close('reload');
          } else if (response.status == APP_CONSTANTS.response.ERROR) {
            const message = response.message;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
          } else {
            const message = 'Invalid token! Please login again';
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
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
}
