// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { ProductActions, ProductActionTypes } from '../_actions/product.actions';
// Models
import { Product } from '../_models/product.model';

export interface ProductState {
    products:[],
    productLoading: boolean;
    productLoaded: boolean;
}


export const initialProductsState: ProductState = {
    products:[],
    productLoading: false,
    productLoaded: false,
};

export function productReducer(state = initialProductsState, action: ProductActions): ProductState {
    switch (action.type) {
        case ProductActionTypes.LOAD_PRODUCT_SUCCESS: 
        return {
            ...initialProductsState,
            productLoading: false,
            productLoaded: true,
            products: action.payload
        }
        case ProductActionTypes.LOAD_PRODUCT: 
        return {
            ...initialProductsState,
            productLoading: true,
            productLoaded: false,
            products: []
        }
        default: return state;
    }
}