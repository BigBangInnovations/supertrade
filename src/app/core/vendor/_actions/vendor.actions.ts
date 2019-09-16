// NGRX
import { Action } from '@ngrx/store';

// Models
import { Vendor } from '../_models/vendor.model';

export enum VendorActionTypes {
    LOAD_VENDOR = '[VendorHome] All Vendor Requested',
    LOAD_VENDOR_SUCCESS = '[Vendor API] All Vendor Loaded successfully',
    LOAD_VENDOR_FAIL = '[Vendor API] All Vendor Load Error',
    LOAD_VENDOR_ACTION_TOGGLE_LOADING = '[Vendor API] All Vendor Load Togg',
}

export class LoadVendor implements Action {
    readonly type = VendorActionTypes.LOAD_VENDOR;
    constructor(public payload) { }
}

export class LoadVendorSuccess implements Action {
    readonly type = VendorActionTypes.LOAD_VENDOR_SUCCESS;
    constructor(public payload) { }
    // constructor(public payload: { vendor: Vendor[] }) {}
}

export class LoadVendorFail implements Action {
    readonly type = VendorActionTypes.LOAD_VENDOR_FAIL;
    constructor(public payload: string) {}
}
export class LoadVendorActionToggleLoading implements Action {
    readonly type = VendorActionTypes.LOAD_VENDOR_ACTION_TOGGLE_LOADING;
    constructor(public payload: { isLoading: boolean }) { }
}

export type VendorActions = LoadVendor
| LoadVendorSuccess
| LoadVendorFail
| LoadVendorActionToggleLoading;
