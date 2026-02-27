import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from '@app/App';
import { RouterProvider } from '@app/providers/router';
import { StoreProvider } from '@app/providers/StoreProvider';
import './app/styles/global.scss';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
      <StoreProvider>
        <RouterProvider>
          <App />
        </RouterProvider>
      </StoreProvider>
  );
}
