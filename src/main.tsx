import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StyledEngineProvider } from '@mui/material';
import { store } from './app/store/store.ts';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './component/ErrorPage.tsx';
import Exam from './component/Exam.tsx';
import SetupForm from './component/SetupForm.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/setup',
        element: <SetupForm />,
      },
      {
        path: '/exam',
        element: <Exam />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <RouterProvider router={router} />
      </StyledEngineProvider>
    </Provider>
  </React.StrictMode>
);
