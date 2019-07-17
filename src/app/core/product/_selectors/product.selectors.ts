// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// State
import { ProductState } from '../_reducers/product.reducers';
import * as fromProduct from '../_reducers/product.reducers';

export const selectProductsState = createFeatureSelector<ProductState>('product');

export const selectAllProducts = createSelector(
    selectProductsState,
    (state: ProductState) => state.products
);

export const selectProductLoading = createSelector(
    selectProductsState,
    (state: ProductState) => state.productLoading
);

export const selectProductLoaded = createSelector(
    selectProductsState,
    (state: ProductState) => state.productLoaded
);