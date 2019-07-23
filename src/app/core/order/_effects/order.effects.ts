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
import { OrderService } from '../_services';
// State
import { AppState } from '../../../core/reducers';
// Selectors
import { allOrderLoaded } from '../_selectors/order.selectors';
// Actions
import {
    AllOrderLoaded,
    AllOrderRequested,
    OrderActionTypes,
    OrderPageRequested,
    OrderPageLoaded,
    OrderUpdated,
    OrderPageToggleLoading,
    OrderDeleted,
    OrderOnServerCreated,
    OrderCreated,
    OrderActionToggleLoading,
    OrderActions
} from '../_actions/order.actions';

@Injectable()
export class OrderEffects {
    showPageLoadingDistpatcher = new OrderPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new OrderPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new OrderActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new OrderActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllOrder$ = this.actions$
        .pipe(
            ofType<AllOrderRequested>(OrderActionTypes.AllOrderRequested),
            // withLatestFrom(this.store.pipe(select(allOrderLoaded))),
            // filter(([action, isAllOrderLoaded]) => !isAllOrderLoaded),
            mergeMap((action: AllOrderRequested) => this.orderService.getAllOrder(action.payload)),
            map(order => {
                return new AllOrderLoaded({ order });
            })
        );

    @Effect()
    loadOrderPage$ = this.actions$
        .pipe(
            ofType<OrderPageRequested>(OrderActionTypes.OrderPageRequested),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
                const requestToServer = this.orderService.findOrder(payload.body);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                // console.log('response: '+JSON.stringify(response));
                const result = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);
                return new OrderPageLoaded({
                    order: result.data,
                    totalCount: result.data.length,//result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteOrder$ = this.actions$
        .pipe(
            ofType<OrderDeleted>(OrderActionTypes.OrderDeleted),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.orderService.deleteOrder(payload.id);
            }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateOrder$ = this.actions$
        .pipe(
            ofType<OrderUpdated>(OrderActionTypes.OrderUpdated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.orderService.updateOrder(payload.order);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createOrder$ = this.actions$
        .pipe(
            ofType<OrderOnServerCreated>(OrderActionTypes.OrderOnServerCreated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.orderService.createOrder(payload.order).pipe(
                    tap(res => {
                        this.store.dispatch(new OrderCreated({ order: res }));
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
    //     return of(new AllOrderRequested(httpParams));
    // });

    constructor(private actions$: Actions, private orderService: OrderService, private store: Store<AppState>) { }
}