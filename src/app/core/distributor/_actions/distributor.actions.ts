// NGRX
import { Action } from '@ngrx/store';

// Models
import { Distributor } from '../_models/distributor.model';

export enum DistributorActionTypes {
    LOAD_DISTRIBUTOR = '[DistributorHome] All Distributor Requested',
    LOAD_DISTRIBUTOR_SUCCESS = '[Distributor API] All Distributor Loaded successfully',
    LOAD_DISTRIBUTOR_FAIL = '[Distributor API] All Distributor Load Error',
    LOAD_DISTRIBUTOR_ACTION_TOGGLE_LOADING = '[Distributor API] All Distributor Load Togg',
}

export class LoadDistributor implements Action {
    readonly type = DistributorActionTypes.LOAD_DISTRIBUTOR;
    constructor(public payload) { }
}

export class LoadDistributorSuccess implements Action {
    readonly type = DistributorActionTypes.LOAD_DISTRIBUTOR_SUCCESS;
    constructor(public payload) { }
    // constructor(public payload: { distributor: Distributor[] }) {}
}

export class LoadDistributorFail implements Action {
    readonly type = DistributorActionTypes.LOAD_DISTRIBUTOR_FAIL;
    constructor(public payload: string) {}
}
export class LoadDistributorActionToggleLoading implements Action {
    readonly type = DistributorActionTypes.LOAD_DISTRIBUTOR_ACTION_TOGGLE_LOADING;
    constructor(public payload: { isLoading: boolean }) { }
}

export type DistributorActions = LoadDistributor
| LoadDistributorSuccess
| LoadDistributorFail
| LoadDistributorActionToggleLoading;
