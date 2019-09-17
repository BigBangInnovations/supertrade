// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { DistributorPurchase, UserPointsStatus } from '../_models/distributorPurchase.model';

export enum DistributorPurchaseActionTypes { 
    AllDistributorPurchaseRequested = '[DistributorPurchase Home Page] All DistributorPurchase Requested',
    AllDistributorPurchaseLoaded = '[DistributorPurchase API] All DistributorPurchase Loaded',
    DistributorPurchaseOnServerCreated = '[Edit DistributorPurchase Dialog] DistributorPurchase On Server Created',
    DistributorPurchaseCreated = '[Edit DistributorPurchase Dialog] DistributorPurchase Created',
    DistributorPurchaseUpdated = '[Edit DistributorPurchase Dialog] DistributorPurchase Updated',
    DistributorPurchaseDeleted = '[DistributorPurchase List Page] DistributorPurchase Deleted',
    DistributorPurchasePageRequested = '[DistributorPurchase List Page] DistributorPurchase Page Requested',
    DistributorPurchasePageLoaded = '[DistributorPurchase API] DistributorPurchase Page Loaded',
    DistributorPurchasePageCancelled = '[DistributorPurchase API] DistributorPurchase Page Cancelled',
    DistributorPurchasePageToggleLoading = '[DistributorPurchase page] DistributorPurchase Page Toggle Loading',
    DistributorPurchaseActionToggleLoading = '[DistributorPurchase] DistributorPurchase Action Toggle Loading',
    LOAD_DISTRIBUTOR_PURCHASE = '[DistributorPurchase] load DistributorPurchase',
    LOAD_DISTRIBUTOR_PURCHASE_SUCCESS = '[DistributorPurchase] load DistributorPurchase success',
    LOAD_DISTRIBUTOR_PURCHASE_FAIL = '[DistributorPurchase] load DistributorPurchase fail',

    LOAD_DISTRIBUTOR_PURCHASE_RETURN = '[DistributorPurchaseReturn] load DistributorPurchaseReturn',
    LOAD_DISTRIBUTOR_PURCHASE_RETURN_SUCCESS = '[DistributorPurchaseReturn] load DistributorPurchaseReturn success',
    LOAD_DISTRIBUTOR_PURCHASE_RETURN_FAIL = '[DistributorPurchaseReturn] load DistributorPurchaseReturn fail',
}

export class DistributorPurchaseOnServerCreated implements Action {
    readonly type = DistributorPurchaseActionTypes.DistributorPurchaseOnServerCreated;
    constructor(public payload: { distributorPurchase: DistributorPurchase }) { }
}

export class DistributorPurchaseCreated implements Action {
    readonly type = DistributorPurchaseActionTypes.DistributorPurchaseCreated;
    constructor(public payload: { distributorPurchase: DistributorPurchase }) { }
}

export class DistributorPurchaseUpdated implements Action {
    readonly type = DistributorPurchaseActionTypes.DistributorPurchaseUpdated;
    constructor(public payload: {
        partialdistributorPurchase: Update<DistributorPurchase>,
        distributorPurchase: DistributorPurchase
    }) { }
}

export class DistributorPurchaseDeleted implements Action {
    readonly type = DistributorPurchaseActionTypes.DistributorPurchaseDeleted;
    constructor(public payload: { id: number }) {}
}

export class DistributorPurchasePageRequested implements Action {
    readonly type = DistributorPurchaseActionTypes.DistributorPurchasePageRequested;
    constructor(public payload: { page: QueryParamsModel, body:any }) { }
}

export class DistributorPurchasePageLoaded implements Action {
    readonly type = DistributorPurchaseActionTypes.DistributorPurchasePageLoaded;
    constructor(public payload: { distributorPurchase: DistributorPurchase[], userPoints:UserPointsStatus, totalCount: number, page: QueryParamsModel }) { }
}

export class DistributorPurchasePageCancelled implements Action {
    readonly type = DistributorPurchaseActionTypes.DistributorPurchasePageCancelled;
}

export class AllDistributorPurchaseRequested implements Action {
    readonly type = DistributorPurchaseActionTypes.AllDistributorPurchaseRequested;
    constructor(public payload) { }
}

export class AllDistributorPurchaseLoaded implements Action {
    readonly type = DistributorPurchaseActionTypes.AllDistributorPurchaseLoaded;
    constructor(public payload: { distributorPurchase: DistributorPurchase[] }) { }
}

export class DistributorPurchasePageToggleLoading implements Action {
    readonly type = DistributorPurchaseActionTypes.DistributorPurchasePageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class DistributorPurchaseActionToggleLoading implements Action {
    readonly type = DistributorPurchaseActionTypes.DistributorPurchaseActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class LOAD_DISTRIBUTOR_PURCHASE implements Action {
    readonly type = DistributorPurchaseActionTypes.LOAD_DISTRIBUTOR_PURCHASE;
    constructor(public payload) { }
}

export class LOAD_DISTRIBUTOR_PURCHASE_SUCCESS implements Action {
    readonly type = DistributorPurchaseActionTypes.LOAD_DISTRIBUTOR_PURCHASE_SUCCESS
    constructor(public payload: { purchase: DistributorPurchase[] }) { }
}

export class LOAD_DISTRIBUTOR_PURCHASE_FAIL implements Action {
    readonly type = DistributorPurchaseActionTypes.LOAD_DISTRIBUTOR_PURCHASE_FAIL
    constructor(public payload: string) {}
}

export class LOAD_DISTRIBUTOR_PURCHASE_RETURN implements Action {
    readonly type = DistributorPurchaseActionTypes.LOAD_DISTRIBUTOR_PURCHASE_RETURN;
    constructor(public payload) { }
}

export class LOAD_DISTRIBUTOR_PURCHASE_RETURN_SUCCESS implements Action {
    readonly type = DistributorPurchaseActionTypes.LOAD_DISTRIBUTOR_PURCHASE_RETURN_SUCCESS
    constructor(public payload: { purchase: DistributorPurchase[] }) { }
}

export class LOAD_DISTRIBUTOR_PURCHASE_RETURN_FAIL implements Action {
    readonly type = DistributorPurchaseActionTypes.LOAD_DISTRIBUTOR_PURCHASE_RETURN_FAIL
    constructor(public payload: string) {}
}

export type DistributorPurchaseActions = DistributorPurchaseCreated
| DistributorPurchaseUpdated
| DistributorPurchaseDeleted
| DistributorPurchasePageRequested
| DistributorPurchasePageLoaded
| DistributorPurchasePageCancelled
| AllDistributorPurchaseLoaded
| AllDistributorPurchaseRequested
| DistributorPurchaseOnServerCreated
| DistributorPurchasePageToggleLoading
| DistributorPurchaseActionToggleLoading
| LOAD_DISTRIBUTOR_PURCHASE
| LOAD_DISTRIBUTOR_PURCHASE_SUCCESS
| LOAD_DISTRIBUTOR_PURCHASE_FAIL
| LOAD_DISTRIBUTOR_PURCHASE_RETURN
| LOAD_DISTRIBUTOR_PURCHASE_RETURN_SUCCESS
| LOAD_DISTRIBUTOR_PURCHASE_RETURN_FAIL
;
