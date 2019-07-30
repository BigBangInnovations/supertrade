// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { PurchaseActions, PurchaseActionTypes } from '../_actions/purchase.actions';
// Models
import { Purchase } from '../_models/purchase.model';
import { QueryParamsModel } from '../../_base/crud';

export interface PurchaseState extends EntityState<Purchase> {
    isAllPurchaseLoaded: boolean;
    queryRowsCount: number;
    queryResult: Purchase[];
    purchase: any;
    userPoints: any
    lastCreatedPurchaseId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
    loading: boolean;
    loaded: boolean;
    error: string;
}

export const adapter: EntityAdapter<Purchase> = createEntityAdapter<Purchase>();

export const initialPurchaseState: PurchaseState = adapter.getInitialState({
    isAllPurchaseLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    userPoints: [],
    purchase: [],
    lastCreatedPurchaseId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true,
    loading: false,
    loaded: false,
    error: ''
});

export function purchaseReducer(state = initialPurchaseState, action: PurchaseActions): PurchaseState {
    switch (action.type) {
        case PurchaseActionTypes.LOAD_PURCHASE: return {
            ...state,
            loading: true,
            loaded: false,
            purchase:[]
        };
        case PurchaseActionTypes.LOAD_PURCHASE_SUCCESS: return {
            ...state,
            loading: false,
            loaded: true,
            purchase:action.payload
        };
        case PurchaseActionTypes.LOAD_PURCHASE_FAIL: return {
            ...state,
            loading: false,
            loaded: false,
            purchase:[],
            error: action.payload
        };
        case PurchaseActionTypes.PurchasePageToggleLoading: return {
            ...state, listLoading: action.payload.isLoading, lastCreatedPurchaseId: undefined
        };
        case PurchaseActionTypes.PurchaseActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case PurchaseActionTypes.PurchaseOnServerCreated: return {
            ...state
        };
        case PurchaseActionTypes.PurchaseCreated: return adapter.addOne(action.payload.purchase, {
            ...state, lastCreatedPurchaseId: action.payload.purchase.id
        });
        case PurchaseActionTypes.PurchaseUpdated: return adapter.updateOne(action.payload.partialpurchase, state);
        case PurchaseActionTypes.PurchaseDeleted: return adapter.removeOne(action.payload.id, state);
        case PurchaseActionTypes.AllPurchaseLoaded: return adapter.addAll(action.payload.purchase, {
            ...state, isAllPurchaseLoaded: true
        });
        case PurchaseActionTypes.PurchasePageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case PurchaseActionTypes.PurchasePageLoaded: return adapter.addMany(action.payload.purchase, {
            ...initialPurchaseState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.purchase,
            userPoints: action.payload.userPoints,
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
