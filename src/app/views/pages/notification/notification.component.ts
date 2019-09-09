import { Component, OnInit, OnDestroy } from '@angular/core';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/reducers';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { HttpParams } from "@angular/common/http";
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewDistributorSaleComponent } from '../distributorSale/view-distributorSale/view-distributorSale.component';
import { ViewPurchaseComponent } from '../purchase/view-purchase/view-purchase.component';
import {
  Notification,
  getNotificationError,
  getNotification,
  getNotificationLoaded,
  getNotificationLoading,
  LoadNotification,

  getApproval,
  getApprovalError,
  getApprovalLoaded,
  getApprovalLoading,
  LoadApproval,

  getMyPendingApproval,
  getMyPendingApprovalError,
  getMyPendingApprovalLoaded,
  getMyPendingApprovalLoading,
  LoadMyPendingApproval

} from '../../../core/notification';

// Services
import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';
import { EncrDecrServiceService } from '../../../core/auth/_services/encr-decr-service.service'

@Component({
  selector: 'kt-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications$: Observable<Notification[]>;
  approvals$: Observable<Notification[]>;
  myPendingApprovals$: Observable<Notification[]>;

  error$: Observable<String>;
  approvalError$: Observable<String>;
  myPendingApprovalError$: Observable<String>;

  notificationLoading$: Observable<boolean>;
  approvalLoading$: Observable<boolean>;
  myPendingApprovalLoading$: Observable<boolean>;

  readonly app_constants = APP_CONSTANTS;
  /**
    * Component constructor 
    *
    * @param translate: TranslateService
    * @param store: Store<AppState>
	 * @param dialog: MatDialog
	 * @param snackBar: MatSnackBar
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param EncrDecr: EncrDecrServiceService
	 * @param fb: FormBuilder
    */
  constructor(
    private translate: TranslateService,
    private store: Store<AppState>,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private EncrDecr: EncrDecrServiceService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.loadNotificationTab();
  }

  loadNotificationTab() {
    /**
     *  1	pending #ffb82273
        2	approved #00800069
        3	rejected #ff000059
        4	cancelled #74788d57
        5	alert #ffff0066
        6	sync
        7	close 
     */
    let httpParams = new HttpParams();
    httpParams = httpParams.append('type',`${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERSALES_ORDER},${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_DISTRIBUTOR_ADD_SALES},${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_RETAILER_PURCHASE_RETURN},${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_RETAILER_PARTIAL_PURCHASE_REQUEST},${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_DISTRIBUTOR_PARTIAL_PURCHASERETUN_REQUEST},${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_DISTRIBUTOR_ADD_SALES_RETURN}`);
    httpParams = httpParams.append('status',`${APP_CONSTANTS.NOTIFICATION_STATUS.STATUS_APPROVED},${APP_CONSTANTS.NOTIFICATION_STATUS.STATUS_REJECTED},${APP_CONSTANTS.NOTIFICATION_STATUS.STATUS_CANCELLED},${APP_CONSTANTS.NOTIFICATION_STATUS.STATUS_ALERT},${APP_CONSTANTS.NOTIFICATION_STATUS.STATUS_CLOSE}`);
    httpParams = httpParams.append('is_self', `${APP_CONSTANTS.NOTIFICATION_SELF.IS_SELF_FALSE}`);
    this.store.dispatch(new LoadNotification(httpParams));
    this.notifications$ = this.store.pipe(select(getNotification));
    this.error$ = this.store.pipe(select(getNotificationError));
    this.notificationLoading$ = this.store.pipe(select(getNotificationLoading));
  }

  loadApprovalTab() {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('type',`${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERSALES_ORDER},${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_DISTRIBUTOR_ADD_SALES},${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_RETAILER_PURCHASE_RETURN},${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_RETAILER_PARTIAL_PURCHASE_REQUEST},${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_DISTRIBUTOR_PARTIAL_PURCHASERETUN_REQUEST},${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_DISTRIBUTOR_ADD_SALES_RETURN}`);
    httpParams = httpParams.append('status',`${APP_CONSTANTS.NOTIFICATION_STATUS.STATUS_PENDING}`);
    httpParams = httpParams.append('is_self', `${APP_CONSTANTS.NOTIFICATION_SELF.IS_SELF_FALSE}`);
    this.store.dispatch(new LoadApproval(httpParams));
    this.approvals$ = this.store.pipe(select(getApproval));
    this.approvalError$ = this.store.pipe(select(getApprovalError));
    this.approvalLoading$ = this.store.pipe(select(getApprovalLoading));
  }

  loadMyPendingApprovalTab() {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('type',`${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERSALES_ORDER},${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_DISTRIBUTOR_ADD_SALES},${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_RETAILER_PURCHASE_RETURN},${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_RETAILER_PARTIAL_PURCHASE_REQUEST},${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_DISTRIBUTOR_PARTIAL_PURCHASERETUN_REQUEST},${APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_DISTRIBUTOR_ADD_SALES_RETURN}`);
    httpParams = httpParams.append('status',`${APP_CONSTANTS.NOTIFICATION_STATUS.STATUS_PENDING},${APP_CONSTANTS.NOTIFICATION_STATUS.STATUS_ALERT}`);
    httpParams = httpParams.append('is_self', `${APP_CONSTANTS.NOTIFICATION_SELF.IS_SELF_TRUE}`);
    this.store.dispatch(new LoadMyPendingApproval(httpParams));
    this.myPendingApprovals$ = this.store.pipe(select(getMyPendingApproval));
    this.myPendingApprovalError$ = this.store.pipe(select(getMyPendingApprovalError));
    this.myPendingApprovalLoading$ = this.store.pipe(select(getMyPendingApprovalLoading));
  }

  /**
	 * On destroy
	 */
  ngOnDestroy(): void {
  }

  tabChangeEvent(event) {
    if (event.index == 0) {
      this.loadNotificationTab();
    } else if (event.index == 1) {
      this.loadApprovalTab();
    } else if (event.index == 2) {
      this.loadMyPendingApprovalTab();
    }
  }

  viewApproval(data) {
    let newTransaction_ID = data.Transaction_ID.replace('PAR', ""); 
    let notificationData = [];
    notificationData.push(data);
console.log(data.Type);

if (data.Type && data.Type == APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_DISTRIBUTOR_ADD_SALES && data.Status == APP_CONSTANTS.NOTIFICATION_STATUS.STATUS_PENDING) {
  /**
   * Screen retailer approval
   * Retailer to accept reject purchase cretaed by distributor
   */
  const dialogRef = this.dialog.open(ViewDistributorSaleComponent, {
    data: {Type:data.Type, transactionID: newTransaction_ID, action: 'retailerPurchaseApproval', notificationData: notificationData },
    width: '600px',
  });

  dialogRef.afterClosed().subscribe(res => {
    if (res == 'reload')
      this.loadApprovalTab();
  });

}else if (data.Type && data.Type == APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_DISTRIBUTOR_ADD_SALES_RETURN && data.Status == APP_CONSTANTS.NOTIFICATION_STATUS.STATUS_PENDING) {
  /**
   * Screen retailer approval
   * Retailer to accept reject purchase return cretaed by distributor
   */
  const dialogRef = this.dialog.open(ViewPurchaseComponent, {
    data: {Type:data.Type,  transactionID: newTransaction_ID, action: 'retailerPurchaseReturnApprovalByDistributor', notificationData: notificationData },
    width: '600px',
  });

  dialogRef.afterClosed().subscribe(res => {
    if (res == 'reload')
      this.loadApprovalTab();
  });

} else if (data.Type && data.Type == APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_RETAILER_PURCHASE_RETURN && data.Status == APP_CONSTANTS.NOTIFICATION_STATUS.STATUS_PENDING) {
      /** 
       * Screen Distributor approva
       * Retailer request for his purchase return than approval comes to distributor
       */
      const dialogRef = this.dialog.open(ViewPurchaseComponent, {
        data: {Type:data.Type,  transactionID: newTransaction_ID, action: 'retailerPurchaseReturnApproval', notificationData: notificationData },
        width: '600px',
      });

      dialogRef.afterClosed().subscribe(res => {
        if (res == 'reload')
          this.loadApprovalTab();
      });
    } else if (data.Type && data.Type == APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_RETAILER_PARTIAL_PURCHASE_REQUEST && data.Status == APP_CONSTANTS.NOTIFICATION_STATUS.STATUS_PENDING) {
      /**
       * Screen distributor approval
       * Approval for retailer accept purchse partial that's why approval to distributor to inform
       */
      const dialogRef = this.dialog.open(ViewDistributorSaleComponent, {
        data: {Type:data.Type,  transactionID: newTransaction_ID, action: 'retailerPartialSalesAcceptApproval', notificationData: notificationData },
        width: '600px',
      });

      dialogRef.afterClosed().subscribe(res => {
        if (res == 'reload')
          this.loadApprovalTab();
      });

    } else if (data.Type && data.Type == APP_CONSTANTS.NOTIFICATION_TYPE.SUPERTRADE_DISTRIBUTOR_PARTIAL_PURCHASERETUN_REQUEST && data.Status == APP_CONSTANTS.NOTIFICATION_STATUS.STATUS_PENDING) {
      /** 
       * Screen retailer approva
       * distributor acept retailer purchase return request partial, 
       * approvel to retailer regard  this confirmation
       */
      const dialogRef = this.dialog.open(ViewPurchaseComponent, {
        data: {Type:data.Type,  transactionID: newTransaction_ID, action: 'distributorPartialAcceptPurchaseReturnApproval', notificationData: notificationData },
        width: '600px',
      });

      dialogRef.afterClosed().subscribe(res => {
        if (res == 'reload')
          this.loadApprovalTab();
      });
    }
  }
}