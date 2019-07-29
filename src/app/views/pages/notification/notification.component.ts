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

@Component({
  selector: 'kt-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
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

  /**
    * Component constructor 
    *
    * @param translate: TranslateService
    * @param store: Store<AppState>
    */
  constructor(
    private translate: TranslateService,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.loadNotificationTab();
    this.loadMyPendingApprovalTab();
    this.loadApprovalTab();
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
    httpParams = httpParams.append('type', '109,165,166,169,170');
    httpParams = httpParams.append('status', '2,3,4,5,7');
    httpParams = httpParams.append('is_self', '0');
    this.store.dispatch(new LoadNotification(httpParams));
    this.notifications$ = this.store.pipe(select(getNotification));
    this.error$ = this.store.pipe(select(getNotificationError));
    this.notificationLoading$ = this.store.pipe(select(getNotificationLoading));
  }

  loadApprovalTab() {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('type', '109,165,166,169,170');
    httpParams = httpParams.append('status', '1');
    httpParams = httpParams.append('is_self', '0');
    this.store.dispatch(new LoadApproval(httpParams));
    this.approvals$ = this.store.pipe(select(getApproval));
    this.approvalError$ = this.store.pipe(select(getApprovalError));
    this.approvalLoading$ = this.store.pipe(select(getApprovalLoading));
  }

  loadMyPendingApprovalTab() {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('type', '109,165,166,169,170');
    httpParams = httpParams.append('status', '1,5');
    httpParams = httpParams.append('is_self', '1');
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

}