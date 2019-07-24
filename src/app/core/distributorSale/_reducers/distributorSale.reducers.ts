// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { DistributorSaleActions, DistributorSaleActionTypes } from '../_actions/distributorSale.actions';
// Models
import { DistributorSale } from '../_models/distributorSale.model';
import { QueryParamsModel } from '../../_base/crud';

export interface DistributorSaleState extends EntityState<DistributorSale> {
    isAllDistributorSaleLoaded: boolean;
    queryRowsCount: number;
    queryResult: DistributorSale[];
    userPoints:any
    lastCreatedDistributorSaleId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<DistributorSale> = createEntityAdapter<DistributorSale>();

export const initialDistributorSaleState: DistributorSaleState = adapter.getInitialState({
    isAllDistributorSaleLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    userPoints:[],
    lastCreatedDistributorSaleId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function distributorSaleReducer(state = initialDistributorSaleState, action: DistributorSaleActions): DistributorSaleState {
    switch  (action.type) {
        case DistributorSaleActionTypes.DistributorSalePageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedDistributorSaleId: undefined
        };
        case DistributorSaleActionTypes.DistributorSaleActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case DistributorSaleActionTypes.DistributorSaleOnServerCreated: return {
            ...state
        };
        case DistributorSaleActionTypes.DistributorSaleCreated: return adapter.addOne(action.payload.distributorSale, {
            ...state, lastCreatedDistributorSaleId: action.payload.distributorSale.id
        });
        case DistributorSaleActionTypes.DistributorSaleUpdated: return adapter.updateOne(action.payload.partialdistributorSale, state);
        case DistributorSaleActionTypes.DistributorSaleDeleted: return adapter.removeOne(action.payload.id, state);
        case DistributorSaleActionTypes.AllDistributorSaleLoaded: return adapter.addAll(action.payload.distributorSale, {
            ...state, isAllDistributorSaleLoaded: true
        });
        case DistributorSaleActionTypes.DistributorSalePageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case DistributorSaleActionTypes.DistributorSalePageLoaded: return adapter.addMany(action.payload.distributorSale, {
            ...initialDistributorSaleState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.distributorSale,
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