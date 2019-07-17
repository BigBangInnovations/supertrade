import { Action } from '@ngrx/store'

// Models
import { CommonResponse } from '../../common/common.model'

export enum DashboardActionType {
    LOAD_PURCHASES = '[Dashboard] load purchases',
    LOAD_PURCHASES_SUCCESS = '[Dashboard] load purchases Success',
    LOAD_PURCHASES_FAIL = '[Dashboard] load purchases Fail',
}

export class LoadDashboardPurchases implements Action {
    readonly type = DashboardActionType.LOAD_PURCHASES;
    constructor(public payload) { }
}

export class LoadDashboardPurchasesSuccess implements Action {
    readonly type = DashboardActionType.LOAD_PURCHASES_SUCCESS;
    constructor(public payload: CommonResponse) { }
}

export class LoadDashboardPurchasesFail implements Action {
    readonly type = DashboardActionType.LOAD_PURCHASES_FAIL;
    constructor(public payload: string) {}
}
export type Action = LoadDashboardPurchases | LoadDashboardPurchasesSuccess | LoadDashboardPurchasesFail;