// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { RetailerActions, RetailerActionTypes } from '../_actions/retailer.actions';
// Models
import { Retailer } from '../_models/retailer.model';

export interface RetailerState {
    retailer:[],
    retailerLoading: boolean;
    retailerLoaded: boolean;
}


export const initialRetailerState: RetailerState = {
    retailer:[],
    retailerLoading: false,
    retailerLoaded: false,
};

export function retailerReducer(state = initialRetailerState, action: RetailerActions): RetailerState {
    switch (action.type) {
        case RetailerActionTypes.LOAD_RETAILER_SUCCESS: 
        return {
            ...initialRetailerState,
            retailerLoading: false,
            retailerLoaded: true,
            retailer: action.payload
        }
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