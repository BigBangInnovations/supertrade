// NGRX
import { Action } from '@ngrx/store';


export enum DistributorposelectActionTypes {
    LOAD_DISTRIBUTORPOSELECT = '[DistributorposelectHome] All Distributorposelect Requested',
    LOAD_DISTRIBUTORPOSELECT_SUCCESS = '[Distributorposelect API] All Distributorposelect Loaded successfully',
    LOAD_DISTRIBUTORPOSELECT_FAIL = '[Distributorposelect API] All Distributorposelect Load Error',
    LOAD_DISTRIBUTORPOSELECT_ACTION_TOGGLE_LOADING = '[Distributorposelect API] All Distributorposelect Load Togg',
}

export class LoadDistributorposelect implements Action {
    readonly type = DistributorposelectActionTypes.LOAD_DISTRIBUTORPOSELECT;
    constructor(public payload) { }
}

export class LoadDistributorposelectSuccess implements Action {
    readonly type = DistributorposelectActionTypes.LOAD_DISTRIBUTORPOSELECT_SUCCESS;
    constructor(public payload) { }
    // constructor(public payload: { distributorposelect: Distributorposelect[] }) {}
}

export class LoadDistributorposelectFail implements Action {
    readonly type = DistributorposelectActionTypes.LOAD_DISTRIBUTORPOSELECT_FAIL;
    constructor(public payload: string) {}
}
export class LoadDistributorposelectActionToggleLoading implements Action {
    readonly type = DistributorposelectActionTypes.LOAD_DISTRIBUTORPOSELECT_ACTION_TOGGLE_LOADING;
    constructor(public payload: { isLoading: boolean }) { }
}

export type DistributorposelectActions = LoadDistributorposelect
| LoadDistributorposelectSuccess
| LoadDistributorposelectFail
| LoadDistributorposelectActionToggleLoading;
