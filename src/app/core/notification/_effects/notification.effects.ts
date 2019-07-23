// Angular
import { Injectable } from '@angular/core';
// RxJS
import { mergeMap, map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
// Services
import { NotificationService } from '../../../core/notification/_services/notification.services';
// State
import { AppState } from '../../../core/reducers';
// Store
import { AuthNoticeService, Logout } from '../../../core/auth';

import * as notificationAction from '../_actions/notification.actions';
// import { Purchase } from '../../purchase/_models/purchase.model';
import { CommonResponse, CommonResponseDirectData } from '../../common/common.model';

import { APP_CONSTANTS } from '../../../../config/default/constants'

// Translate
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class NotificationEffects {

    @Effect()
    loadPurchases$ = this.actions$.pipe(
        ofType(notificationAction.NotificationActionType.LOAD_NOTIFICATION),
        mergeMap((action: notificationAction.LoadNotification) =>
            this.notificationServices.getNotification(action.payload).pipe(
                map(
                    (response: CommonResponseDirectData) =>{
                        if(response.status == APP_CONSTANTS.response.SUCCESS){
                            return new notificationAction.LoadNotificationSuccess(response)
                        }else if(response.status == APP_CONSTANTS.response.ERROR){
                            return new notificationAction.LoadNotificationFail(response.message)
                        }else {
                            this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                            return new Logout()
                        }
                    }
                ),
                catchError(err => of(new notificationAction.LoadNotificationFail(err)))
            )
        )
    );

    constructor(
        private actions$: Actions, 
        private notificationServices: NotificationService, 
        private store: Store<AppState>,
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
        ) { }
}