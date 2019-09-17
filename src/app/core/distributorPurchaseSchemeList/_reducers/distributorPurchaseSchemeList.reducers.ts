// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { DistributorPurchaseSchemeListActions, DistributorPurchaseSchemeListActionTypes } from '../_actions/distributorPurchaseSchemeList.actions';
// Models
import { Scheme } from '../_models/scheme.model';

export interface DistributorPurchaseSchemeListState extends EntityState<Scheme> {
    distributorPurchaseSchemeList: [],
    distributorPurchaseSchemeListLoading: boolean;
    distributorPurchaseSchemeListLoaded: boolean;
}

export const adapter: EntityAdapter<Scheme> = createEntityAdapter<Scheme>({
    selectId: (Scheme: Scheme) => Scheme.id,
});

export const initialDistributorPurchaseSchemeListState: DistributorPurchaseSchemeListState = adapter.getInitialState({
    distributorPurchaseSchemeList: [],
    distributorPurchaseSchemeListLoading: false,
    distributorPurchaseSchemeListLoaded: false,
});

export function distributorPurchaseSchemeListReducer(state = initialDistributorPurchaseSchemeListState, action: DistributorPurchaseSchemeListActions): DistributorPurchaseSchemeListState {
    switch (action.type) {
        case DistributorPurchaseSchemeListActionTypes.LOAD_DISTRIBUTORPURCHASECHEMELIST_SUCCESS:
            // return {
            //     ...initialDistributorPurchaseSchemeListState,
            //     distributorPurchaseSchemeListLoading: false,
            //     distributorPurchaseSchemeListLoaded: true,
            //     distributorPurchaseSchemeList: action.payload
            // }
            return adapter.addAll(
                action.payload, {
                    ...initialDistributorPurchaseSchemeListState,
                    distributorPurchaseSchemeListLoading: false,
                    distributorPurchaseSchemeListLoaded: true,
                });
        case DistributorPurchaseSchemeListActionTypes.LOAD_DISTRIBUTORPURCHASECHEMELIST:
            return {
                ...initialDistributorPurchaseSchemeListState,
                distributorPurchaseSchemeListLoading: true,
                distributorPurchaseSchemeListLoaded: false,
                distributorPurchaseSchemeList: []
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