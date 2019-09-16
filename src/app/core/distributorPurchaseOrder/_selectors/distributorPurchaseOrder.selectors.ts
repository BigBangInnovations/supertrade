import { DistributorPurchaseOrder } from './../_models/distributorPurchaseOrder.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { DistributorPurchaseOrderState } from '../_reducers/distributorPurchaseOrder.reducers';
import * as fromDistributorPurchaseOrder from '../_reducers/distributorPurchaseOrder.reducers';
import { each } from 'lodash';

export const selectDistributorPurchaseOrderState = createFeatureSelector<DistributorPurchaseOrderState>('distributorPurchaseOrder');

export const selectDistributorPurchaseOrderById = (distributorPurchaseOrderId: number) => createSelector(
    selectDistributorPurchaseOrderState,
    distributorPurchaseOrderState => distributorPurchaseOrderState.entities[distributorPurchaseOrderId]
);

export const selectAllDistributorPurchaseOrder = createSelector(
    selectDistributorPurchaseOrderState,
    fromDistributorPurchaseOrder.selectAll
);

export const selectDistributorPurchaseOrder = createSelector(
    selectDistributorPurchaseOrderState,
    distributorPurchaseOrderState => distributorPurchaseOrderState.distributorPurchaseOrder
);

export const selectLoading = createSelector(
    selectDistributorPurchaseOrderState,
    distributorPurchaseOrderState => distributorPurchaseOrderState.loading
);

export const selectDistributorPurchaseOrderError = createSelector(
    selectDistributorPurchaseOrderState,
    distributorPurchaseOrderState => distributorPurchaseOrderState.error
);

export const selectAllDistributorPurchaseOrderIds = createSelector(
    selectDistributorPurchaseOrderState,
    fromDistributorPurchaseOrder.selectIds
);

export const allDistributorPurchaseOrderLoaded = createSelector(
    selectDistributorPurchaseOrderState,
    distributorPurchaseOrderState => distributorPurchaseOrderState.isAllDistributorPurchaseOrderLoaded
);


export const selectDistributorPurchaseOrderPageLoading = createSelector(
    selectDistributorPurchaseOrderState,
    distributorPurchaseOrderState => distributorPurchaseOrderState.listLoading
);

export const selectDistributorPurchaseOrderActionLoading = createSelector(
    selectDistributorPurchaseOrderState,
    distributorPurchaseOrderState => distributorPurchaseOrderState.actionsloading
);

export const selectLastCreatedDistributorPurchaseOrderId = createSelector(
    selectDistributorPurchaseOrderState,
    distributorPurchaseOrderState => distributorPurchaseOrderState.lastCreatedDistributorPurchaseOrderId
);

export const selectDistributorPurchaseOrderShowInitWaitingMessage = createSelector(
    selectDistributorPurchaseOrderState,
    distributorPurchaseOrderState => distributorPurchaseOrderState.showInitWaitingMessage
);


export const selectQueryResult = createSelector(
    selectDistributorPurchaseOrderState,
    distributorPurchaseOrderState => {
        const items: DistributorPurchaseOrder[] = [];
        each(distributorPurchaseOrderState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: DistributorPurchaseOrder[] = httpExtension.sortArray(items, distributorPurchaseOrderState.lastQuery.sortField, distributorPurchaseOrderState.lastQuery.sortOrder);
        return new QueryResultsModel(distributorPurchaseOrderState.queryResult, distributorPurchaseOrderState.queryRowsCount);
    }
); 