// NGRX
import { Action } from '@ngrx/store';

// Models
import { Product } from '../_models/product.model';

export enum ProductActionTypes {
    LOAD_PRODUCT = '[ProductHome] All Products Requested',
    LOAD_PRODUCT_SUCCESS = '[Products API] All Products Loaded successfully',
    LOAD_PRODUCT_FAIL = '[Products API] All Products Load Error',
    LOAD_PRODUCT_ACTION_TOGGLE_LOADING = '[Products API] All Products Load Togg',
}

export class LoadProducts implements Action {
    readonly type = ProductActionTypes.LOAD_PRODUCT;
}

export class LoadProductsSuccess implements Action {
    readonly type = ProductActionTypes.LOAD_PRODUCT_SUCCESS;
    constructor(public payload) { }
    // constructor(public payload: { products: Product[] }) {}
}

export class LoadProductsFail implements Action {
    readonly type = ProductActionTypes.LOAD_PRODUCT_FAIL;
    constructor(public payload: string) {}
}
export class LoadProductsActionToggleLoading implements Action {
    readonly type = ProductActionTypes.LOAD_PRODUCT_ACTION_TOGGLE_LOADING;
    constructor(public payload: { isLoading: boolean }) { }
}

export type ProductActions = LoadProducts
| LoadProductsSuccess
| LoadProductsFail
| LoadProductsActionToggleLoading;
