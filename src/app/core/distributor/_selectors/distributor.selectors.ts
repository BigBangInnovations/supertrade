// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// State
import { DistributorState } from '../_reducers/distributor.reducers';
import * as fromDistributor from '../_reducers/distributor.reducers';

export const selectDistributorState = createFeatureSelector<DistributorState>('distributor');

export const selectAllDistributor = createSelector(
    selectDistributorState,
    (state: DistributorState) => state.distributor
);

export const selectDistributorLoading = createSelector(
    selectDistributorState,
    (state: DistributorState) => state.distributorLoading
);

export const selectDistributorLoaded = createSelector(
    selectDistributorState,
    (state: DistributorState) => state.distributorLoaded
);