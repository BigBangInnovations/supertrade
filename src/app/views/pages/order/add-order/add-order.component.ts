// Angular
import { ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef, ComponentFactory, Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { HttpParams } from "@angular/common/http";
// RxJS
import { BehaviorSubject, Observable, of, Subscription, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
// Services and Models
import { Order, AddEditOrder } from '../../../../core/order/_models/order.model';
import { EncrDecrServiceService } from '../../../../core/auth/_services/encr-decr-service.service'
import { environment } from '../../../../../environments/environment';
// Components
import { PopupProductComponent } from '../../popup-product/popup-product.component';
import { PopupAddProductComponent } from '../../popup-product/popup-add-product/popup-add-product.component';
import { Product } from '../../../../core/product/_models/product.model'
import { Distributor } from '../../../../core/distributor/_models/distributor.model'
import { OrderService } from '../../../../core/order/_services/index'
import { APP_CONSTANTS } from '../../../../../config/default/constants'
import { Logout } from '../../../../core/auth';
import { PopupProductTotalCalculationComponent } from '../../popup-product/popup-add-product/popup-product-total-calculation/popup-product-total-calculation.component'
import { dynamicProductTemplateSetting } from '../../../../core/common/common.model'
import * as fromDistributor from '../../../../core/distributor'

@Component({
  selector: 'kt-add-order',
  templateUrl: './add-order.component.html',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
  // styleUrls: ['./add-order.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddOrderComponent implements OnInit, OnDestroy {
  // Public properties
  order: Order;
  orderForm: FormGroup;
  hasFormErrors: boolean = false;
  orderActiveScheme: any;
  orderActiveSchemebooster: any;
  userData: any;
  componentRef: any;
  loading = false;
  OptionalSetting: dynamicProductTemplateSetting;
  pageAction: string;
  viewLoading$: Observable<boolean>;
  distributor$: Observable<Distributor[]>;
  // Private properties
  private subscriptions: Subscription[] = [];
  @ViewChild('popupProductCalculation', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;
  today = new Date();
  private addedProductsIds: any[] = [];
  private unsubscribe: Subject<any>;

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param orderFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
   * @param EncrDecr: EncrDecrServiceService
   * @param dialog: MatDialog
   * @param datePipe: DatePipe
   * @param orderService: OrderService,
   * @param cdr
	 */
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private orderFB: FormBuilder,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private store: Store<AppState>,
    private layoutConfigService: LayoutConfigService,
    private EncrDecr: EncrDecrServiceService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver
  ) {
    this.unsubscribe = new Subject();
    const OptionalSetting = new dynamicProductTemplateSetting();
    OptionalSetting.clear();
    OptionalSetting.displayPointCalculation = false;
    this.OptionalSetting = OptionalSetting;
    
    this.pageAction = 'addOrder'
  }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(params => {
      let sessionStorage = this.EncrDecr.getLocalStorage(environment.localStorageKey);
      this.userData = JSON.parse(sessionStorage)
      this.initOrder();

      //Load distribiutor
      this.store.select(fromDistributor.selectDistributorLoaded).pipe().subscribe(data => {
        if (data) {
          this.distributor$ = this.store.pipe(select(fromDistributor.selectAllDistributor));
        } else {
          let httpParams = new HttpParams();
          this.store.dispatch(new fromDistributor.LoadDistributor(httpParams))
          this.distributor$ = this.store.pipe(select(fromDistributor.selectAllDistributor));
        }
      });
      this.viewLoading$ = this.store.pipe(select(fromDistributor.selectDistributorLoading));

    });
    this.subscriptions.push(routeSubscription);

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

	/**
	 * Init user
	 */
  initOrder() {
    this.createForm();
    this.subheaderService.setTitle('Add Order');
    this.subheaderService.setBreadcrumbs([
      { title: 'Order', page: `order` },
      { title: 'Add Order', page: `add-order` }
    ]);
  }

	/**
	 * Create form
	 */
  createForm() {
    this.orderForm = this.orderFB.group({
      distributor_id: ['', Validators.required],
      Description: [''],
      products: this.orderFB.array([], Validators.required)
    });
  }

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
  submit() {
    this.hasFormErrors = false;
    const controls = this.orderForm.controls;
    /** check form */
    if (this.orderForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        return controls[controlName].markAsTouched()
      }
      );

      this.hasFormErrors = true;
      return;
    }

    const addEditOrder = this.prepareAddEditOrder();
    this.addEditOrder(addEditOrder);
  }

	/**
	 * Returns prepared data for save
	 */
  prepareAddEditOrder(): AddEditOrder {
    const _addEditOrder = new AddEditOrder();
    _addEditOrder.clear();
    _addEditOrder.addsalesorderjson = JSON.stringify(this.prepareOrder())
    _addEditOrder.addsalesorderproductjson = JSON.stringify(this.prepareProduct())
    _addEditOrder.CompanyID = this.userData.Company_ID;
    _addEditOrder.UserID = this.userData.ID;
    _addEditOrder.TokenID = this.userData.Security_Token;
    return _addEditOrder;
  }

  /**
	 * Returns prepared data for save
	 */
  prepareOrder(): Order {
    const controls = this.orderForm.controls;
    const _order = new Order();
    _order.clear();
    _order.SOMadeBy = (this.userData.Company_Type_ID == APP_CONSTANTS.USER_ROLE.RETAILER_TYPE)?'Retailer':'Distributor'
    _order.AssignedTo = this.userData.Tagged_To;
    _order.CreatedBy = this.userData.Tagged_To;
    _order.CompanyID = this.userData.Company_ID;
    _order.CustomerID = this.userData.ID;
    _order.FulfilledByID = this.userData.Distributor_ID;
    _order.Description = controls['Description'].value;
    _order.NetAmount = 0;
    _order.GrossAmount = 0;
    _order.LocalTaxValue = 0;
    return _order;
  }

  /**
	 * Returns prepared data for product
	 */
  prepareProduct(): Product[] {
    const controls = this.orderForm.controls['products'].value;;
    const _products = [];

    controls.forEach(data => {
      //Clear Product and set default value
      const product = new Product();
      product.clear();
      product.ProductID = data.productCtrl;//Product Original ID
      product.ProductCode = data.productProductCodeCtrl;//Product Original ID
      product.serial_no = '';//Serial number
      product.ProductAmount = data.productPriceCtrl * data.productQuantityCtrl;//Product Amount:: Product prive * Quantity
      product.Price = data.productPriceCtrl;//Product original price
      product.Quantity = data.productQuantityCtrl;//product original order quantity
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
    });
    return _products;
  }

	/**
	 * Add User
	 *
	 * @param _order: User
	 */
  addEditOrder(_order: AddEditOrder) {
    this.loading = true;
    let httpParams = new HttpParams();
    Object.keys(_order).forEach(function (key) {
      httpParams = httpParams.append(key, _order[key]);
    });

    this.orderService
      .createOrder(httpParams)
      .pipe(
        tap(response => {
          if (response.status == APP_CONSTANTS.response.SUCCESS) {
            const message = `Order successfully has been added.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, false, false);
            this.router.navigateByUrl('order'); // order listing page
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

	/**
	 * Returns component title
	 */
  getComponentTitle() {
    let result = 'Create Order';
    return result;
  }

	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  /**
	 * Add product
	 *
	 */
  addProduct() {
    const _saveMessage = `Product added.`;
    const _messageType = MessageType.Read;

    const dialogRef = this.dialog.open(PopupProductComponent, {
      data: { addedProductsIds: this.addedProductsIds, isDiscount: true },
      // data: { addedProductsIds: [] },
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      /**
       * try to add dynamic child
       */
      this.createProduct(res)

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 2000, false, false);
    });
  }

  /**
  * try to add dynamic product
  */
  createProduct(res) {
    const currentProductArray = <FormArray>this.orderForm.controls['products'];
    currentProductArray.push(
      this.orderFB.group(res)
    )
    this.commonCalculation()
  }

  commonCalculation() {
    // this.calculateAllProductsTotal()

    //Total Calculate
    const componentFactory = this.resolver.resolveComponentFactory(PopupProductTotalCalculationComponent);
    // const viewContainerRef = this.entry.viewContainerRef;
    const viewContainerRef = this.entry;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    // componentRef.instance.orderForm = this.orderForm;
    componentRef.instance.mainForm = this.orderForm;
    const sub: Subscription = componentRef.instance.newAddedProductsIds.subscribe(
      event => {
        // console.log(event)
        this.newAddedProductsIdsUpdate(event)
      }
    );
    componentRef.onDestroy(() => { sub.unsubscribe(); });
  }

  newAddedProductsIdsUpdate(ids) {
    this.addedProductsIds = ids.addedProductsIds;
    // console.log(this.addedProductsIds);
  }
}