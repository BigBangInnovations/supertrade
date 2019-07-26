// MODELS
export { Retailer } from './_models/retailer.model';
//SERVICES
export { RetailerService } from './_services'
//REDUCER
export { retailerReducer } from './_reducers/retailer.reducers'
//EFFECTS
export { RetailerEffects } from './_effects/retailer.effects'
//SELECTOR
export {
    selectAllRetailer,
    selectRetailerLoaded,
    selectRetailerState,
    selectRetailerLoading,
    selectRetailerById
 } from './_selectors/retailer.selectors'
 //ACTION
 export { 
     RetailerActionTypes,
     LoadRetailer,
     RetailerActions,
     LoadRetailerActionToggleLoading,
     LoadRetailerSuccess,
     LoadRetailerFail
  } from './_actions/retailer.actions'