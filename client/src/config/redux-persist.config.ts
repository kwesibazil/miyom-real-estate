import storage from 'redux-persist/lib/storage/session'
import { createTransform } from 'redux-persist';
import { DisplayState } from '@store/features/display/displayStore.interface';

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



//saved to session storage
const persistConfig = {
  storage,                            //👈 session storage
  key: 'root',                        //👈 key name in session storage
  whitelist: ['auth', 'property', 'display'],    //👈 only these properties will be persisted
  
  transforms: [displayTransform, ]
}

export default persistConfig