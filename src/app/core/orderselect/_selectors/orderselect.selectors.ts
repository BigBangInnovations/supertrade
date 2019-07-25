import { Order } from './../../order/_models/order.model';
// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// State
import { OrderselectState } from '../_reducers/orderselect.reducers';
// State
import * as fromOrderSelect from '../_reducers/orderselect.reducers';
import { each } from 'lodash';

export const selectOrderselectState = createFeatureSelector<OrderselectState>('orderselect');

export const selectOrderById = (orderId: number) => createSelector(
    selectOrderselectState,
    orderState => orderState.entities[orderId]
);

export const selectAllOrderselect = createSelector(
    selectOrderselectState,
    fromOrderSelect.selectAll
);

export const selectOrderselectLoading = createSelector(
    selectOrderselectState,
    (state: OrderselectState) => state.orderselectLoading
);

export const selectOrderselectLoaded = createSelector(
    selectOrderselectState,
    (state: OrderselectState) => state.orderselectLoaded
);