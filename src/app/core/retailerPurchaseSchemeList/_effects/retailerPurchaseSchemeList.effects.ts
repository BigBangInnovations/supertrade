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
import { retailerPurchaseSchemeListService } from '../_services'
// State
import { AppState } from '../../../core/reducers';
// Actions
import * as fromRetailerPurchaseSchemeListAction from '../_actions/retailerPurchaseSchemeList.actions';

import{ CommonResponse } from '../../common/common.model'
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { AuthNoticeService, Logout } from '../../../core/auth';
// Translate
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class RetailerPurchaseSchemeListEffects { 
    @Effect()
    loadAllRetailerPurchaseSchemeList$ = this.actions$
        .pipe(
            ofType<fromRetailerPurchaseSchemeListAction.LoadRetailerPurchaseSchemeList>(fromRetailerPurchaseSchemeListAction.RetailerPurchaseSchemeListActionTypes.LOAD_RETAILERPURCHASECHEMELIST),
            mergeMap((action: fromRetailerPurchaseSchemeListAction.LoadRetailerPurchaseSchemeList) => this.retailerPurchaseSchemeListService.getAllRetailerScheme(action.payload)),
            map((response:CommonResponse) => {
                if (response.status == APP_CONSTANTS.response.SUCCESS) {
                    let retailerPurchaseSchemeListArray = (response.data) ? response.data : [];
                    return new fromRetailerPurchaseSchemeListAction.LoadRetailerPurchaseSchemeListSuccess(retailerPurchaseSchemeListArray);
                }else if (response.status == APP_CONSTANTS.response.ERROR) {
                    return new fromRetailerPurchaseSchemeListAction.LoadRetailerPurchaseSchemeListFail(response.message);
                }else {
                    this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                    return new Logout()
                }
            }),
            catchError(err => of(new fromRetailerPurchaseSchemeListAction.LoadRetailerPurchaseSchemeListFail(err)))
        );

    constructor(
        private actions$: Actions, 
        private retailerPurchaseSchemeListService: retailerPurchaseSchemeListService, 
        private store: Store<AppState>,
        private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
        ) { }
}