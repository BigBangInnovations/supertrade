// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { DistributorActions, DistributorActionTypes } from '../_actions/distributor.actions';
// Models
import { Distributor } from '../_models/distributor.model';

export interface DistributorState {
    distributor:[],
    distributorLoading: boolean;
    distributorLoaded: boolean;
}


export const initialDistributorState: DistributorState = {
    distributor:[],
    distributorLoading: false,
    distributorLoaded: false,
};

export function distributorReducer(state = initialDistributorState, action: DistributorActions): DistributorState {
    switch (action.type) {
        case DistributorActionTypes.LOAD_DISTRIBUTOR_SUCCESS: 
        return {
            ...initialDistributorState,
            distributorLoading: false,
            distributorLoaded: true,
            distributor: action.payload
        }
        case DistributorActionTypes.LOAD_DISTRIBUTOR: 
        return {
            ...initialDistributorState,
            distributorLoading: true,
            distributorLoaded: false,
            distributor: []
        }
        default: return state;
    }
} 