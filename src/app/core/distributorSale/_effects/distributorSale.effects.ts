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
import { DistributorSaleService } from '../_services';
// State
import { AppState } from '../../../core/reducers'; 
// Selectors
import { allDistributorSaleLoaded } from '../_selectors/distributorSale.selectors';
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { AuthNoticeService, Logout } from '../../../core/auth';
// Translate
import { TranslateService } from '@ngx-translate/core';
import { CommonResponse } from '../../common/common.model'
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
    DistributorSaleActions,
    LOAD_DISTRIBUTOR_SALE,
    LOAD_DISTRIBUTOR_SALE_FAIL,
    LOAD_DISTRIBUTOR_SALE_SUCCESS,
    LOAD_DISTRIBUTOR_SALE_RETURN,
    LOAD_DISTRIBUTOR_SALE_RETURN_FAIL,
    LOAD_DISTRIBUTOR_SALE_RETURN_SUCCESS
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
            mergeMap((action: AllDistributorSaleRequested) => this.distributorSaleService.getAllDistributorSale(action.payload)),
            map(distributorSale => {
                return new AllDistributorSaleLoaded({ distributorSale });
            })
        );

        @Effect()
    loadDistributorSale$ = this.actions$
        .pipe(
            ofType<LOAD_DISTRIBUTOR_SALE>(DistributorSaleActionTypes.LOAD_DISTRIBUTOR_SALE), 
            mergeMap(({ payload }) =>
                this.distributorSaleService.findDistributorSaleAsPurchase(payload).pipe(
                    map(response => {
                        if (response.status == APP_CONSTANTS.response.SUCCESS) {
                            return new LOAD_DISTRIBUTOR_SALE_SUCCESS(response.data[0].distributorSales);
                        } else {
                            this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                            return new Logout()
                        }
                    }
                    ),
                    catchError(err => of(new LOAD_DISTRIBUTOR_SALE_FAIL(err)))
                )
            )
        );

        @Effect()
    loadDistributorSaleReturn$ = this.actions$
        .pipe(
            ofType<LOAD_DISTRIBUTOR_SALE_RETURN>(DistributorSaleActionTypes.LOAD_DISTRIBUTOR_SALE_RETURN), 
            mergeMap(({ payload }) =>
                this.distributorSaleService.findDistributorSaleReturnAsPurchaseReturn(payload).pipe(
                    map(response => {
                        if (response.status == APP_CONSTANTS.response.SUCCESS) {
                            return new LOAD_DISTRIBUTOR_SALE_RETURN_SUCCESS(response.data[0]);
                        } else {
                            this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                            return new Logout()
                        }
                    }
                    ),
                    catchError(err => of(new LOAD_DISTRIBUTOR_SALE_RETURN_FAIL(err)))
                )
            )
        );

    @Effect()
    loadDistributorSalePage$ = this.actions$
        .pipe(
            ofType<DistributorSalePageRequested>(DistributorSaleActionTypes.DistributorSalePageRequested),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
                const requestToServer = this.distributorSaleService.findDistributorSale(payload.page, payload.body);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map((response: any) => {
                const result = response[0];
                if (result.status == APP_CONSTANTS.response.SUCCESS) {
                    const lastQuery: QueryParamsModel = response[1];
                    this.store.dispatch(this.hidePageLoadingDistpatcher);
                    return new DistributorSalePageLoaded({
                        distributorSale: result.data[0].distributorSales,
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

    constructor(private actions$: Actions, private distributorSaleService: DistributorSaleService, private store: Store<AppState>,
        private authNoticeService: AuthNoticeService,
        private translate: TranslateService, ) { }
}