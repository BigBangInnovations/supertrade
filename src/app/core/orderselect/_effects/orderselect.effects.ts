// Angular
import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
// RxJS
import { of, Observable, defer, forkJoin } from 'rxjs';
// import { mergeMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { mergeMap, map, tap, catchError } from 'rxjs/operators';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// Services
import { OrderService } from '../../order/_services'
// State
import { AppState } from '../../../core/reducers';
// Actions
import * as fromOrderselectAction from '../_actions/orderselect.actions';

import{ CommonResponse } from '../../common/common.model'
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { AuthNoticeService, Logout } from '../../../core/auth';
// Translate
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class OrderselectEffects { 
    @Effect()
    loadAllOrderselect$ = this.actions$
        .pipe(
            ofType<fromOrderselectAction.LoadOrderselect>(fromOrderselectAction.OrderselectActionTypes.LOAD_ORDERSELECT),
            mergeMap((action: fromOrderselectAction.LoadOrderselect) => this.orderselectService.getAllorderselect(action.payload)),
            map((response:CommonResponse) => {
                if (response.status == APP_CONSTANTS.response.SUCCESS) {
                    let orderselectArray = (response.data) ? response.data : [];
                    return new fromOrderselectAction.LoadOrderselectSuccess(orderselectArray);
                }else if (response.status == APP_CONSTANTS.response.ERROR) {
                    return new fromOrderselectAction.LoadOrderselectFail(response.message);
                }else {
                    this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                    return new Logout()
                }
            }),
            catchError(err => of(new fromOrderselectAction.LoadOrderselectFail(err)))
        );

    constructor(
        private actions$: Actions, 
        private orderselectService: OrderService, 
        private store: Store<AppState>,
        private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
        ) { }
}