// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { Sale, UserPointsStatus } from '../_models/sale.model';

export enum SaleActionTypes {
    AllSalesRequested = '[Sales Home Page] All Sales Requested',
    AllSalesLoaded = '[Sales API] All Sales Loaded',
    SaleOnServerCreated = '[Edit Sale Dialog] Sale On Server Created',
    SaleCreated = '[Edit Sales Dialog] Sales Created',
    SaleUpdated = '[Edit Sale Dialog] Sale Updated',
    SaleDeleted = '[Sales List Page] Sale Deleted',
    SalesPageRequested = '[Sales List Page] Sales Page Requested',
    SalesPageLoaded = '[Sales API] Sales Page Loaded',
    SalesPageCancelled = '[Sales API] Sales Page Cancelled',
    SalesPageToggleLoading = '[Sales page] Sales Page Toggle Loading',
    SalesActionToggleLoading = '[Sales] Sales Action Toggle Loading'
}

export class SaleOnServerCreated implements Action {
    readonly type = SaleActionTypes.SaleOnServerCreated;
    constructor(public payload: { sale: Sale }) { }
}

export class SaleCreated implements Action {
    readonly type = SaleActionTypes.SaleCreated;
    constructor(public payload: { sale: Sale }) { }
}

export class SaleUpdated implements Action {
    readonly type = SaleActionTypes.SaleUpdated;
    constructor(public payload: {
        partialsale: Update<Sale>,
        sale: Sale
    }) { }
}

export class SaleDeleted implements Action {
    readonly type = SaleActionTypes.SaleDeleted;
    constructor(public payload: { id: number }) {}
}

export class SalesPageRequested implements Action {
    readonly type = SaleActionTypes.SalesPageRequested;
    constructor(public payload: { page: QueryParamsModel, body:any }) { }
}

export class SalesPageLoaded implements Action {
    readonly type = SaleActionTypes.SalesPageLoaded;
    constructor(public payload: { sales: Sale[], userPoints:UserPointsStatus, totalCount: number, page: QueryParamsModel }) { }
}

export class SalesPageCancelled implements Action {
    readonly type = SaleActionTypes.SalesPageCancelled;
}

export class AllSalesRequested implements Action {
    readonly type = SaleActionTypes.AllSalesRequested;
    constructor(public payload) { }
}

export class AllSalesLoaded implements Action {
    readonly type = SaleActionTypes.AllSalesLoaded;
    constructor(public payload: { sales: Sale[] }) { }
}

export class SalesPageToggleLoading implements Action {
    readonly type = SaleActionTypes.SalesPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class SalesActionToggleLoading implements Action {
    readonly type = SaleActionTypes.SalesActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type SaleActions = SaleCreated
| SaleUpdated
| SaleDeleted
| SalesPageRequested
| SalesPageLoaded
| SalesPageCancelled
| AllSalesLoaded
| AllSalesRequested
| SaleOnServerCreated
| SalesPageToggleLoading
| SalesActionToggleLoading;
