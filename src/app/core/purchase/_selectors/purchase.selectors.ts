import { Purchase } from './../_models/purchase.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { PurchaseState } from '../_reducers/purchase.reducers';
import * as fromPurchase from '../_reducers/purchase.reducers';
import { each } from 'lodash';
import { UserPointsStatus } from '../../purchase/_models/purchase.model';

export const selectPurchaseState = createFeatureSelector<PurchaseState>('purchase');

export const selectPurchaseById = (purchaseId: number) => createSelector(
    selectPurchaseState,
    purchaseState => purchaseState.entities[purchaseId]
);

export const selectAllPurchase = createSelector(
    selectPurchaseState,
    fromPurchase.selectAll
);

export const selectPurchase = createSelector(
    selectPurchaseState,
    purchaseState => purchaseState.purchase
);

export const selectLoading = createSelector(
    selectPurchaseState,
    purchaseState => purchaseState.loading
);

export const selectPurchaseError = createSelector(
    selectPurchaseState,
    purchaseState => purchaseState.error
);

export const selectAllPurchaseIds = createSelector(
    selectPurchaseState,
    fromPurchase.selectIds
);

export const allPurchaseLoaded = createSelector(
    selectPurchaseState,
    purchaseState => purchaseState.isAllPurchaseLoaded
);


export const selectPurchasePageLoading = createSelector(
    selectPurchaseState,
    purchaseState => purchaseState.listLoading
);

export const selectPurchaseActionLoading = createSelector(
    selectPurchaseState,
    purchaseState => purchaseState.actionsloading
);

export const selectLastCreatedPurchaseId = createSelector(
    selectPurchaseState,
    purchaseState => purchaseState.lastCreatedPurchaseId
);

export const selectPurchaseShowInitWaitingMessage = createSelector(
    selectPurchaseState,
    purchaseState => purchaseState.showInitWaitingMessage
);


export const selectQueryResult = createSelector(
    selectPurchaseState,
    purchaseState => {
        const items: Purchase[] = [];
        each(purchaseState.entities, element => {
            items.push(element);
        });
        let userPoints = purchaseState.userPoints;
        const httpExtension = new HttpExtenstionsModel();
        const result: Purchase[] = httpExtension.sortArray(items, purchaseState.lastQuery.sortField, purchaseState.lastQuery.sortOrder);
        return new QueryResultsModel(purchaseState.queryResult, purchaseState.queryRowsCount, '', userPoints);
    }
);