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
import { distributorPurchaseSchemeListService } from '../_services'
// State
import { AppState } from '../../../core/reducers';
// Actions
import * as fromDistributorPurchaseSchemeListAction from '../_actions/distributorPurchaseSchemeList.actions';

import{ CommonResponse } from '../../common/common.model'
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { AuthNoticeService, Logout } from '../../../core/auth';
// Translate
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class DistributorPurchaseSchemeListEffects { 
    @Effect()
    loadAllDistributorPurchaseSchemeList$ = this.actions$
        .pipe(
            ofType<fromDistributorPurchaseSchemeListAction.LoadDistributorPurchaseSchemeList>(fromDistributorPurchaseSchemeListAction.DistributorPurchaseSchemeListActionTypes.LOAD_DISTRIBUTORPURCHASECHEMELIST),
            mergeMap((action: fromDistributorPurchaseSchemeListAction.LoadDistributorPurchaseSchemeList) => this.distributorPurchaseSchemeListService.getAllDistributorScheme(action.payload)),
            map((response:CommonResponse) => {
                if (response.status == APP_CONSTANTS.response.SUCCESS) {
                    let distributorPurchaseSchemeListArray = (response.data) ? response.data : [];
                    return new fromDistributorPurchaseSchemeListAction.LoadDistributorPurchaseSchemeListSuccess(distributorPurchaseSchemeListArray);
                }else if (response.status == APP_CONSTANTS.response.ERROR) {
                    return new fromDistributorPurchaseSchemeListAction.LoadDistributorPurchaseSchemeListFail(response.message);
                }else {
                    this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                    return new Logout()
                }
            }),
            catchError(err => of(new fromDistributorPurchaseSchemeListAction.LoadDistributorPurchaseSchemeListFail(err)))
        );

    constructor(
        private actions$: Actions, 
        private distributorPurchaseSchemeListService: distributorPurchaseSchemeListService, 
        private store: Store<AppState>,
        private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
        ) { }
}