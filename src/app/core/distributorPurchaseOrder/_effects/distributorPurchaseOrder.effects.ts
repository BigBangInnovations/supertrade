// Angular
import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
// RxJS
import { of, Observable, defer, forkJoin } from 'rxjs';
import { mergeMap, map, withLatestFrom, filter, tap, catchError } from 'rxjs/operators';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// CRUD
import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';
// Services
import { DistributorPurchaseOrderService } from '../_services';
// State
import { AppState } from '../../../core/reducers';
// Selectors
import { allDistributorPurchaseOrderLoaded } from '../_selectors/distributorPurchaseOrder.selectors';
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { AuthNoticeService, Logout } from '../../../core/auth';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Actions
import {
    AllDistributorPurchaseOrderLoaded,
    AllDistributorPurchaseOrderRequested,
    DistributorPurchaseOrderActionTypes,
    DistributorPurchaseOrderPageRequested,
    DistributorPurchaseOrderPageLoaded,
    DistributorPurchaseOrderUpdated,
    DistributorPurchaseOrderPageToggleLoading,
    DistributorPurchaseOrderDeleted,
    DistributorPurchaseOrderOnServerCreated,
    DistributorPurchaseOrderCreated,
    DistributorPurchaseOrderActionToggleLoading,
    DistributorPurchaseOrderActions,
} from '../_actions/distributorPurchaseOrder.actions';

@Injectable()
export class DistributorPurchaseOrderEffects {
    showPageLoadingDistpatcher = new DistributorPurchaseOrderPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new DistributorPurchaseOrderPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new DistributorPurchaseOrderActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new DistributorPurchaseOrderActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllDistributorPurchaseOrder$ = this.actions$
        .pipe(
            ofType<AllDistributorPurchaseOrderRequested>(DistributorPurchaseOrderActionTypes.AllDistributorPurchaseOrderRequested),
            mergeMap((action: AllDistributorPurchaseOrderRequested) => this.distributorPurchaseOrderService.getAllDistributorPurchaseOrder(action.payload)),
            map(distributorPurchaseOrder => {
                return new AllDistributorPurchaseOrderLoaded({ distributorPurchaseOrder });
            })
        );

    @Effect()
    loadDistributorPurchaseOrderPage$ = this.actions$
        .pipe(
            ofType<DistributorPurchaseOrderPageRequested>(DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderPageRequested),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
                const requestToServer = this.distributorPurchaseOrderService.findDistributorPurchaseOrder(payload.page, payload.body);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                const result = response[0];
                if (result.status == APP_CONSTANTS.response.SUCCESS) {
                    const lastQuery: QueryParamsModel = response[1];
                    this.store.dispatch(this.hidePageLoadingDistpatcher);
                    // console.log('result: '+JSON.stringify(result));

                    return new DistributorPurchaseOrderPageLoaded({
                        distributorPurchaseOrder: result.data[0].purchaseOrder,
                        totalCount: result.data[0].totalRecords,//result.totalCount,
                        page: lastQuery
                    });
                } else {
                    this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                    return new Logout()
                }
            }),
        );

    @Effect()
    deleteDistributorPurchaseOrder$ = this.actions$
        .pipe(
            ofType<DistributorPurchaseOrderDeleted>(DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderDeleted),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.distributorPurchaseOrderService.deleteDistributorPurchaseOrder(payload.id);
            }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateDistributorPurchaseOrder$ = this.actions$
        .pipe(
            ofType<DistributorPurchaseOrderUpdated>(DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderUpdated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.distributorPurchaseOrderService.updateDistributorPurchaseOrder(payload.distributorPurchaseOrder);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createDistributorPurchaseOrder$ = this.actions$
        .pipe(
            ofType<DistributorPurchaseOrderOnServerCreated>(DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderOnServerCreated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.distributorPurchaseOrderService.createDistributorPurchaseOrder(payload.distributorPurchaseOrder).pipe(
                    tap(res => {
                        this.store.dispatch(new DistributorPurchaseOrderCreated({ distributorPurchaseOrder: res }));
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
    //     return of(new AllDistributorPurchaseOrderRequested(httpParams));
    // });

    constructor(private actions$: Actions, private distributorPurchaseOrderService: DistributorPurchaseOrderService, private store: Store<AppState>,
        private authNoticeService: AuthNoticeService,
        private translate: TranslateService, ) { }
}