import { Order } from './../../order/_models/order.model';
// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// State
import { DistributorPurchaseSchemeListState } from '../_reducers/distributorPurchaseSchemeList.reducers';
// State
import * as fromOrderSelect from '../_reducers/distributorPurchaseSchemeList.reducers';
import { each } from 'lodash';

export const selectDistributorPurchaseSchemeListState = createFeatureSelector<DistributorPurchaseSchemeListState>('distributorPurchaseSchemeList');

// export const selectOrderById = (orderId: number) => createSelector(
//     selectDistributorPurchaseSchemeListState,
//     orderState => orderState.entities[orderId]
// );

export const selectAllDistributorPurchaseSchemeList = createSelector(
    selectDistributorPurchaseSchemeListState,
    fromOrderSelect.selectAll
);

export const selectDistributorPurchaseSchemeListLoading = createSelector(
    selectDistributorPurchaseSchemeListState,
    (state: DistributorPurchaseSchemeListState) => state.distributorPurchaseSchemeListLoading
);

export const selectDistributorPurchaseSchemeListLoaded = createSelector(
    selectDistributorPurchaseSchemeListState,
    (state: DistributorPurchaseSchemeListState) => state.distributorPurchaseSchemeListLoaded
);