// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { DistributorPurchaseActions, DistributorPurchaseActionTypes } from '../_actions/distributorPurchase.actions';
// Models
import { DistributorPurchase } from '../_models/distributorPurchase.model';
import { QueryParamsModel } from '../../_base/crud';

export interface DistributorPurchaseState extends EntityState<DistributorPurchase> { 
    isAllDistributorPurchaseLoaded: boolean;
    queryRowsCount: number;
    queryResult: DistributorPurchase[];
    userPoints:any;
    distributorPurchase:any;
    lastCreatedDistributorPurchaseId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
    loading: boolean;
    loaded: boolean;
    error: string;
}

export const adapter: EntityAdapter<DistributorPurchase> = createEntityAdapter<DistributorPurchase>();

export const initialDistributorPurchaseState: DistributorPurchaseState = adapter.getInitialState({
    isAllDistributorPurchaseLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    userPoints:[],
    distributorPurchase: [],
    lastCreatedDistributorPurchaseId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true,
    loading: false,
    loaded: false,
    error: ''
});

export function distributorPurchaseReducer(state = initialDistributorPurchaseState, action: DistributorPurchaseActions): DistributorPurchaseState {
    switch  (action.type) {
        case DistributorPurchaseActionTypes.LOAD_DISTRIBUTOR_PURCHASE: return {
            ...state,
            loading: true,
            loaded: false,
            distributorPurchase:[]
        };
        case DistributorPurchaseActionTypes.LOAD_DISTRIBUTOR_PURCHASE_SUCCESS: return {
            ...state,
            loading: false,
            loaded: true,
            distributorPurchase:action.payload
        };
        case DistributorPurchaseActionTypes.LOAD_DISTRIBUTOR_PURCHASE_FAIL: return {
            ...state,
            loading: false,
            loaded: false,
            distributorPurchase:[],
            error: action.payload
        };
        
        case DistributorPurchaseActionTypes.LOAD_DISTRIBUTOR_PURCHASE_RETURN: return {
            ...state,
            loading: true,
            loaded: false,
            distributorPurchase:[]
        };
        case DistributorPurchaseActionTypes.LOAD_DISTRIBUTOR_PURCHASE_RETURN_SUCCESS: return {
            ...state,
            loading: false,
            loaded: true,
            distributorPurchase:action.payload
        };
        case DistributorPurchaseActionTypes.LOAD_DISTRIBUTOR_PURCHASE_RETURN_FAIL: return {
            ...state,
            loading: false,
            loaded: false,
            distributorPurchase:[],
            error: action.payload
        };
        case DistributorPurchaseActionTypes.DistributorPurchasePageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedDistributorPurchaseId: undefined
        };
        case DistributorPurchaseActionTypes.DistributorPurchaseActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case DistributorPurchaseActionTypes.DistributorPurchaseOnServerCreated: return {
            ...state
        };
        case DistributorPurchaseActionTypes.DistributorPurchaseCreated: return adapter.addOne(action.payload.distributorPurchase, {
            ...state, lastCreatedDistributorPurchaseId: action.payload.distributorPurchase.id
        });
        case DistributorPurchaseActionTypes.DistributorPurchaseUpdated: return adapter.updateOne(action.payload.partialdistributorPurchase, state);
        case DistributorPurchaseActionTypes.DistributorPurchaseDeleted: return adapter.removeOne(action.payload.id, state);
        case DistributorPurchaseActionTypes.AllDistributorPurchaseLoaded: return adapter.addAll(action.payload.distributorPurchase, {
            ...state, isAllDistributorPurchaseLoaded: true
        });
        case DistributorPurchaseActionTypes.DistributorPurchasePageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case DistributorPurchaseActionTypes.DistributorPurchasePageLoaded: return adapter.addMany(action.payload.distributorPurchase, {
            ...initialDistributorPurchaseState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.distributorPurchase,
            userPoints:action.payload.userPoints,
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
