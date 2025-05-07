import { type ActionReducerMapBuilder, type PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import * as PropTypes from '@store/features/property/propertyStore.interface';
import * as Thunks from './PropertyThunk.store';

import { ServerErrorResponse } from '../auth/authStore.interface';




export type ReducerSuccess = (
  state: PropTypes.PropertyState,
  action: PayloadAction<PropTypes.PropertyResponse>
) => void;


export type ReducerFailed = (
  state: PropTypes.PropertyState,
  action: PayloadAction<ServerErrorResponse | undefined>
) => void;



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Handles the successful retrieval of investor properties.
 *
 * - Sets the status to 'success'.
 * - Normalizes the payload data into an array and stores it in state. 
 */
const  fetchInvestorPropertiesFulfilled: ReducerSuccess = (state, action) => {
  state.status = 'success'
  state.properties = Array.isArray(action.payload.data) ? action.payload.data : [action.payload.data];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Handles the successful update of a property.
 *
 * This reducer updates the properties array in the state. It attempts to find the property by its ID.
 * - If the property is found, it updates that property in the array.
 * - If the property is not found, it adds the new property to the array.
 */
const generalPropertyUpdateFulfilled: ReducerSuccess = (state, action) => {
  state.status = 'success'; 
  const result: PropTypes.Property[] =  action.payload.data;
  
  if (state.properties) {
    result.forEach(newProperty => {
      const existingIndex = state.properties!.findIndex(p => p._id === newProperty._id)
      if (state.properties && existingIndex > -1) state.properties![existingIndex] = newProperty;
      else state.properties!.push(newProperty);
    })
  }
  
  else state.properties = [...result];
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Handles the rejection of a property update operation.
 *
 * This reducer sets the status to 'failed'
 */
const  generalPropertyUpdateReject: ReducerFailed = (state) => {
  state.status = 'failed'
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




export const handleExtraReducers = (builder: ActionReducerMapBuilder<PropTypes.PropertyState>) => {
  builder
    .addCase(Thunks.fetchInvestorProperties.fulfilled, fetchInvestorPropertiesFulfilled)
    .addCase(Thunks.fetchInvestorProperties.rejected, generalPropertyUpdateReject)

    .addCase(Thunks.uploadPropertyFile.fulfilled, generalPropertyUpdateFulfilled)
    .addCase(Thunks.uploadPropertyFile.rejected, generalPropertyUpdateReject)

    .addCase(Thunks.updatePropertyByIdThunk.fulfilled, generalPropertyUpdateFulfilled)
    .addCase(Thunks.updatePropertyByIdThunk.rejected, generalPropertyUpdateReject)
    
    .addCase(Thunks.createPropertyThunk.fulfilled, generalPropertyUpdateFulfilled)
    .addCase(Thunks.createPropertyThunk .rejected, generalPropertyUpdateReject)
    

    .addCase(Thunks.getPropertyByIdThunk.fulfilled, generalPropertyUpdateFulfilled)
    .addCase(Thunks.getPropertyByIdThunk.rejected, generalPropertyUpdateReject)

    .addCase(Thunks.getInvestorPropertiesThunk.fulfilled, generalPropertyUpdateFulfilled)
    .addCase(Thunks.getInvestorPropertiesThunk.rejected, generalPropertyUpdateReject)

  
    .addMatcher(
      isAnyOf(
        Thunks.uploadPropertyFile.pending,
        Thunks.fetchInvestorProperties.pending,
        Thunks.updatePropertyByIdThunk.pending,
        Thunks.createPropertyThunk.pending,
        Thunks.getPropertyByIdThunk.pending,
        Thunks.getInvestorPropertiesThunk.pending,
      ),
      state => {state.status = 'pending';}
    );
};
