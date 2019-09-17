import { Order } from './../../order/_models/order.model';
// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// State
import { DistributorposelectState } from '../_reducers/distributorposelect.reducers';
// State
import * as fromOrderSelect from '../_reducers/distributorposelect.reducers';
import { each } from 'lodash';

export const selectDistributorposelectState = createFeatureSelector<DistributorposelectState>('distributorposelect');

export const selectOrderById = (orderId: number) => createSelector(
    selectDistributorposelectState,
    orderState => orderState.entities[orderId]
);

export const selectAllDistributorposelect = createSelector(
    selectDistributorposelectState,
    fromOrderSelect.selectAll
);

export const selectDistributorposelectLoading = createSelector(
    selectDistributorposelectState,
    // (state: DistributorposelectState) => state.distributorposelectLoading
    (state: DistributorposelectState) => state.distributorposelectLoading
);

export const selectDistributorposelectLoaded = createSelector(
    selectDistributorposelectState,
    (state: DistributorposelectState) => state.distributorposelectLoaded
);