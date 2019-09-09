// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { RetailerSalesSchemeListActions, RetailerSalesSchemeListActionTypes } from '../_actions/retailerSalesSchemeList.actions';
// Models
import { Scheme } from '../_models/scheme.model';

export interface RetailerSalesSchemeListState extends EntityState<Scheme> {
    retailerSalesSchemeList: [],
    retailerSalesSchemeListLoading: boolean;
    retailerSalesSchemeListLoaded: boolean;
}

export const adapter: EntityAdapter<Scheme> = createEntityAdapter<Scheme>({
    selectId: (Scheme: Scheme) => Scheme.id,
});

export const initialRetailerSalesSchemeListState: RetailerSalesSchemeListState = adapter.getInitialState({
    retailerSalesSchemeList: [],
    retailerSalesSchemeListLoading: false,
    retailerSalesSchemeListLoaded: false,
});

export function retailerSalesSchemeListReducer(state = initialRetailerSalesSchemeListState, action: RetailerSalesSchemeListActions): RetailerSalesSchemeListState {
    switch (action.type) {
        case RetailerSalesSchemeListActionTypes.LOAD_RETAILERSALESCHEMELIST_SUCCESS:
            // return {
            //     ...initialRetailerSalesSchemeListState,
            //     retailerSalesSchemeListLoading: false,
            //     retailerSalesSchemeListLoaded: true,
            //     retailerSalesSchemeList: action.payload
            // }
            return adapter.addAll(
                action.payload, {
                    ...initialRetailerSalesSchemeListState,
                    retailerSalesSchemeListLoading: false,
                    retailerSalesSchemeListLoaded: true,
                });
        case RetailerSalesSchemeListActionTypes.LOAD_RETAILERSALESCHEMELIST:
            return {
                ...initialRetailerSalesSchemeListState,
                retailerSalesSchemeListLoading: true,
                retailerSalesSchemeListLoaded: false,
                retailerSalesSchemeList: []
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