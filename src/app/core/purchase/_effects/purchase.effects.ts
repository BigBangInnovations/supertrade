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
import { PurchaseService } from '../_services';
// State
import { AppState } from '../../../core/reducers';
// Selectors
import { allPurchaseLoaded } from '../_selectors/purchase.selectors';
// Actions
import {
    AllPurchaseLoaded,
    AllPurchaseRequested,
    PurchaseActionTypes,
    PurchasePageRequested,
    PurchasePageLoaded,
    PurchaseUpdated,
    PurchasePageToggleLoading,
    PurchaseDeleted,
    PurchaseOnServerCreated,
    PurchaseCreated,
    PurchaseActionToggleLoading,
    PurchaseActions
} from '../_actions/purchase.actions';

@Injectable()
export class PurchaseEffects {
    showPageLoadingDistpatcher = new PurchasePageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new PurchasePageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new PurchaseActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new PurchaseActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllPurchase$ = this.actions$
        .pipe(
            ofType<AllPurchaseRequested>(PurchaseActionTypes.AllPurchaseRequested),
            // withLatestFrom(this.store.pipe(select(allPurchaseLoaded))),
            // filter(([action, isAllPurchaseLoaded]) => !isAllPurchaseLoaded),
            mergeMap((action: AllPurchaseRequested) => this.purchaseService.getAllPurchase(action.payload)),
            map(purchase => {
                return new AllPurchaseLoaded({ purchase });
            })
        );

    @Effect()
    loadPurchasePage$ = this.actions$
        .pipe(
            ofType<PurchasePageRequested>(PurchaseActionTypes.PurchasePageRequested),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
                const requestToServer = this.purchaseService.findPurchase(payload.body);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                // console.log('response: '+JSON.stringify(response));
                const result = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);
                // console.log('result: '+JSON.stringify(result));
                
                return new PurchasePageLoaded({
                    purchase: result.data[0].purchase,
                    userPoints: result.data[0].userPointsStatus,
                    totalCount: result.data[0].purchase.length,//result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deletePurchase$ = this.actions$
        .pipe(
            ofType<PurchaseDeleted>(PurchaseActionTypes.PurchaseDeleted),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.purchaseService.deletePurchase(payload.id);
            }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updatePurchase$ = this.actions$
        .pipe(
            ofType<PurchaseUpdated>(PurchaseActionTypes.PurchaseUpdated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.purchaseService.updatePurchase(payload.purchase);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createPurchase$ = this.actions$
        .pipe(
            ofType<PurchaseOnServerCreated>(PurchaseActionTypes.PurchaseOnServerCreated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.purchaseService.createPurchase(payload.purchase).pipe(
                    tap(res => {
                        this.store.dispatch(new PurchaseCreated({ purchase: res }));
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
    //     return of(new AllPurchaseRequested(httpParams));
    // });

    constructor(private actions$: Actions, private purchaseService: PurchaseService, private store: Store<AppState>) { }
}