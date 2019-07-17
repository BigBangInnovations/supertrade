// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { SaleActions, SaleActionTypes } from '../_actions/sale.actions';
// Models
import { Sale } from '../_models/sale.model';
import { QueryParamsModel } from '../../_base/crud';

export interface SalesState extends EntityState<Sale> {
    isAllSalesLoaded: boolean;
    queryRowsCount: number;
    queryResult: Sale[];
    userPoints:any
    lastCreatedSaleId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<Sale> = createEntityAdapter<Sale>();

export const initialSalesState: SalesState = adapter.getInitialState({
    isAllSalesLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    userPoints:[],
    lastCreatedSaleId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function salesReducer(state = initialSalesState, action: SaleActions): SalesState {
    switch  (action.type) {
        case SaleActionTypes.SalesPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedSaleId: undefined
        };
        case SaleActionTypes.SalesActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case SaleActionTypes.SaleOnServerCreated: return {
            ...state
        };
        case SaleActionTypes.SaleCreated: return adapter.addOne(action.payload.sale, {
            ...state, lastCreatedSaleId: action.payload.sale.id
        });
        case SaleActionTypes.SaleUpdated: return adapter.updateOne(action.payload.partialsale, state);
        case SaleActionTypes.SaleDeleted: return adapter.removeOne(action.payload.id, state);
        case SaleActionTypes.AllSalesLoaded: return adapter.addAll(action.payload.sales, {
            ...state, isAllSalesLoaded: true
        });
        case SaleActionTypes.SalesPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case SaleActionTypes.SalesPageLoaded: return adapter.addMany(action.payload.sales, {
            ...initialSalesState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.sales,
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
