// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// State
import { RetailerState } from '../_reducers/retailer.reducers';
import * as fromRetailer from '../_reducers/retailer.reducers';

export const selectRetailerState = createFeatureSelector<RetailerState>('retailer');

export const selectAllRetailer = createSelector(
    selectRetailerState,
    (state: RetailerState) => state.retailer
);

export const selectRetailerLoading = createSelector(
    selectRetailerState,
    (state: RetailerState) => state.retailerLoading
);

export const selectRetailerLoaded = createSelector(
    selectRetailerState,
    (state: RetailerState) => state.retailerLoaded
);