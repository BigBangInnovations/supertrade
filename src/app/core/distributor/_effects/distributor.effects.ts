// Angular
import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
// RxJS
import { of, Observable, defer, forkJoin } from 'rxjs';
import { mergeMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
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
                }
            })
        );

    constructor(private actions$: Actions, private distributorService: DistributorService, private store: Store<AppState>) { }
}