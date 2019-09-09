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
import { Sale, selectSaleById } from '../../../../core/sales';
import { delay } from 'rxjs/operators';
import { PopupProductComponent } from '../../popup-product/popup-product.component';

import { PopupProductTotalCalculationComponent } from '../../popup-product/popup-add-product/popup-product-total-calculation/popup-product-total-calculation.component'
import { dynamicProductTemplateSetting } from '../../../../core/common/common.model'
import { Product } from '../../../../core/product/_models/product.model'
import { HttpParams } from "@angular/common/http";
import { SalesService } from '../../../../core/sales/_services/index'
import { APP_CONSTANTS } from '../../../../../config/default/constants'
import { Logout } from '../../../../core/auth';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';

@Component({
  selector: 'kt-view-sale',
  templateUrl: './view-sale.component.html',
  styleUrls: ['view-sale.component.scss'],
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
  loading = false;
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
 * @param saleFB: FormBuilder
 * @param salesService: SalesService,
 * @param subheaderService: SubheaderService
 * @param layoutUtilsService: LayoutUtilsService
 * @param cdr
 * 
 */
  constructor(public dialogRef: MatDialogRef<ViewSaleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private saleFB: FormBuilder,
    private resolver: ComponentFactoryResolver,
    private salesService: SalesService,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private cdr: ChangeDetectorRef,
  ) {
    const OptionalSetting = new dynamicProductTemplateSetting();
    OptionalSetting.clear();
    OptionalSetting.displayDeleteButton = false;
    if (
      this.data.action == 'saleReturn'
      || this.data.action == 'PurchaseReturn'
      || this.data.action == 'addOrder'
      // || this.data.action == 'viewSale'
      // || this.data.action == 'viewPurchase'
    ) {
      OptionalSetting.displayPointCalculation = false;
    }
    this.OptionalSetting = OptionalSetting;
    this.pageAction = this.data.action;
    this.unsubscribe = new Subject();
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
    if (res.Tax_Type == 'SGST') this.isSGSTTax = true;
    else if (res.Tax_Type == 'IGST') this.isIGSTTax = true;

    this.saleForm = this.saleFB.group({
      invoice_id: [res.invoice_id],
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
    const numberPatern = '^[0-9.,]+$';
    products.forEach(element => {
      let quantity = element.Quantity;
      if (this.pageAction == 'saleReturn') quantity = 0;
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
        productAcceptedQuantityCtrl: [element.acceptQty],
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
    console.log('sale view close');

  }

  /** UI */
	/**
	 * Returns component title
	 */
  getTitle(): string {
    // tslint:disable-next-line:no-string-throw
    if (this.pageAction == 'saleReturn')
      return 'Sale Return'
    else return 'View Sale';
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
    componentRef.instance.mainForm = this.saleForm;
    componentRef.instance.isSGSTTax = this.isSGSTTax;
    componentRef.instance.isIGSTTax = this.isIGSTTax;
  }

  /**  
   * ReuturnSale
  */
  ReuturnSale() {
    const controls = this.saleForm.controls;
    /** check form */
    if (this.saleForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    const returnSale = this.prepareSale();
    this.returnSale(returnSale);

  }

  /**
	 * Returns prepared data for save
	 */
  prepareSale(): Sale {
    const controls = this.saleForm.controls;
    const _sale = new Sale();
    _sale.clear();
    _sale.sl_sales_id = this.data.saleId;
    _sale.products_json = JSON.stringify(this.prepareProduct())
    return _sale;
  }

  /**
	 * Returns prepared data for product
	 */
  prepareProduct(): Product[] {
    const controls = this.saleForm.controls['products'].value;;
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
	 * @param _sale: User
	 */
  returnSale(_sale: Sale) {
    this.loading = true;
    let httpParams = new HttpParams();
    Object.keys(_sale).forEach(function (key) {
      httpParams = httpParams.append(key, _sale[key]);
    });

    this.salesService
      .returnSale(httpParams)
      .pipe(
        tap(response => {
          if (response.status == APP_CONSTANTS.response.SUCCESS) {
            const message = `Sales return successfully.`;
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

  changeExpansionpanel(event) {
    console.log(event);
    
    this.step = null;
    setTimeout(() => {
      this.step = event;
    }, 10);
  }
}
