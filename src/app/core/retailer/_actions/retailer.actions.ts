// NGRX
import { Action } from '@ngrx/store';

// Models
import { Retailer } from '../_models/retailer.model';

export enum RetailerActionTypes {
    LOAD_RETAILER = '[RetailerHome] All Retailer Requested',
    LOAD_RETAILER_SUCCESS = '[Retailer API] All Retailer Loaded successfully',
    LOAD_RETAILER_FAIL = '[Retailer API] All Retailer Load Error',
    LOAD_RETAILER_ACTION_TOGGLE_LOADING = '[Retailer API] All Retailer Load Togg',
}

export class LoadRetailer implements Action {
    readonly type = RetailerActionTypes.LOAD_RETAILER;
    constructor(public payload) { }
}

export class LoadRetailerSuccess implements Action {
    readonly type = RetailerActionTypes.LOAD_RETAILER_SUCCESS;
    constructor(public payload) { }
    // constructor(public payload: { retailer: Retailer[] }) {}
}

export class LoadRetailerFail implements Action {
    readonly type = RetailerActionTypes.LOAD_RETAILER_FAIL;
    constructor(public payload: string) {}
}
export class LoadRetailerActionToggleLoading implements Action {
    readonly type = RetailerActionTypes.LOAD_RETAILER_ACTION_TOGGLE_LOADING;
    constructor(public payload: { isLoading: boolean }) { }
}

export type RetailerActions = LoadRetailer
| LoadRetailerSuccess
| LoadRetailerFail
| LoadRetailerActionToggleLoading;
