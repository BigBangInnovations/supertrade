// NGRX
import { Action } from '@ngrx/store';


export enum RetailerPurchaseSchemeListActionTypes {
    LOAD_RETAILERPURCHASECHEMELIST = '[RetailerPurchaseSchemeListHome] All RetailerPurchaseSchemeList Requested',
    LOAD_RETAILERPURCHASECHEMELIST_SUCCESS = '[RetailerPurchaseSchemeList API] All RetailerPurchaseSchemeList Loaded successfully',
    LOAD_RETAILERPURCHASECHEMELIST_FAIL = '[RetailerPurchaseSchemeList API] All RetailerPurchaseSchemeList Load Error',
    LOAD_RETAILERPURCHASECHEMELIST_ACTION_TOGGLE_LOADING = '[RetailerPurchaseSchemeList API] All RetailerPurchaseSchemeList Load Togg',
}

export class LoadRetailerPurchaseSchemeList implements Action {
    readonly type = RetailerPurchaseSchemeListActionTypes.LOAD_RETAILERPURCHASECHEMELIST;
    constructor(public payload) { }
}

export class LoadRetailerPurchaseSchemeListSuccess implements Action {
    readonly type = RetailerPurchaseSchemeListActionTypes.LOAD_RETAILERPURCHASECHEMELIST_SUCCESS;
    constructor(public payload) { }
    // constructor(public payload: { retailerPurchaseSchemeList: RetailerPurchaseSchemeList[] }) {}
}

export class LoadRetailerPurchaseSchemeListFail implements Action {
    readonly type = RetailerPurchaseSchemeListActionTypes.LOAD_RETAILERPURCHASECHEMELIST_FAIL;
    constructor(public payload: string) {}
}
export class LoadRetailerPurchaseSchemeListActionToggleLoading implements Action {
    readonly type = RetailerPurchaseSchemeListActionTypes.LOAD_RETAILERPURCHASECHEMELIST_ACTION_TOGGLE_LOADING;
    constructor(public payload: { isLoading: boolean }) { }
}

export type RetailerPurchaseSchemeListActions = LoadRetailerPurchaseSchemeList
| LoadRetailerPurchaseSchemeListSuccess
| LoadRetailerPurchaseSchemeListFail
| LoadRetailerPurchaseSchemeListActionToggleLoading;
