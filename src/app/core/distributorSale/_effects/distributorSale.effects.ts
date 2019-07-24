// Angular
import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
// RxJS
import { of, Observable, defer, forkJoin } from 'rxjs';
import { mergeMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// CRUD
import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';
// Services
import { DistributorSaleService } from '../_services';
// State
import { AppState } from '../../../core/reducers';
// Selectors
import { allDistributorSaleLoaded } from '../_selectors/distributorSale.selectors';
// Actions
import {
    AllDistributorSaleLoaded,
    AllDistributorSaleRequested,
    DistributorSaleActionTypes,
    DistributorSalePageRequested,
    DistributorSalePageLoaded,
    DistributorSaleUpdated,
    DistributorSalePageToggleLoading,
    DistributorSaleDeleted,
    DistributorSaleOnServerCreated,
    DistributorSaleCreated,
    DistributorSaleActionToggleLoading,
    DistributorSaleActions
} from '../_actions/distributorSale.actions';

@Injectable()
export class DistributorSaleEffects {
    showPageLoadingDistpatcher = new DistributorSalePageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new DistributorSalePageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new DistributorSaleActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new DistributorSaleActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllDistributorSale$ = this.actions$
        .pipe(
            ofType<AllDistributorSaleRequested>(DistributorSaleActionTypes.AllDistributorSaleRequested),
            // withLatestFrom(this.store.pipe(select(allDistributorSaleLoaded))),
            // filter(([action, isAllDistributorSaleLoaded]) => !isAllDistributorSaleLoaded),
            mergeMap((action: AllDistributorSaleRequested) => this.distributorSaleService.getAllDistributorSale(action.payload)),
            map(distributorSale => {
                return new AllDistributorSaleLoaded({ distributorSale });
            })
        );

    @Effect()
    loadDistributorSalePage$ = this.actions$
        .pipe(
            ofType<DistributorSalePageRequested>(DistributorSaleActionTypes.DistributorSalePageRequested),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
                const requestToServer = this.distributorSaleService.findDistributorSale(payload.body);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                // console.log('response: '+JSON.stringify(response));
                const result = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);
                // console.log('result: '+JSON.stringify(result));
                
                return new DistributorSalePageLoaded({
                    distributorSale: result.data[0].distributorSale,
                    userPoints: result.data[0].userPointsStatus,
                    totalCount: result.data[0].distributorSale.length,//result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteDistributorSale$ = this.actions$
        .pipe(
            ofType<DistributorSaleDeleted>(DistributorSaleActionTypes.DistributorSaleDeleted),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.distributorSaleService.deleteDistributorSale(payload.id);
            }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateDistributorSale$ = this.actions$
        .pipe(
            ofType<DistributorSaleUpdated>(DistributorSaleActionTypes.DistributorSaleUpdated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.distributorSaleService.updateDistributorSale(payload.distributorSale);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createDistributorSale$ = this.actions$
        .pipe(
            ofType<DistributorSaleOnServerCreated>(DistributorSaleActionTypes.DistributorSaleOnServerCreated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.distributorSaleService.createDistributorSale(payload.distributorSale).pipe(
                    tap(res => {
                        this.store.dispatch(new DistributorSaleCreated({ distributorSale: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    // @Effect()
    // init$: Observable<Action> = defer(() => {
    //     let httpParams = new HttpParams();
	// 	httpParams = httpParams.append('scheme_id', 'PUR003');
    //     return of(new AllDistributorSaleRequested(httpParams));
    // });

    constructor(private actions$: Actions, private distributorSaleService: DistributorSaleService, private store: Store<AppState>) { }
}