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
import { RetailerService } from '../_services';
// State
import { AppState } from '../../../core/reducers';
// Actions
import * as fromRetailerAction from '../_actions/retailer.actions';
import { Retailer } from '../_models/retailer.model'
import { APP_CONSTANTS } from '../../../../config/default/constants'

@Injectable()
export class RetailerEffects {
    @Effect()
    loadAllRetailer$ = this.actions$
        .pipe(
            ofType<fromRetailerAction.LoadRetailer>(fromRetailerAction.RetailerActionTypes.LOAD_RETAILER),
            // withLatestFrom(this.store.pipe(select(allSalesLoaded))),
            // filter(([action, isAllSalesLoaded]) => !isAllSalesLoaded),
            mergeMap((action: fromRetailerAction.LoadRetailer) => this.retailerService.getAllretailer(action.payload)),
            map((response) => {
                if (response.status == APP_CONSTANTS.response.SUCCESS) {
                    let retailerArray = (response.data[0].retailers) ? response.data[0].retailers : [];
                    return new fromRetailerAction.LoadRetailerSuccess(retailerArray);
                }
            })
        );

    constructor(private actions$: Actions, private retailerService: RetailerService, private store: Store<AppState>) { }
}