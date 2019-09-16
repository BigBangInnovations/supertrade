// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { VendorActions, VendorActionTypes } from '../_actions/vendor.actions';
// Models
import { Vendor } from '../_models/vendor.model';

export interface VendorState {
    vendor:[],
    vendorLoading: boolean;
    vendorLoaded: boolean;
}


export const initialVendorState: VendorState = {
    vendor:[],
    vendorLoading: false,
    vendorLoaded: false,
};

export function vendorReducer(state = initialVendorState, action: VendorActions): VendorState {
    switch (action.type) {
        case VendorActionTypes.LOAD_VENDOR_SUCCESS: 
        return {
            ...initialVendorState,
            vendorLoading: false,
            vendorLoaded: true,
            vendor: action.payload
        }
        case VendorActionTypes.LOAD_VENDOR: 
        return {
            ...initialVendorState,
            vendorLoading: true,
            vendorLoaded: false,
            vendor: []
        }
        default: return state;
    }
} 