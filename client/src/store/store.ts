import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session'; // or use storage for localStorage
import { PersistConfig, createTransform } from 'redux-persist';


import { DisplayState } from './features/display/displayStore.interface';
import { errorMiddleware } from "./globalErrorMiddleware";


// reducers
import authReducer from './features/auth/AuthSlice.store';
import displayReducer from './features/display/DisplaySlice.store';
import propertyReducer from './features/property/PropertySlice.store';



const displayTransform = createTransform(
  (inboundState:DisplayState) => {
    return {
      theme: inboundState.theme,
      sideNavCollapse: inboundState.sideNavCollapse,
      viewed: inboundState.viewed,
      showForm: {},
    };
  },
  null, 
  { whitelist: ['display'] } 
);



const rootReducer = combineReducers({
  auth: authReducer,
  display: displayReducer,
  property: propertyReducer,
});



const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: storageSession,
  whitelist: ['auth', 'display', 'property'],
  transforms: [displayTransform, ]
};



const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(errorMiddleware),  
  });
  

  
  export type RootState = ReturnType<typeof rootReducer>;
  export type AppDispatch = typeof store.dispatch;
  export const persistor = persistStore(store);  
