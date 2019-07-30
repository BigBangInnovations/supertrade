import { DistributorSale } from './../_models/distributorSale.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { DistributorSaleState } from '../_reducers/distributorSale.reducers';
import * as fromDistributorSale from '../_reducers/distributorSale.reducers';
import { each } from 'lodash';
import { UserPointsStatus } from '../../distributorSale/_models/distributorSale.model';

export const selectDistributorSaleState = createFeatureSelector<DistributorSaleState>('distributorSale');

export const selectDistributorSaleById = (distributorSaleId: number) => createSelector( 
    selectDistributorSaleState,
    distributorSaleState => distributorSaleState.entities[distributorSaleId]
);

export const selectDistributorSale = createSelector(
    selectDistributorSaleState,
    distributorSaleState => distributorSaleState.distributorSale
);

export const selectLoading = createSelector(
    selectDistributorSaleState,
    distributorSaleState => distributorSaleState.loading
);

export const selectDistributorSaleError = createSelector(
    selectDistributorSaleState,
    distributorSaleState => distributorSaleState.error
);

export const selectAllDistributorSale = createSelector(
    selectDistributorSaleState,
    fromDistributorSale.selectAll
);

export const selectAllDistributorSaleIds = createSelector(
    selectDistributorSaleState,
    fromDistributorSale.selectIds
);

export const allDistributorSaleLoaded = createSelector(
    selectDistributorSaleState,
    distributorSaleState => distributorSaleState.isAllDistributorSaleLoaded
);


export const selectDistributorSalePageLoading = createSelector(
    selectDistributorSaleState,
    distributorSaleState => distributorSaleState.listLoading
);

export const selectDistributorSaleActionLoading = createSelector(
    selectDistributorSaleState,
    distributorSaleState => distributorSaleState.actionsloading
);

export const selectLastCreatedDistributorSaleId = createSelector(
    selectDistributorSaleState,
    distributorSaleState => distributorSaleState.lastCreatedDistributorSaleId
);

export const selectDistributorSaleShowInitWaitingMessage = createSelector(
    selectDistributorSaleState,
    distributorSaleState => distributorSaleState.showInitWaitingMessage
);


export const selectQueryResult = createSelector(
    selectDistributorSaleState,
    distributorSaleState => {
        const items: DistributorSale[] = [];
        each(distributorSaleState.entities, element => {
            items.push(element);
        });
        let userPoints = distributorSaleState.userPoints;
        const httpExtension = new HttpExtenstionsModel();
        const result: DistributorSale[] = httpExtension.sortArray(items, distributorSaleState.lastQuery.sortField, distributorSaleState.lastQuery.sortOrder);
        return new QueryResultsModel(distributorSaleState.queryResult, distributorSaleState.queryRowsCount, '', userPoints);
    }
);