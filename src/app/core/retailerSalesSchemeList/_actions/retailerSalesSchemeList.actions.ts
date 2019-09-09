// NGRX
import { Action } from '@ngrx/store';


export enum RetailerSalesSchemeListActionTypes {
    LOAD_RETAILERSALESCHEMELIST = '[RetailerSalesSchemeListHome] All RetailerSalesSchemeList Requested',
    LOAD_RETAILERSALESCHEMELIST_SUCCESS = '[RetailerSalesSchemeList API] All RetailerSalesSchemeList Loaded successfully',
    LOAD_RETAILERSALESCHEMELIST_FAIL = '[RetailerSalesSchemeList API] All RetailerSalesSchemeList Load Error',
    LOAD_RETAILERSALESCHEMELIST_ACTION_TOGGLE_LOADING = '[RetailerSalesSchemeList API] All RetailerSalesSchemeList Load Togg',
}

export class LoadRetailerSalesSchemeList implements Action {
    readonly type = RetailerSalesSchemeListActionTypes.LOAD_RETAILERSALESCHEMELIST;
    constructor(public payload) { }
}

export class LoadRetailerSalesSchemeListSuccess implements Action {
    readonly type = RetailerSalesSchemeListActionTypes.LOAD_RETAILERSALESCHEMELIST_SUCCESS;
    constructor(public payload) { }
    // constructor(public payload: { retailerSalesSchemeList: RetailerSalesSchemeList[] }) {}
}

export class LoadRetailerSalesSchemeListFail implements Action {
    readonly type = RetailerSalesSchemeListActionTypes.LOAD_RETAILERSALESCHEMELIST_FAIL;
    constructor(public payload: string) {}
}
export class LoadRetailerSalesSchemeListActionToggleLoading implements Action {
    readonly type = RetailerSalesSchemeListActionTypes.LOAD_RETAILERSALESCHEMELIST_ACTION_TOGGLE_LOADING;
    constructor(public payload: { isLoading: boolean }) { }
}

export type RetailerSalesSchemeListActions = LoadRetailerSalesSchemeList
| LoadRetailerSalesSchemeListSuccess
| LoadRetailerSalesSchemeListFail
| LoadRetailerSalesSchemeListActionToggleLoading;
