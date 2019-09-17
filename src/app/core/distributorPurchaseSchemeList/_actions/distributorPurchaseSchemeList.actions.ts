// NGRX
import { Action } from '@ngrx/store';


export enum DistributorPurchaseSchemeListActionTypes {
    LOAD_DISTRIBUTORPURCHASECHEMELIST = '[DistributorPurchaseSchemeListHome] All DistributorPurchaseSchemeList Requested',
    LOAD_DISTRIBUTORPURCHASECHEMELIST_SUCCESS = '[DistributorPurchaseSchemeList API] All DistributorPurchaseSchemeList Loaded successfully',
    LOAD_DISTRIBUTORPURCHASECHEMELIST_FAIL = '[DistributorPurchaseSchemeList API] All DistributorPurchaseSchemeList Load Error',
    LOAD_DISTRIBUTORPURCHASECHEMELIST_ACTION_TOGGLE_LOADING = '[DistributorPurchaseSchemeList API] All DistributorPurchaseSchemeList Load Togg',
}

export class LoadDistributorPurchaseSchemeList implements Action {
    readonly type = DistributorPurchaseSchemeListActionTypes.LOAD_DISTRIBUTORPURCHASECHEMELIST;
    constructor(public payload) { }
}

export class LoadDistributorPurchaseSchemeListSuccess implements Action {
    readonly type = DistributorPurchaseSchemeListActionTypes.LOAD_DISTRIBUTORPURCHASECHEMELIST_SUCCESS;
    constructor(public payload) { }
    // constructor(public payload: { distributorPurchaseSchemeList: DistributorPurchaseSchemeList[] }) {}
}

export class LoadDistributorPurchaseSchemeListFail implements Action {
    readonly type = DistributorPurchaseSchemeListActionTypes.LOAD_DISTRIBUTORPURCHASECHEMELIST_FAIL;
    constructor(public payload: string) {}
}
export class LoadDistributorPurchaseSchemeListActionToggleLoading implements Action {
    readonly type = DistributorPurchaseSchemeListActionTypes.LOAD_DISTRIBUTORPURCHASECHEMELIST_ACTION_TOGGLE_LOADING;
    constructor(public payload: { isLoading: boolean }) { }
}

export type DistributorPurchaseSchemeListActions = LoadDistributorPurchaseSchemeList
| LoadDistributorPurchaseSchemeListSuccess
| LoadDistributorPurchaseSchemeListFail
| LoadDistributorPurchaseSchemeListActionToggleLoading;
