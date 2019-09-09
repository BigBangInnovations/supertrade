import { Order } from './../../order/_models/order.model';
// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// State
import { DistributorSalesSchemeListState } from '../_reducers/distributorSalesSchemeList.reducers';
// State
import * as fromOrderSelect from '../_reducers/distributorSalesSchemeList.reducers';
import { each } from 'lodash';

export const selectDistributorSalesSchemeListState = createFeatureSelector<DistributorSalesSchemeListState>('distributorSalesSchemeList');

// export const selectOrderById = (orderId: number) => createSelector(
//     selectDistributorSalesSchemeListState,
//     orderState => orderState.entities[orderId]
// );

export const selectAllDistributorSalesSchemeList = createSelector(
    selectDistributorSalesSchemeListState,
    fromOrderSelect.selectAll
);

export const selectDistributorSalesSchemeListLoading = createSelector(
    selectDistributorSalesSchemeListState,
    (state: DistributorSalesSchemeListState) => state.distributorSalesSchemeListLoading
);

export const selectDistributorSalesSchemeListLoaded = createSelector(
    selectDistributorSalesSchemeListState,
    (state: DistributorSalesSchemeListState) => state.distributorSalesSchemeListLoaded
);