import { DistributorPurchase } from './../_models/distributorPurchase.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { DistributorPurchaseState } from '../_reducers/distributorPurchase.reducers';
import * as fromDistributorPurchase from '../_reducers/distributorPurchase.reducers';
import { each } from 'lodash';
import { UserPointsStatus } from '../../distributorPurchase/_models/distributorPurchase.model';

export const selectDistributorPurchaseState = createFeatureSelector<DistributorPurchaseState>('distributorPurchase');

export const selectDistributorPurchaseById = (distributorPurchaseId: number) => createSelector( 
    selectDistributorPurchaseState,
    distributorPurchaseState => distributorPurchaseState.entities[distributorPurchaseId]
);

export const selectDistributorPurchase = createSelector(
    selectDistributorPurchaseState,
    distributorPurchaseState => distributorPurchaseState.distributorPurchase
);

export const selectLoading = createSelector(
    selectDistributorPurchaseState,
    distributorPurchaseState => distributorPurchaseState.loading
);

export const selectDistributorPurchaseError = createSelector(
    selectDistributorPurchaseState,
    distributorPurchaseState => distributorPurchaseState.error
);

export const selectAllDistributorPurchase = createSelector(
    selectDistributorPurchaseState,
    fromDistributorPurchase.selectAll
);

export const selectAllDistributorPurchaseIds = createSelector(
    selectDistributorPurchaseState,
    fromDistributorPurchase.selectIds
);

export const allDistributorPurchaseLoaded = createSelector(
    selectDistributorPurchaseState,
    distributorPurchaseState => distributorPurchaseState.isAllDistributorPurchaseLoaded
);


export const selectDistributorPurchasePageLoading = createSelector(
    selectDistributorPurchaseState,
    distributorPurchaseState => distributorPurchaseState.listLoading
);

export const selectDistributorPurchaseActionLoading = createSelector(
    selectDistributorPurchaseState,
    distributorPurchaseState => distributorPurchaseState.actionsloading
);

export const selectLastCreatedDistributorPurchaseId = createSelector(
    selectDistributorPurchaseState,
    distributorPurchaseState => distributorPurchaseState.lastCreatedDistributorPurchaseId
);

export const selectDistributorPurchaseShowInitWaitingMessage = createSelector(
    selectDistributorPurchaseState,
    distributorPurchaseState => distributorPurchaseState.showInitWaitingMessage
);


export const selectQueryResult = createSelector(
    selectDistributorPurchaseState,
    distributorPurchaseState => {
        const items: DistributorPurchase[] = [];
        each(distributorPurchaseState.entities, element => {
            items.push(element);
        });
        let userPoints = distributorPurchaseState.userPoints;
        const httpExtension = new HttpExtenstionsModel();
        const result: DistributorPurchase[] = httpExtension.sortArray(items, distributorPurchaseState.lastQuery.sortField, distributorPurchaseState.lastQuery.sortOrder);
        return new QueryResultsModel(distributorPurchaseState.queryResult, distributorPurchaseState.queryRowsCount, '', userPoints);
    }
);