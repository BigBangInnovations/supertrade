// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// State
import { VendorState } from '../_reducers/vendor.reducers';
import * as fromVendor from '../_reducers/vendor.reducers';

export const selectVendorState = createFeatureSelector<VendorState>('vendor');

export const selectAllVendor = createSelector(
    selectVendorState,
    (state: VendorState) => state.vendor
);

export const selectVendorLoading = createSelector(
    selectVendorState,
    (state: VendorState) => state.vendorLoading
);

export const selectVendorLoaded = createSelector(
    selectVendorState,
    (state: VendorState) => state.vendorLoaded
);