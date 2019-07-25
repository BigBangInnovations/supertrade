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
import { DistributorService } from '../_services';
// State
import { AppState } from '../../../core/reducers';
// Actions
import * as fromDistributorAction from '../_actions/distributor.actions';
import { Distributor } from '../_models/distributor.model'
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { AuthNoticeService, Logout } from '../../../core/auth';
// Translate
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class DistributorEffects { 
    @Effect()
    loadAllDistributor$ = this.actions$
        .pipe(
            ofType<fromDistributorAction.LoadDistributor>(fromDistributorAction.DistributorActionTypes.LOAD_DISTRIBUTOR),
            // withLatestFrom(this.store.pipe(select(allSalesLoaded))),
            // filter(([action, isAllSalesLoaded]) => !isAllSalesLoaded),
            mergeMap((action: fromDistributorAction.LoadDistributor) => this.distributorService.getAlldistributor(action.payload)),
            map((response) => {
                if (response.status == APP_CONSTANTS.response.SUCCESS) {
                    let distributorArray = (response.data[0].distributors) ? response.data[0].distributors : [];
                    return new fromDistributorAction.LoadDistributorSuccess(distributorArray);
                }else if (response.status == APP_CONSTANTS.response.ERROR) {
                    return new fromDistributorAction.LoadDistributorFail(response.message);
                }else {
                    this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                    return new Logout()
                }
            }),
            catchError(err => of(new fromDistributorAction.LoadDistributorFail(err)))
        );

    constructor(
        private actions$: Actions, 
        private distributorService: DistributorService, 
        private store: Store<AppState>,
        private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
        ) { }
}