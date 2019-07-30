// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { DistributorSale, UserPointsStatus } from '../_models/distributorSale.model';

export enum DistributorSaleActionTypes { 
    AllDistributorSaleRequested = '[DistributorSale Home Page] All DistributorSale Requested',
    AllDistributorSaleLoaded = '[DistributorSale API] All DistributorSale Loaded',
    DistributorSaleOnServerCreated = '[Edit DistributorSale Dialog] DistributorSale On Server Created',
    DistributorSaleCreated = '[Edit DistributorSale Dialog] DistributorSale Created',
    DistributorSaleUpdated = '[Edit DistributorSale Dialog] DistributorSale Updated',
    DistributorSaleDeleted = '[DistributorSale List Page] DistributorSale Deleted',
    DistributorSalePageRequested = '[DistributorSale List Page] DistributorSale Page Requested',
    DistributorSalePageLoaded = '[DistributorSale API] DistributorSale Page Loaded',
    DistributorSalePageCancelled = '[DistributorSale API] DistributorSale Page Cancelled',
    DistributorSalePageToggleLoading = '[DistributorSale page] DistributorSale Page Toggle Loading',
    DistributorSaleActionToggleLoading = '[DistributorSale] DistributorSale Action Toggle Loading',
    LOAD_DISTRIBUTOR_SALE = '[DistributorSale] load DistributorSale',
    LOAD_DISTRIBUTOR_SALE_SUCCESS = '[DistributorSale] load DistributorSale success',
    LOAD_DISTRIBUTOR_SALE_FAIL = '[DistributorSale] load DistributorSale fail',
}

export class DistributorSaleOnServerCreated implements Action {
    readonly type = DistributorSaleActionTypes.DistributorSaleOnServerCreated;
    constructor(public payload: { distributorSale: DistributorSale }) { }
}

export class DistributorSaleCreated implements Action {
    readonly type = DistributorSaleActionTypes.DistributorSaleCreated;
    constructor(public payload: { distributorSale: DistributorSale }) { }
}

export class DistributorSaleUpdated implements Action {
    readonly type = DistributorSaleActionTypes.DistributorSaleUpdated;
    constructor(public payload: {
        partialdistributorSale: Update<DistributorSale>,
        distributorSale: DistributorSale
    }) { }
}

export class DistributorSaleDeleted implements Action {
    readonly type = DistributorSaleActionTypes.DistributorSaleDeleted;
    constructor(public payload: { id: number }) {}
}

export class DistributorSalePageRequested implements Action {
    readonly type = DistributorSaleActionTypes.DistributorSalePageRequested;
    constructor(public payload: { page: QueryParamsModel, body:any }) { }
}

export class DistributorSalePageLoaded implements Action {
    readonly type = DistributorSaleActionTypes.DistributorSalePageLoaded;
    constructor(public payload: { distributorSale: DistributorSale[], userPoints:UserPointsStatus, totalCount: number, page: QueryParamsModel }) { }
}

export class DistributorSalePageCancelled implements Action {
    readonly type = DistributorSaleActionTypes.DistributorSalePageCancelled;
}

export class AllDistributorSaleRequested implements Action {
    readonly type = DistributorSaleActionTypes.AllDistributorSaleRequested;
    constructor(public payload) { }
}

export class AllDistributorSaleLoaded implements Action {
    readonly type = DistributorSaleActionTypes.AllDistributorSaleLoaded;
    constructor(public payload: { distributorSale: DistributorSale[] }) { }
}

export class DistributorSalePageToggleLoading implements Action {
    readonly type = DistributorSaleActionTypes.DistributorSalePageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class DistributorSaleActionToggleLoading implements Action {
    readonly type = DistributorSaleActionTypes.DistributorSaleActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class LOAD_DISTRIBUTOR_SALE implements Action {
    readonly type = DistributorSaleActionTypes.LOAD_DISTRIBUTOR_SALE;
    constructor(public payload) { }
}

export class LOAD_DISTRIBUTOR_SALE_SUCCESS implements Action {
    readonly type = DistributorSaleActionTypes.LOAD_DISTRIBUTOR_SALE_SUCCESS
    constructor(public payload: { purchase: DistributorSale[] }) { }
}

export class LOAD_DISTRIBUTOR_SALE_FAIL implements Action {
    readonly type = DistributorSaleActionTypes.LOAD_DISTRIBUTOR_SALE_FAIL
    constructor(public payload: string) {}
}

export type DistributorSaleActions = DistributorSaleCreated
| DistributorSaleUpdated
| DistributorSaleDeleted
| DistributorSalePageRequested
| DistributorSalePageLoaded
| DistributorSalePageCancelled
| AllDistributorSaleLoaded
| AllDistributorSaleRequested
| DistributorSaleOnServerCreated
| DistributorSalePageToggleLoading
| DistributorSaleActionToggleLoading
| LOAD_DISTRIBUTOR_SALE
| LOAD_DISTRIBUTOR_SALE_SUCCESS
| LOAD_DISTRIBUTOR_SALE_FAIL;
