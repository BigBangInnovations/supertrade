import { Sale } from './../_models/sale.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { SalesState } from '../_reducers/sale.reducers';
import * as fromSale from '../_reducers/sale.reducers';
import { each } from 'lodash';
import { UserPointsStatus } from '../../purchase/_models/purchase.model';

export const selectSalesState = createFeatureSelector<SalesState>('sales');

export const selectSaleById = (saleId: number) => createSelector(
    selectSalesState,
    salesState => salesState.entities[saleId]
);

export const selectAllSales = createSelector(
    selectSalesState,
    fromSale.selectAll
);

export const selectAllSalesIds = createSelector(
    selectSalesState,
    fromSale.selectIds
);

export const allSalesLoaded = createSelector(
    selectSalesState,
    salesState => salesState.isAllSalesLoaded
);


export const selectSalesPageLoading = createSelector(
    selectSalesState,
    salesState => salesState.listLoading
);

export const selectSalesActionLoading = createSelector(
    selectSalesState,
    salesState => salesState.actionsloading
);

export const selectLastCreatedSaleId = createSelector(
    selectSalesState,
    salesState => salesState.lastCreatedSaleId
);

export const selectSalesShowInitWaitingMessage = createSelector(
    selectSalesState,
    salesState => salesState.showInitWaitingMessage
);


export const selectQueryResult = createSelector(
    selectSalesState,
    salesState => {
        const items: Sale[] = [];
        each(salesState.entities, element => {
            items.push(element);
        });
        let userPoints = salesState.userPoints;
        const httpExtension = new HttpExtenstionsModel();
        const result: Sale[] = httpExtension.sortArray(items, salesState.lastQuery.sortField, salesState.lastQuery.sortOrder);
        return new QueryResultsModel(salesState.queryResult, salesState.queryRowsCount, '', userPoints);
    }
);