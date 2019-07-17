// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import * as dashboardAction from '../_actions/dashboard.actions';
// Models
import { Purchase } from '../../Purchase/_models/Purchase.model';

// tslint:disable-next-line:no-empty-interface
export interface dashboardPurchasesState extends EntityState<Purchase> {
    selectedPurchaseId: number | null;
    userPurchasePointsStatus: object | null;
    loading: boolean;
    loaded: boolean;
    error: string;
}

export const adapter: EntityAdapter<Purchase> = createEntityAdapter<Purchase>();

export const initialPurchasesState: dashboardPurchasesState = adapter.getInitialState({
    ids: [],
    entities: {},
    selectedPurchaseId: null,
    userPurchasePointsStatus: null,
    loading: false,
    loaded: false,
    error: ""
});

export function purchasesReducer(state = initialPurchasesState, action: dashboardAction.Action): dashboardPurchasesState {
    switch (action.type) {
        case dashboardAction.DashboardActionType.LOAD_PURCHASES: {
            return {
                ...state,
                userPurchasePointsStatus: null,
                loading: true,
                loaded: false,
              };
        }
        case dashboardAction.DashboardActionType.LOAD_PURCHASES_SUCCESS: {
            
            return adapter.addAll(action.payload.data[0].purchase, {
                ...state,
                userPurchasePointsStatus: action.payload.data[0].userPointsStatus,
                loading: false,
                loaded: true
            });
        }
        case dashboardAction.DashboardActionType.LOAD_PURCHASES_FAIL: {
            return {
                ...state,
                entities: {},
                userPurchasePointsStatus: null,
                loading: false,
                loaded: false,
                error: action.payload
              };
        }

        default: return state;
    }
}

export const {
    selectAll,
    selectEntities,
} = adapter.getSelectors();