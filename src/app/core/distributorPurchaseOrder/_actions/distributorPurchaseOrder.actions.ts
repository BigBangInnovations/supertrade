// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud'; 
// Models
import { DistributorPurchaseOrder } from '../_models/distributorPurchaseOrder.model';

export enum DistributorPurchaseOrderActionTypes {
    AllDistributorPurchaseOrderRequested = '[DistributorPurchaseOrder Home Page] All DistributorPurchaseOrder Requested',
    AllDistributorPurchaseOrderLoaded = '[DistributorPurchaseOrder API] All DistributorPurchaseOrder Loaded',
    DistributorPurchaseOrderOnServerCreated = '[Edit DistributorPurchaseOrder Dialog] DistributorPurchaseOrder On Server Created',
    DistributorPurchaseOrderCreated = '[Edit DistributorPurchaseOrder Dialog] DistributorPurchaseOrder Created',
    DistributorPurchaseOrderUpdated = '[Edit DistributorPurchaseOrder Dialog] DistributorPurchaseOrder Updated',
    DistributorPurchaseOrderDeleted = '[DistributorPurchaseOrder List Page] DistributorPurchaseOrder Deleted',
    DistributorPurchaseOrderPageRequested = '[DistributorPurchaseOrder List Page] DistributorPurchaseOrder Page Requested',
    DistributorPurchaseOrderPageLoaded = '[DistributorPurchaseOrder API] DistributorPurchaseOrder Page Loaded',
    DistributorPurchaseOrderPageCancelled = '[DistributorPurchaseOrder API] DistributorPurchaseOrder Page Cancelled',
    DistributorPurchaseOrderPageToggleLoading = '[DistributorPurchaseOrder page] DistributorPurchaseOrder Page Toggle Loading',
    DistributorPurchaseOrderActionToggleLoading = '[DistributorPurchaseOrder] DistributorPurchaseOrder Action Toggle Loading',
}

export class DistributorPurchaseOrderOnServerCreated implements Action {
    readonly type = DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderOnServerCreated;
    constructor(public payload: { distributorPurchaseOrder: DistributorPurchaseOrder }) { }
}

export class DistributorPurchaseOrderCreated implements Action {
    readonly type = DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderCreated;
    constructor(public payload: { distributorPurchaseOrder: DistributorPurchaseOrder }) { }
}

export class DistributorPurchaseOrderUpdated implements Action {
    readonly type = DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderUpdated;
    constructor(public payload: {
        partialdistributorPurchaseOrder: Update<DistributorPurchaseOrder>,
        distributorPurchaseOrder: DistributorPurchaseOrder
    }) { }
}

export class DistributorPurchaseOrderDeleted implements Action {
    readonly type = DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderDeleted;
    constructor(public payload: { id: number }) { }
}

export class DistributorPurchaseOrderPageRequested implements Action {
    readonly type = DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderPageRequested;
    constructor(public payload: { page: QueryParamsModel, body: any }) { }
}

export class DistributorPurchaseOrderPageLoaded implements Action {
    readonly type = DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderPageLoaded;
    constructor(public payload: { distributorPurchaseOrder: DistributorPurchaseOrder[], totalCount: number, page: QueryParamsModel }) { }
}

export class DistributorPurchaseOrderPageCancelled implements Action {
    readonly type = DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderPageCancelled;
}

export class AllDistributorPurchaseOrderRequested implements Action {
    readonly type = DistributorPurchaseOrderActionTypes.AllDistributorPurchaseOrderRequested;
    constructor(public payload) { }
}

export class AllDistributorPurchaseOrderLoaded implements Action {
    readonly type = DistributorPurchaseOrderActionTypes.AllDistributorPurchaseOrderLoaded;
    constructor(public payload: { distributorPurchaseOrder: DistributorPurchaseOrder[] }) { }
}

export class DistributorPurchaseOrderPageToggleLoading implements Action {
    readonly type = DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class DistributorPurchaseOrderActionToggleLoading implements Action {
    readonly type = DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type DistributorPurchaseOrderActions = DistributorPurchaseOrderCreated
    | DistributorPurchaseOrderUpdated
    | DistributorPurchaseOrderDeleted
    | DistributorPurchaseOrderPageRequested
    | DistributorPurchaseOrderPageLoaded
    | DistributorPurchaseOrderPageCancelled
    | AllDistributorPurchaseOrderLoaded
    | AllDistributorPurchaseOrderRequested
    | DistributorPurchaseOrderOnServerCreated
    | DistributorPurchaseOrderPageToggleLoading
    | DistributorPurchaseOrderActionToggleLoading;
