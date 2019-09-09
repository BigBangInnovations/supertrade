// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// State
import { RetailerPurchaseSchemeListState } from '../_reducers/retailerPurchaseSchemeList.reducers';
// State
import * as fromOrderSelect from '../_reducers/retailerPurchaseSchemeList.reducers';
import { each } from 'lodash';

export const selectRetailerPurchaseSchemeListState = createFeatureSelector<RetailerPurchaseSchemeListState>('retailerPurchaseSchemeList');

// export const selectOrderById = (orderId: number) => createSelector(
//     selectRetailerPurchaseSchemeListState,
//     orderState => orderState.entities[orderId]
// );

export const selectAllRetailerPurchaseSchemeList = createSelector(
    selectRetailerPurchaseSchemeListState,
    fromOrderSelect.selectAll
);

export const selectRetailerPurchaseSchemeListLoading = createSelector(
    selectRetailerPurchaseSchemeListState,
    (state: RetailerPurchaseSchemeListState) => state.retailerPurchaseSchemeListLoading
);

export const selectRetailerPurchaseSchemeListLoaded = createSelector(
    selectRetailerPurchaseSchemeListState,
    (state: RetailerPurchaseSchemeListState) => state.retailerPurchaseSchemeListLoaded
);