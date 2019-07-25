// NGRX
import { Action } from '@ngrx/store';


export enum OrderselectActionTypes {
    LOAD_ORDERSELECT = '[OrderselectHome] All Orderselect Requested',
    LOAD_ORDERSELECT_SUCCESS = '[Orderselect API] All Orderselect Loaded successfully',
    LOAD_ORDERSELECT_FAIL = '[Orderselect API] All Orderselect Load Error',
    LOAD_ORDERSELECT_ACTION_TOGGLE_LOADING = '[Orderselect API] All Orderselect Load Togg',
}

export class LoadOrderselect implements Action {
    readonly type = OrderselectActionTypes.LOAD_ORDERSELECT;
    constructor(public payload) { }
}

export class LoadOrderselectSuccess implements Action {
    readonly type = OrderselectActionTypes.LOAD_ORDERSELECT_SUCCESS;
    constructor(public payload) { }
    // constructor(public payload: { orderselect: Orderselect[] }) {}
}

export class LoadOrderselectFail implements Action {
    readonly type = OrderselectActionTypes.LOAD_ORDERSELECT_FAIL;
    constructor(public payload: string) {}
}
export class LoadOrderselectActionToggleLoading implements Action {
    readonly type = OrderselectActionTypes.LOAD_ORDERSELECT_ACTION_TOGGLE_LOADING;
    constructor(public payload: { isLoading: boolean }) { }
}

export type OrderselectActions = LoadOrderselect
| LoadOrderselectSuccess
| LoadOrderselectFail
| LoadOrderselectActionToggleLoading;
