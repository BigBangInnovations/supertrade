// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { Order, AddEditOrder } from '../_models/order.model';

export enum OrderActionTypes {
    AllOrderRequested = '[Order Home Page] All Order Requested',
    AllOrderLoaded = '[Order API] All Order Loaded',
    OrderOnServerCreated = '[Edit Order Dialog] Order On Server Created',
    OrderCreated = '[Edit Order Dialog] Order Created',
    OrderUpdated = '[Edit Order Dialog] Order Updated',
    OrderDeleted = '[Order List Page] Order Deleted',
    OrderPageRequested = '[Order List Page] Order Page Requested',
    OrderPageLoaded = '[Order API] Order Page Loaded',
    OrderPageCancelled = '[Order API] Order Page Cancelled',
    OrderPageToggleLoading = '[Order page] Order Page Toggle Loading',
    OrderActionToggleLoading = '[Order] Order Action Toggle Loading'
}

export class OrderOnServerCreated implements Action {
    readonly type = OrderActionTypes.OrderOnServerCreated;
    constructor(public payload: { order: Order }) { }
}

export class OrderCreated implements Action {
    readonly type = OrderActionTypes.OrderCreated;
    constructor(public payload: { order: Order }) { }
}

export class OrderUpdated implements Action {
    readonly type = OrderActionTypes.OrderUpdated;
    constructor(public payload: {
        partialorder: Update<Order>,
        order: Order
    }) { }
}

export class OrderDeleted implements Action {
    readonly type = OrderActionTypes.OrderDeleted;
    constructor(public payload: { id: number }) {}
}

export class OrderPageRequested implements Action {
    readonly type = OrderActionTypes.OrderPageRequested;
    constructor(public payload: { page: QueryParamsModel, body:any }) { }
}

export class OrderPageLoaded implements Action {
    readonly type = OrderActionTypes.OrderPageLoaded;
    constructor(public payload: { order: Order[], totalCount: number, page: QueryParamsModel }) { }
}

export class OrderPageCancelled implements Action {
    readonly type = OrderActionTypes.OrderPageCancelled;
}

export class AllOrderRequested implements Action {
    readonly type = OrderActionTypes.AllOrderRequested;
    constructor(public payload) { }
}

export class AllOrderLoaded implements Action {
    readonly type = OrderActionTypes.AllOrderLoaded;
    constructor(public payload: { order: Order[] }) { }
}

export class OrderPageToggleLoading implements Action {
    readonly type = OrderActionTypes.OrderPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class OrderActionToggleLoading implements Action {
    readonly type = OrderActionTypes.OrderActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type OrderActions = OrderCreated
| OrderUpdated
| OrderDeleted
| OrderPageRequested
| OrderPageLoaded
| OrderPageCancelled
| AllOrderLoaded
| AllOrderRequested
| OrderOnServerCreated
| OrderPageToggleLoading
| OrderActionToggleLoading;
