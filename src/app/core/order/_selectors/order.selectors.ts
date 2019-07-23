import { Order } from './../_models/order.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { OrderState } from '../_reducers/order.reducers';
import * as fromOrder from '../_reducers/order.reducers';
import { each } from 'lodash';

export const selectOrderState = createFeatureSelector<OrderState>('order');

export const selectOrderById = (orderId: number) => createSelector(
    selectOrderState,
    orderState => orderState.entities[orderId]
);

export const selectAllOrder = createSelector(
    selectOrderState,
    fromOrder.selectAll
);

export const selectAllOrderIds = createSelector(
    selectOrderState,
    fromOrder.selectIds
);

export const allOrderLoaded = createSelector(
    selectOrderState,
    orderState => orderState.isAllOrderLoaded
);


export const selectOrderPageLoading = createSelector(
    selectOrderState,
    orderState => orderState.listLoading
);

export const selectOrderActionLoading = createSelector(
    selectOrderState,
    orderState => orderState.actionsloading
);

export const selectLastCreatedOrderId = createSelector(
    selectOrderState,
    orderState => orderState.lastCreatedOrderId
);

export const selectOrderShowInitWaitingMessage = createSelector(
    selectOrderState,
    orderState => orderState.showInitWaitingMessage
);


export const selectQueryResult = createSelector(
    selectOrderState,
    orderState => {
        const items: Order[] = [];
        each(orderState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: Order[] = httpExtension.sortArray(items, orderState.lastQuery.sortField, orderState.lastQuery.sortOrder);
        return new QueryResultsModel(orderState.queryResult, orderState.queryRowsCount);
    }
);