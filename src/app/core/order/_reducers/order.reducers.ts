// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { OrderActions, OrderActionTypes } from '../_actions/order.actions';
// Models
import { Order } from '../_models/order.model';
import { QueryParamsModel } from '../../_base/crud';

export interface OrderState extends EntityState<Order> {
    isAllOrderLoaded: boolean;
    queryRowsCount: number;
    queryResult: Order[];
    lastCreatedOrderId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<Order> = createEntityAdapter<Order>({
    selectId:(Order:Order) => Order.ID,
});

export const initialOrderState: OrderState = adapter.getInitialState({
    isAllOrderLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedOrderId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function orderReducer(state = initialOrderState, action: OrderActions): OrderState {
    switch  (action.type) {
        case OrderActionTypes.OrderPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedOrderId: undefined
        };
        case OrderActionTypes.OrderActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case OrderActionTypes.OrderOnServerCreated: return {
            ...state
        };
        case OrderActionTypes.OrderCreated: return adapter.addOne(action.payload.order, {
            ...state, lastCreatedOrderId: action.payload.order.ID
        });
        case OrderActionTypes.OrderUpdated: return adapter.updateOne(action.payload.partialorder, state);
        case OrderActionTypes.OrderDeleted: return adapter.removeOne(action.payload.id, state);
        case OrderActionTypes.AllOrderLoaded: return adapter.addAll(action.payload.order, {
            ...state, isAllOrderLoaded: true
        });
        case OrderActionTypes.OrderPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case OrderActionTypes.OrderPageLoaded: return adapter.addMany(action.payload.order, {
            ...initialOrderState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.order,
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
