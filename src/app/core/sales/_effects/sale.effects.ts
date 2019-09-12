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
import { SalesService } from '../_services';
// State
import { AppState } from '../../../core/reducers';
// Selectors
import { allSalesLoaded } from '../_selectors/sale.selectors';
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { AuthNoticeService, Logout } from '../../../core/auth';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Actions
import {
    AllSalesLoaded,
    AllSalesRequested,
    SaleActionTypes,
    SalesPageRequested,
    SalesPageLoaded,
    SaleUpdated,
    SalesPageToggleLoading,
    SaleDeleted,
    SaleOnServerCreated,
    SaleCreated,
    SalesActionToggleLoading,
    SaleActions
} from '../_actions/sale.actions';

@Injectable()
export class SaleEffects {
    showPageLoadingDistpatcher = new SalesPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new SalesPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new SalesActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new SalesActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllSales$ = this.actions$
        .pipe(
            ofType<AllSalesRequested>(SaleActionTypes.AllSalesRequested),
            // withLatestFrom(this.store.pipe(select(allSalesLoaded))),
            // filter(([action, isAllSalesLoaded]) => !isAllSalesLoaded),
            mergeMap((action: AllSalesRequested) => this.salesService.getAllSales(action.payload)),
            map(sales => {
                return new AllSalesLoaded({ sales });
            })
        );

    @Effect()
    loadSalesPage$ = this.actions$
        .pipe(
            ofType<SalesPageRequested>(SaleActionTypes.SalesPageRequested),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
                const requestToServer = this.salesService.findSales(payload.page, payload.body);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                const result = response[0];
                if (result.status == APP_CONSTANTS.response.SUCCESS) {
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);
                return new SalesPageLoaded({
                    sales: result.data[0].sales,
                    userPoints: result.data[0].userPointsStatus,
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
    deleteSale$ = this.actions$
        .pipe(
            ofType<SaleDeleted>(SaleActionTypes.SaleDeleted),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.salesService.deleteSale(payload.id);
            }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateSale$ = this.actions$
        .pipe(
            ofType<SaleUpdated>(SaleActionTypes.SaleUpdated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.salesService.updateSale(payload.sale);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createSale$ = this.actions$
        .pipe(
            ofType<SaleOnServerCreated>(SaleActionTypes.SaleOnServerCreated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.salesService.createSale(payload.sale).pipe(
                    tap(res => {
                        this.store.dispatch(new SaleCreated({ sale: res }));
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
    //     return of(new AllSalesRequested(httpParams));
    // });

    constructor(private actions$: Actions, private salesService: SalesService, private store: Store<AppState>,
        private authNoticeService: AuthNoticeService,
        private translate: TranslateService,) { }
}