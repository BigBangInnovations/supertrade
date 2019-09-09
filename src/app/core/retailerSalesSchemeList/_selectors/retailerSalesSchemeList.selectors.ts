// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// State
import { RetailerSalesSchemeListState } from '../_reducers/retailerSalesSchemeList.reducers';
// State
import * as fromOrderSelect from '../_reducers/retailerSalesSchemeList.reducers';
import { each } from 'lodash';

export const selectRetailerSalesSchemeListState = createFeatureSelector<RetailerSalesSchemeListState>('retailerSalesSchemeList');

// export const selectOrderById = (orderId: number) => createSelector(
//     selectRetailerSalesSchemeListState,
//     orderState => orderState.entities[orderId]
// );

export const selectAllRetailerSalesSchemeList = createSelector(
    selectRetailerSalesSchemeListState,
    fromOrderSelect.selectAll
);

export const selectRetailerSalesSchemeListLoading = createSelector(
    selectRetailerSalesSchemeListState,
    (state: RetailerSalesSchemeListState) => state.retailerSalesSchemeListLoading
);

export const selectRetailerSalesSchemeListLoaded = createSelector(
    selectRetailerSalesSchemeListState,
    (state: RetailerSalesSchemeListState) => state.retailerSalesSchemeListLoaded
);