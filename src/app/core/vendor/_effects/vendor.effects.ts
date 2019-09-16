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
import { VendorService } from '../_services';
// State
import { AppState } from '../../../core/reducers';
// Actions
import * as fromVendorAction from '../_actions/vendor.actions';
import { Vendor } from '../_models/vendor.model'
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { AuthNoticeService, Logout } from '../../../core/auth';
// Translate
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class VendorEffects { 
    @Effect()
    loadAllVendor$ = this.actions$
        .pipe(
            ofType<fromVendorAction.LoadVendor>(fromVendorAction.VendorActionTypes.LOAD_VENDOR),
            // withLatestFrom(this.store.pipe(select(allSalesLoaded))),
            // filter(([action, isAllSalesLoaded]) => !isAllSalesLoaded),
            mergeMap((action: fromVendorAction.LoadVendor) => this.vendorService.getAllvendor(action.payload)),
            map((response) => {
                if (response.status == APP_CONSTANTS.response.SUCCESS) {
                    let vendorArray = (response.data[0].vendors) ? response.data[0].vendors : [];
                    return new fromVendorAction.LoadVendorSuccess(vendorArray);
                }else if (response.status == APP_CONSTANTS.response.ERROR) {
                    return new fromVendorAction.LoadVendorFail(response.message);
                }else {
                    this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                    return new Logout()
                }
            }),
            catchError(err => of(new fromVendorAction.LoadVendorFail(err)))
        );

    constructor(
        private actions$: Actions, 
        private vendorService: VendorService, 
        private store: Store<AppState>,
        private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
        ) { }
}