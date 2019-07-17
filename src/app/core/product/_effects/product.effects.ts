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
import { ProductService } from '../_services';
// State
import { AppState } from '../../../core/reducers';
// Actions
import * as fromProductAction from '../_actions/product.actions';
import { Product } from '../_models/product.model'
import { APP_CONSTANTS } from '../../../../config/default/constants'

@Injectable()
export class ProductEffects {
    showPageLoadingDistpatcher = new fromProductAction.LoadProductsActionToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new fromProductAction.LoadProductsActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllProducts$ = this.actions$
        .pipe(
            ofType<fromProductAction.LoadProducts>(fromProductAction.ProductActionTypes.LOAD_PRODUCT),
            // withLatestFrom(this.store.pipe(select(allSalesLoaded))),
            // filter(([action, isAllSalesLoaded]) => !isAllSalesLoaded),
            mergeMap((action: fromProductAction.LoadProducts) => this.productService.getAllproducts()),
            map((response) => {
                if (response.status == APP_CONSTANTS.response.SUCCESS) {
                    let categoryArray = (response.data[0].category) ? response.data[0].category : [];
                    return new fromProductAction.LoadProductsSuccess(categoryArray);
                }
            })
        );

    constructor(private actions$: Actions, private productService: ProductService, private store: Store<AppState>) { }
}