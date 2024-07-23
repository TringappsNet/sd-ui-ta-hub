import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client

import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from "../src/GlobalRedux/store";
import { Container } from 'react-dom';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
