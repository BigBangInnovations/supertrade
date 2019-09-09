// NGRX
import { Action } from '@ngrx/store';


export enum DistributorSalesSchemeListActionTypes {
    LOAD_DISTRIBUTORSALESCHEMELIST = '[DistributorSalesSchemeListHome] All DistributorSalesSchemeList Requested',
    LOAD_DISTRIBUTORSALESCHEMELIST_SUCCESS = '[DistributorSalesSchemeList API] All DistributorSalesSchemeList Loaded successfully',
    LOAD_DISTRIBUTORSALESCHEMELIST_FAIL = '[DistributorSalesSchemeList API] All DistributorSalesSchemeList Load Error',
    LOAD_DISTRIBUTORSALESCHEMELIST_ACTION_TOGGLE_LOADING = '[DistributorSalesSchemeList API] All DistributorSalesSchemeList Load Togg',
}

export class LoadDistributorSalesSchemeList implements Action {
    readonly type = DistributorSalesSchemeListActionTypes.LOAD_DISTRIBUTORSALESCHEMELIST;
    constructor(public payload) { }
}

export class LoadDistributorSalesSchemeListSuccess implements Action {
    readonly type = DistributorSalesSchemeListActionTypes.LOAD_DISTRIBUTORSALESCHEMELIST_SUCCESS;
    constructor(public payload) { }
    // constructor(public payload: { distributorSalesSchemeList: DistributorSalesSchemeList[] }) {}
}

export class LoadDistributorSalesSchemeListFail implements Action {
    readonly type = DistributorSalesSchemeListActionTypes.LOAD_DISTRIBUTORSALESCHEMELIST_FAIL;
    constructor(public payload: string) {}
}
export class LoadDistributorSalesSchemeListActionToggleLoading implements Action {
    readonly type = DistributorSalesSchemeListActionTypes.LOAD_DISTRIBUTORSALESCHEMELIST_ACTION_TOGGLE_LOADING;
    constructor(public payload: { isLoading: boolean }) { }
}

export type DistributorSalesSchemeListActions = LoadDistributorSalesSchemeList
| LoadDistributorSalesSchemeListSuccess
| LoadDistributorSalesSchemeListFail
| LoadDistributorSalesSchemeListActionToggleLoading;
