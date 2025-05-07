import { StrictMode } from 'react'
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import {store, persistor } from '@store/store';
import router from './router/router';
import '@assets/css/styles.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>                                       { /*👈 react-redux */ }
      <PersistGate loading={null} persistor={persistor}>           { /*👈 react-persist */ }
        <RouterProvider router={router} />                         { /*👈 react-router */ }
      </PersistGate>    
    </Provider>
  </StrictMode>,
)

