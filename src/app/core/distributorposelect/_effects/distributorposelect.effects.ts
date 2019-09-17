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
import { DistributorPurchaseOrderService } from '../../distributorPurchaseOrder/_services'
// State
import { AppState } from '../../../core/reducers';
// Actions
import * as fromDistributorposelectAction from '../_actions/distributorposelect.actions';

import{ CommonResponse } from '../../common/common.model'
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { AuthNoticeService, Logout } from '../../../core/auth';
// Translate
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class DistributorposelectEffects { 
    @Effect()
    loadAllDistributorposelect$ = this.actions$
        .pipe(
            ofType<fromDistributorposelectAction.LoadDistributorposelect>(fromDistributorposelectAction.DistributorposelectActionTypes.LOAD_DISTRIBUTORPOSELECT),
            mergeMap((action: fromDistributorposelectAction.LoadDistributorposelect) => this.distributorPurchaseOrderService.getAllDistributorPurchaseOrder(action.payload)),
            map((response:any) => {
                if (response.status == APP_CONSTANTS.response.SUCCESS) {
                    let distributorposelectArray = (response.data[0].purchaseOrder) ? response.data[0].purchaseOrder : [];
                    return new fromDistributorposelectAction.LoadDistributorposelectSuccess(distributorposelectArray);
                }else if (response.status == APP_CONSTANTS.response.ERROR) {
                    return new fromDistributorposelectAction.LoadDistributorposelectFail(response.message);
                }else {
                    this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                    return new Logout()
                }
            }),
            catchError(err => of(new fromDistributorposelectAction.LoadDistributorposelectFail(err)))
        );

    constructor(
        private actions$: Actions, 
        private distributorPurchaseOrderService: DistributorPurchaseOrderService, 
        private store: Store<AppState>,
        private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
        ) { }
}