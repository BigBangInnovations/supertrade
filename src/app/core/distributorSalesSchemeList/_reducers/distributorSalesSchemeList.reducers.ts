// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { DistributorSalesSchemeListActions, DistributorSalesSchemeListActionTypes } from '../_actions/distributorSalesSchemeList.actions';
// Models
import { Scheme } from '../_models/scheme.model';

export interface DistributorSalesSchemeListState extends EntityState<Scheme> {
    distributorSalesSchemeList: [],
    distributorSalesSchemeListLoading: boolean;
    distributorSalesSchemeListLoaded: boolean;
}

export const adapter: EntityAdapter<Scheme> = createEntityAdapter<Scheme>({
    selectId: (Scheme: Scheme) => Scheme.id,
});

export const initialDistributorSalesSchemeListState: DistributorSalesSchemeListState = adapter.getInitialState({
    distributorSalesSchemeList: [],
    distributorSalesSchemeListLoading: false,
    distributorSalesSchemeListLoaded: false,
});

export function distributorSalesSchemeListReducer(state = initialDistributorSalesSchemeListState, action: DistributorSalesSchemeListActions): DistributorSalesSchemeListState {
    switch (action.type) {
        case DistributorSalesSchemeListActionTypes.LOAD_DISTRIBUTORSALESCHEMELIST_SUCCESS:
            // return {
            //     ...initialDistributorSalesSchemeListState,
            //     distributorSalesSchemeListLoading: false,
            //     distributorSalesSchemeListLoaded: true,
            //     distributorSalesSchemeList: action.payload
            // }
            return adapter.addAll(
                action.payload, {
                    ...initialDistributorSalesSchemeListState,
                    distributorSalesSchemeListLoading: false,
                    distributorSalesSchemeListLoaded: true,
                });
        case DistributorSalesSchemeListActionTypes.LOAD_DISTRIBUTORSALESCHEMELIST:
            return {
                ...initialDistributorSalesSchemeListState,
                distributorSalesSchemeListLoading: true,
                distributorSalesSchemeListLoaded: false,
                distributorSalesSchemeList: []
            }
        default: return state;
    }
} 
export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();