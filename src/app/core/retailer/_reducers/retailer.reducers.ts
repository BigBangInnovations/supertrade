// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { RetailerActions, RetailerActionTypes } from '../_actions/retailer.actions';
// Models
import { Retailer } from '../_models/retailer.model';

export interface RetailerState extends EntityState<Retailer> {
    retailer: [],
    retailerLoading: boolean;
    retailerLoaded: boolean;
}

export const adapter: EntityAdapter<Retailer> = createEntityAdapter<Retailer>({
    selectId: (Retailer: Retailer) => Retailer.ID,
});

export const initialRetailerState: RetailerState = adapter.getInitialState({
    retailer: [],
    retailerLoading: false,
    retailerLoaded: false,
});

export function retailerReducer(state = initialRetailerState, action: RetailerActions): RetailerState {
    switch (action.type) {
        case RetailerActionTypes.LOAD_RETAILER_SUCCESS:
            return adapter.addAll(action.payload, {
                ...initialRetailerState,
                retailerLoading: false,
                retailerLoaded: true,
            });
        case RetailerActionTypes.LOAD_RETAILER:
            return {
                ...initialRetailerState,
                retailerLoading: true,
                retailerLoaded: false,
                retailer: []
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