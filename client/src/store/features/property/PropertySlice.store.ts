import { createSlice} from "@reduxjs/toolkit";
import { type RootState } from "@store/store";
import { type PropertyState} from "@store/features/property/propertyStore.interface";

import reducer from './PropertyReducer';
import { handleExtraReducers } from "./PropertyExtraReducer.store";


const initialState: PropertyState = {                    
  status: null,  
  properties: null, 
}


const propertySlice = createSlice({
  name: 'property', 
  initialState,
  reducers: {
    // setInvestors: reducer.setInvestors,
    resetPropertyState: reducer.resetProperty,
  },
  extraReducers: handleExtraReducers
})


export default propertySlice.reducer;
export const {resetPropertyState} = propertySlice.actions;



//selectors
export const selectLoadingStatus = (state: RootState) => state.property?.status;
export const selectProperty = (state: RootState) => state.property?.properties ?? null;
export const selectPropertyDetails = (state:RootState, propertyId:string) => state.property?.properties?.find(p => p._id === propertyId) ?? null