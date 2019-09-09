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
import { distributorSalesSchemeListService } from '../_services'
// State
import { AppState } from '../../../core/reducers';
// Actions
import * as fromDistributorSalesSchemeListAction from '../_actions/distributorSalesSchemeList.actions';

import{ CommonResponse } from '../../common/common.model'
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { AuthNoticeService, Logout } from '../../../core/auth';
// Translate
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class DistributorSalesSchemeListEffects { 
    @Effect()
    loadAllDistributorSalesSchemeList$ = this.actions$
        .pipe(
            ofType<fromDistributorSalesSchemeListAction.LoadDistributorSalesSchemeList>(fromDistributorSalesSchemeListAction.DistributorSalesSchemeListActionTypes.LOAD_DISTRIBUTORSALESCHEMELIST),
            mergeMap((action: fromDistributorSalesSchemeListAction.LoadDistributorSalesSchemeList) => this.distributorSalesSchemeListService.getAllDistributorScheme(action.payload)),
            map((response:CommonResponse) => {
                if (response.status == APP_CONSTANTS.response.SUCCESS) {
                    let distributorSalesSchemeListArray = (response.data) ? response.data : [];
                    return new fromDistributorSalesSchemeListAction.LoadDistributorSalesSchemeListSuccess(distributorSalesSchemeListArray);
                }else if (response.status == APP_CONSTANTS.response.ERROR) {
                    return new fromDistributorSalesSchemeListAction.LoadDistributorSalesSchemeListFail(response.message);
                }else {
                    this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                    return new Logout()
                }
            }),
            catchError(err => of(new fromDistributorSalesSchemeListAction.LoadDistributorSalesSchemeListFail(err)))
        );

    constructor(
        private actions$: Actions, 
        private distributorSalesSchemeListService: distributorSalesSchemeListService, 
        private store: Store<AppState>,
        private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
        ) { }
}