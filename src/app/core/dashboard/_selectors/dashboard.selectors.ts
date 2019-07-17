// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';

// State
import { dashboardPurchasesState, adapter } from '../_reducers/dashboard.reducers';
import { each } from 'lodash';
import { Purchase } from '../../purchase/_models/purchase.model';


export const selectPurchasesState = createFeatureSelector<dashboardPurchasesState>('dashboardPurchases');

export const getDashboardPurchases = createSelector(
  selectPurchasesState,
  adapter.getSelectors().selectAll
);

export const getDashboardPurchasesUsePoints = createSelector(
  selectPurchasesState,
  (state: dashboardPurchasesState) => state.userPurchasePointsStatus
);
  
  export const getDashboardPurchasesLoading = createSelector(
    selectPurchasesState,
    (state: dashboardPurchasesState) => state.loading
  );
  
  export const getDashboardPurchasesLoaded = createSelector(
    selectPurchasesState,
    (state: dashboardPurchasesState) => state.loaded
  );
  export const getError = createSelector(
    selectPurchasesState,
    (state: dashboardPurchasesState) => state.error
  );