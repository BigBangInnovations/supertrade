// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { MetadataActions, MetadataActionTypes } from '../_actions/metadata.actions';

export interface MetadataState {
    godowns:[],
    paymentModes:[],
    freightTerms:[],
    metadataLoading: boolean;
    metadataLoaded: boolean;
}


export const initialMetadataState: MetadataState = {
    godowns:[],
    paymentModes:[],
    freightTerms:[],
    metadataLoading: false,
    metadataLoaded: false,
};

export function metadataReducer(state = initialMetadataState, action: MetadataActions): MetadataState {
    switch (action.type) {
        case MetadataActionTypes.LOAD_METADATA_SUCCESS: 
        return {
            ...initialMetadataState,
            metadataLoading: false,
            metadataLoaded: true,
            godowns: action.payload.godowns,
            paymentModes: action.payload.paymentModes,
            freightTerms: action.payload.freightTerms,
        }
        case MetadataActionTypes.LOAD_METADATA: 
        return {
            ...initialMetadataState,
            metadataLoading: false,
            metadataLoaded: false,
            godowns: [],
            paymentModes: [],
            freightTerms: [],
        }
        default: return state;
    }
} 