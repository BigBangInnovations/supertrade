// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { DistributorPurchaseOrderActions, DistributorPurchaseOrderActionTypes } from '../_actions/distributorPurchaseOrder.actions';
// Models
import { DistributorPurchaseOrder } from '../_models/distributorPurchaseOrder.model';
import { QueryParamsModel } from '../../_base/crud';

export interface DistributorPurchaseOrderState extends EntityState<DistributorPurchaseOrder> {
    isAllDistributorPurchaseOrderLoaded: boolean;
    queryRowsCount: number;
    queryResult: DistributorPurchaseOrder[];
    distributorPurchaseOrder: any;
    lastCreatedDistributorPurchaseOrderId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
    loading: boolean;
    loaded: boolean;
    error: string;
}

export const adapter: EntityAdapter<DistributorPurchaseOrder> = createEntityAdapter<DistributorPurchaseOrder>();

export const initialDistributorPurchaseOrderState: DistributorPurchaseOrderState = adapter.getInitialState({
    isAllDistributorPurchaseOrderLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    distributorPurchaseOrder: [],
    lastCreatedDistributorPurchaseOrderId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true,
    loading: false,
    loaded: false,
    error: ''
});

export function distributorPurchaseOrderReducer(state = initialDistributorPurchaseOrderState, action: DistributorPurchaseOrderActions): DistributorPurchaseOrderState {
    switch (action.type) {
        
        case DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderPageToggleLoading: return {
            ...state, listLoading: action.payload.isLoading, lastCreatedDistributorPurchaseOrderId: undefined
        };
        case DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderOnServerCreated: return {
            ...state
        };
        case DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderCreated: return adapter.addOne(action.payload.distributorPurchaseOrder, {
            ...state, lastCreatedDistributorPurchaseOrderId: action.payload.distributorPurchaseOrder.id
        });
        case DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderUpdated: return adapter.updateOne(action.payload.partialdistributorPurchaseOrder, state);
        case DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderDeleted: return adapter.removeOne(action.payload.id, state);
        case DistributorPurchaseOrderActionTypes.AllDistributorPurchaseOrderLoaded: return adapter.addAll(action.payload.distributorPurchaseOrder, {
            ...state, isAllDistributorPurchaseOrderLoaded: true
        });
        case DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case DistributorPurchaseOrderActionTypes.DistributorPurchaseOrderPageLoaded: return adapter.addMany(action.payload.distributorPurchaseOrder, {
            ...initialDistributorPurchaseOrderState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.distributorPurchaseOrder,
            lastQuery: action.payload.page,
            showInitWaitingMessage: false
        });
        default: return state;
    }
}

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();
