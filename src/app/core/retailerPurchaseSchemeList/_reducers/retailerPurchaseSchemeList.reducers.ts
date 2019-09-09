// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { RetailerPurchaseSchemeListActions, RetailerPurchaseSchemeListActionTypes } from '../_actions/retailerPurchaseSchemeList.actions';
// Models
import { Scheme } from '../_models/scheme.model';

export interface RetailerPurchaseSchemeListState extends EntityState<Scheme> {
    retailerPurchaseSchemeList: [],
    retailerPurchaseSchemeListLoading: boolean;
    retailerPurchaseSchemeListLoaded: boolean;
}

export const adapter: EntityAdapter<Scheme> = createEntityAdapter<Scheme>({
    selectId: (Scheme: Scheme) => Scheme.id,
});

export const initialRetailerPurchaseSchemeListState: RetailerPurchaseSchemeListState = adapter.getInitialState({
    retailerPurchaseSchemeList: [],
    retailerPurchaseSchemeListLoading: false,
    retailerPurchaseSchemeListLoaded: false,
});

export function retailerPurchaseSchemeListReducer(state = initialRetailerPurchaseSchemeListState, action: RetailerPurchaseSchemeListActions): RetailerPurchaseSchemeListState {
    switch (action.type) {
        case RetailerPurchaseSchemeListActionTypes.LOAD_RETAILERPURCHASECHEMELIST_SUCCESS:
            // return {
            //     ...initialRetailerPurchaseSchemeListState,
            //     retailerPurchaseSchemeListLoading: false,
            //     retailerPurchaseSchemeListLoaded: true,
            //     retailerPurchaseSchemeList: action.payload
            // }
            return adapter.addAll(
                action.payload, {
                    ...initialRetailerPurchaseSchemeListState,
                    retailerPurchaseSchemeListLoading: false,
                    retailerPurchaseSchemeListLoaded: true,
                });
        case RetailerPurchaseSchemeListActionTypes.LOAD_RETAILERPURCHASECHEMELIST:
            return {
                ...initialRetailerPurchaseSchemeListState,
                retailerPurchaseSchemeListLoading: true,
                retailerPurchaseSchemeListLoaded: false,
                retailerPurchaseSchemeList: []
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