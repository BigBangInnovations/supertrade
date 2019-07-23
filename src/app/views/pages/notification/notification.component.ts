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

import { Notification, getNotificationError, getNotification, getNotificationLoaded, getNotificationLoading, LoadNotification } from '../../../core/notification';

@Component({
  selector: 'kt-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications$: Observable<Notification[]>;
  error$: Observable<String>;
  notificationLoading$: Observable<boolean>;

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
  }

  loadNotificationTab() {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('type', '109,165,166,169,170');
    httpParams = httpParams.append('status', '5,3,4,7,2');
    httpParams = httpParams.append('is_self', '0');
    this.store.dispatch(new LoadNotification(httpParams));
    this.notifications$ = this.store.pipe(select(getNotification));
    this.error$ = this.store.pipe(select(getNotificationError));
    this.notificationLoading$ = this.store.pipe(select(getNotificationLoading));
  }

  /**
	 * On destroy
	 */
  ngOnDestroy(): void {
  }

}
