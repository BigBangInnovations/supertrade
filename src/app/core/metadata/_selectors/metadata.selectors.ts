// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// State
import { MetadataState } from '../_reducers/metadata.reducers';

export const selectMetadataState = createFeatureSelector<MetadataState>('metadata');

export const selectAllMetadataGodowns = createSelector(
    selectMetadataState,
    (state: MetadataState) => state.godowns
);

export const selectAllMetadataPaymentModes = createSelector(
    selectMetadataState,
    (state: MetadataState) => state.paymentModes
);

export const selectAllMetadataFreightTerms = createSelector(
    selectMetadataState,
    (state: MetadataState) => state.freightTerms
);

export const selectMetadataLoading = createSelector(
    selectMetadataState,
    (state: MetadataState) => state.metadataLoading
);

export const selectMetadataLoaded = createSelector(
    selectMetadataState,
    (state: MetadataState) => state.metadataLoaded
);