// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { DistributorposelectActions, DistributorposelectActionTypes } from '../_actions/distributorposelect.actions';
// Models
import { Order } from '../../order/_models/order.model';

export interface DistributorposelectState extends EntityState<Order> {
    distributorposelect: [],
    distributorposelectLoading: boolean;
    distributorposelectLoaded: boolean;
}

export const adapter: EntityAdapter<Order> = createEntityAdapter<Order>();

export const initialDistributorposelectState: DistributorposelectState = adapter.getInitialState({
    distributorposelect: [],
    distributorposelectLoading: false,
    distributorposelectLoaded: false,
});

export function distributorposelectReducer(state = initialDistributorposelectState, action: DistributorposelectActions): DistributorposelectState {
    switch (action.type) {
        case DistributorposelectActionTypes.LOAD_DISTRIBUTORPOSELECT_SUCCESS:
            // return {
            //     ...initialDistributorposelectState,
            //     distributorposelectLoading: false,
            //     distributorposelectLoaded: true,
            //     distributorposelect: action.payload
            // }
            return adapter.addAll(
                action.payload, {
                    ...initialDistributorposelectState,
                    distributorposelectLoading: false,
                    distributorposelectLoaded: true,
                });
        case DistributorposelectActionTypes.LOAD_DISTRIBUTORPOSELECT:
            return {
                ...initialDistributorposelectState,
                distributorposelectLoading: true,
                distributorposelectLoaded: false,
                distributorposelect: []
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