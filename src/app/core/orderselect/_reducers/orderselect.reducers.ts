// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { OrderselectActions, OrderselectActionTypes } from '../_actions/orderselect.actions';
// Models
import { Order } from '../../order/_models/order.model';

export interface OrderselectState extends EntityState<Order> {
    orderselect: [],
    orderselectLoading: boolean;
    orderselectLoaded: boolean;
}

export const adapter: EntityAdapter<Order> = createEntityAdapter<Order>({
    selectId: (Order: Order) => Order.ID,
});

export const initialOrderselectState: OrderselectState = adapter.getInitialState({
    orderselect: [],
    orderselectLoading: false,
    orderselectLoaded: false,
});

export function orderselectReducer(state = initialOrderselectState, action: OrderselectActions): OrderselectState {
    switch (action.type) {
        case OrderselectActionTypes.LOAD_ORDERSELECT_SUCCESS:
            // return {
            //     ...initialOrderselectState,
            //     orderselectLoading: false,
            //     orderselectLoaded: true,
            //     orderselect: action.payload
            // }
            return adapter.addAll(
                action.payload, {
                    ...initialOrderselectState,
                    orderselectLoading: false,
                    orderselectLoaded: true,
                });
        case OrderselectActionTypes.LOAD_ORDERSELECT:
            return {
                ...initialOrderselectState,
                orderselectLoading: true,
                orderselectLoaded: false,
                orderselect: []
            }
        default: return state;
    }
} 
export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();