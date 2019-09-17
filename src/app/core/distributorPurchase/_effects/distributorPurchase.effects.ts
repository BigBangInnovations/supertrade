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
import { DistributorPurchaseService } from '../_services';
// State
import { AppState } from '../../../core/reducers'; 
// Selectors
import { allDistributorPurchaseLoaded } from '../_selectors/distributorPurchase.selectors';
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { AuthNoticeService, Logout } from '../../../core/auth';
// Translate
import { TranslateService } from '@ngx-translate/core';
import { CommonResponse } from '../../common/common.model'
// Actions
import {
    AllDistributorPurchaseLoaded,
    AllDistributorPurchaseRequested,
    DistributorPurchaseActionTypes,
    DistributorPurchasePageRequested,
    DistributorPurchasePageLoaded,
    DistributorPurchaseUpdated,
    DistributorPurchasePageToggleLoading,
    DistributorPurchaseDeleted,
    DistributorPurchaseOnServerCreated,
    DistributorPurchaseCreated,
    DistributorPurchaseActionToggleLoading,
    DistributorPurchaseActions,
    LOAD_DISTRIBUTOR_PURCHASE,
    LOAD_DISTRIBUTOR_PURCHASE_FAIL,
    LOAD_DISTRIBUTOR_PURCHASE_SUCCESS,
    LOAD_DISTRIBUTOR_PURCHASE_RETURN,
    LOAD_DISTRIBUTOR_PURCHASE_RETURN_FAIL,
    LOAD_DISTRIBUTOR_PURCHASE_RETURN_SUCCESS
} from '../_actions/distributorPurchase.actions';

@Injectable()
export class DistributorPurchaseEffects {
    showPageLoadingDistpatcher = new DistributorPurchasePageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new DistributorPurchasePageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new DistributorPurchaseActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new DistributorPurchaseActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllDistributorPurchase$ = this.actions$
        .pipe(
            ofType<AllDistributorPurchaseRequested>(DistributorPurchaseActionTypes.AllDistributorPurchaseRequested),
            mergeMap((action: AllDistributorPurchaseRequested) => this.distributorPurchaseService.getAllDistributorPurchase(action.payload)),
            map(distributorPurchase => {
                return new AllDistributorPurchaseLoaded({ distributorPurchase });
            })
        );

        @Effect()
    loadDistributorPurchase$ = this.actions$
        .pipe(
            ofType<LOAD_DISTRIBUTOR_PURCHASE>(DistributorPurchaseActionTypes.LOAD_DISTRIBUTOR_PURCHASE), 
            mergeMap(({ payload }) =>
                this.distributorPurchaseService.findDistributorPurchaseAsPurchase(payload).pipe(
                    map(response => {
                        if (response.status == APP_CONSTANTS.response.SUCCESS) {
                            return new LOAD_DISTRIBUTOR_PURCHASE_SUCCESS(response.data[0].purchase);
                        } else {
                            this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                            return new Logout()
                        }
                    }
                    ),
                    catchError(err => of(new LOAD_DISTRIBUTOR_PURCHASE_FAIL(err)))
                )
            )
        );

        @Effect()
    loadDistributorPurchaseReturn$ = this.actions$
        .pipe(
            ofType<LOAD_DISTRIBUTOR_PURCHASE_RETURN>(DistributorPurchaseActionTypes.LOAD_DISTRIBUTOR_PURCHASE_RETURN), 
            mergeMap(({ payload }) =>
                this.distributorPurchaseService.findDistributorPurchaseReturnAsPurchaseReturn(payload).pipe(
                    map(response => {
                        if (response.status == APP_CONSTANTS.response.SUCCESS) {
                            return new LOAD_DISTRIBUTOR_PURCHASE_RETURN_SUCCESS(response.data[0]);
                        } else {
                            this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                            return new Logout()
                        }
                    }
                    ),
                    catchError(err => of(new LOAD_DISTRIBUTOR_PURCHASE_RETURN_FAIL(err)))
                )
            )
        );

    @Effect()
    loadDistributorPurchasePage$ = this.actions$
        .pipe(
            ofType<DistributorPurchasePageRequested>(DistributorPurchaseActionTypes.DistributorPurchasePageRequested),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
                const requestToServer = this.distributorPurchaseService.findDistributorPurchase(payload.page, payload.body);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map((response: any) => {
                const result = response[0];
                if (result.status == APP_CONSTANTS.response.SUCCESS) {
                    const lastQuery: QueryParamsModel = response[1];
                    this.store.dispatch(this.hidePageLoadingDistpatcher);
                    return new DistributorPurchasePageLoaded({
                        distributorPurchase: result.data[0].purchase,
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
    deleteDistributorPurchase$ = this.actions$
        .pipe(
            ofType<DistributorPurchaseDeleted>(DistributorPurchaseActionTypes.DistributorPurchaseDeleted),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.distributorPurchaseService.deleteDistributorPurchase(payload.id);
            }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateDistributorPurchase$ = this.actions$
        .pipe(
            ofType<DistributorPurchaseUpdated>(DistributorPurchaseActionTypes.DistributorPurchaseUpdated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.distributorPurchaseService.updateDistributorPurchase(payload.distributorPurchase);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createDistributorPurchase$ = this.actions$
        .pipe(
            ofType<DistributorPurchaseOnServerCreated>(DistributorPurchaseActionTypes.DistributorPurchaseOnServerCreated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.distributorPurchaseService.createDistributorPurchase(payload.distributorPurchase).pipe(
                    tap(res => {
                        this.store.dispatch(new DistributorPurchaseCreated({ distributorPurchase: res }));
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
    //     return of(new AllDistributorPurchaseRequested(httpParams));
    // });

    constructor(private actions$: Actions, private distributorPurchaseService: DistributorPurchaseService, private store: Store<AppState>,
        private authNoticeService: AuthNoticeService,
        private translate: TranslateService, ) { }
}