// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// State
import { VendorState } from '../_reducers/vendor.reducers';
import * as fromVendor from '../_reducers/vendor.reducers';

export const selectVendorState = createFeatureSelector<VendorState>('vendor');

export const selectVendorById = (vendorId: number) => createSelector(
    selectVendorState,
    VendorState => VendorState.entities[vendorId]
);

export const selectAllVendor = createSelector(
    selectVendorState,
    fromVendor.selectAll
);

export const selectVendorLoading = createSelector(
    selectVendorState,
    (state: VendorState) => state.vendorLoading
);

export const selectVendorLoaded = createSelector(
    selectVendorState,
    (state: VendorState) => state.vendorLoaded
);