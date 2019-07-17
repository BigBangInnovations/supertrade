// MODELS
export { Product } from './_models/product.model';
//SERVICES
export { ProductService } from './_services'
//REDUCER
export { productReducer } from './_reducers/product.reducers'
//EFFECTS
export { ProductEffects } from './_effects/product.effects'
//SELECTOR
export {
    selectAllProducts,
    selectProductLoaded,
    selectProductsState,
    selectProductLoading
 } from './_selectors/product.selectors'
 //ACTION
 export { 
     ProductActionTypes,
     LoadProducts,
     ProductActions,
     LoadProductsActionToggleLoading,
     LoadProductsSuccess,
     LoadProductsFail
  } from './_actions/product.actions'