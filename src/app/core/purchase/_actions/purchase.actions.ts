// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { Purchase, UserPointsStatus } from '../_models/purchase.model';

export enum PurchaseActionTypes {
    AllPurchaseRequested = '[Purchase Home Page] All Purchase Requested',
    AllPurchaseLoaded = '[Purchase API] All Purchase Loaded',
    PurchaseOnServerCreated = '[Edit Purchase Dialog] Purchase On Server Created',
    PurchaseCreated = '[Edit Purchase Dialog] Purchase Created',
    PurchaseUpdated = '[Edit Purchase Dialog] Purchase Updated',
    PurchaseDeleted = '[Purchase List Page] Purchase Deleted',
    PurchasePageRequested = '[Purchase List Page] Purchase Page Requested',
    PurchasePageLoaded = '[Purchase API] Purchase Page Loaded',
    PurchasePageCancelled = '[Purchase API] Purchase Page Cancelled',
    PurchasePageToggleLoading = '[Purchase page] Purchase Page Toggle Loading',
    PurchaseActionToggleLoading = '[Purchase] Purchase Action Toggle Loading'
}

export class PurchaseOnServerCreated implements Action {
    readonly type = PurchaseActionTypes.PurchaseOnServerCreated;
    constructor(public payload: { purchase: Purchase }) { }
}

export class PurchaseCreated implements Action {
    readonly type = PurchaseActionTypes.PurchaseCreated;
    constructor(public payload: { purchase: Purchase }) { }
}

export class PurchaseUpdated implements Action {
    readonly type = PurchaseActionTypes.PurchaseUpdated;
    constructor(public payload: {
        partialpurchase: Update<Purchase>,
        purchase: Purchase
    }) { }
}

export class PurchaseDeleted implements Action {
    readonly type = PurchaseActionTypes.PurchaseDeleted;
    constructor(public payload: { id: number }) {}
}

export class PurchasePageRequested implements Action {
    readonly type = PurchaseActionTypes.PurchasePageRequested;
    constructor(public payload: { page: QueryParamsModel, body:any }) { }
}

export class PurchasePageLoaded implements Action {
    readonly type = PurchaseActionTypes.PurchasePageLoaded;
    constructor(public payload: { purchase: Purchase[], userPoints:UserPointsStatus, totalCount: number, page: QueryParamsModel }) { }
}

export class PurchasePageCancelled implements Action {
    readonly type = PurchaseActionTypes.PurchasePageCancelled;
}

export class AllPurchaseRequested implements Action {
    readonly type = PurchaseActionTypes.AllPurchaseRequested;
    constructor(public payload) { }
}

export class AllPurchaseLoaded implements Action {
    readonly type = PurchaseActionTypes.AllPurchaseLoaded;
    constructor(public payload: { purchase: Purchase[] }) { }
}

export class PurchasePageToggleLoading implements Action {
    readonly type = PurchaseActionTypes.PurchasePageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class PurchaseActionToggleLoading implements Action {
    readonly type = PurchaseActionTypes.PurchaseActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type PurchaseActions = PurchaseCreated
| PurchaseUpdated
| PurchaseDeleted
| PurchasePageRequested
| PurchasePageLoaded
| PurchasePageCancelled
| AllPurchaseLoaded
| AllPurchaseRequested
| PurchaseOnServerCreated
| PurchasePageToggleLoading
| PurchaseActionToggleLoading;
