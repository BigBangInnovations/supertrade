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
import { retailerSalesSchemeListService } from '../_services'
// State
import { AppState } from '../../../core/reducers';
// Actions
import * as fromRetailerSalesSchemeListAction from '../_actions/retailerSalesSchemeList.actions';

import{ CommonResponse } from '../../common/common.model'
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { AuthNoticeService, Logout } from '../../../core/auth';
// Translate
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class RetailerSalesSchemeListEffects { 
    @Effect()
    loadAllRetailerSalesSchemeList$ = this.actions$
        .pipe(
            ofType<fromRetailerSalesSchemeListAction.LoadRetailerSalesSchemeList>(fromRetailerSalesSchemeListAction.RetailerSalesSchemeListActionTypes.LOAD_RETAILERSALESCHEMELIST),
            mergeMap((action: fromRetailerSalesSchemeListAction.LoadRetailerSalesSchemeList) => this.retailerSalesSchemeListService.getAllRetailerScheme(action.payload)),
            map((response:CommonResponse) => {
                if (response.status == APP_CONSTANTS.response.SUCCESS) {
                    let retailerSalesSchemeListArray = (response.data) ? response.data : [];
                    return new fromRetailerSalesSchemeListAction.LoadRetailerSalesSchemeListSuccess(retailerSalesSchemeListArray);
                }else if (response.status == APP_CONSTANTS.response.ERROR) {
                    return new fromRetailerSalesSchemeListAction.LoadRetailerSalesSchemeListFail(response.message);
                }else {
                    this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                    return new Logout()
                }
            }),
            catchError(err => of(new fromRetailerSalesSchemeListAction.LoadRetailerSalesSchemeListFail(err)))
        );

    constructor(
        private actions$: Actions, 
        private retailerSalesSchemeListService: retailerSalesSchemeListService, 
        private store: Store<AppState>,
        private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
        ) { }
}