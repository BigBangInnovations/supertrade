// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { VendorActions, VendorActionTypes } from '../_actions/vendor.actions';
// Models
import { Vendor } from '../_models/vendor.model';

export interface VendorState extends EntityState<Vendor> {
    vendor: [],
    vendorLoading: boolean;
    vendorLoaded: boolean;
}

export const adapter: EntityAdapter<Vendor> = createEntityAdapter<Vendor>({
    selectId: (Vendor: Vendor) => Vendor.ID,
});

export const initialVendorState: VendorState = adapter.getInitialState({
    vendor: [],
    vendorLoading: false,
    vendorLoaded: false,
});

export function vendorReducer(state = initialVendorState, action: VendorActions): VendorState {
    switch (action.type) {
        case VendorActionTypes.LOAD_VENDOR_SUCCESS:
            return adapter.addAll(action.payload, {
                ...initialVendorState,
                vendorLoading: false,
                vendorLoaded: true,
            });
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
export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();