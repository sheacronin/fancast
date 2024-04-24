import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Home, Book, Register, Login, Error } from './pages';
import { AuthProvider, UnauthenticatedRoute, userLoader } from './context';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.scss';

const router = createBrowserRouter([
  {
    loader: userLoader,
    element: <AuthProvider />,
    children: [
      {
        element: <App />,
        children: [
          {
            path: '/',
            element: <Home />,
          },
          {
            path: 'books/:id',
            element: <Book />,
          },
          {
            element: <UnauthenticatedRoute />,
            children: [
              {
                path: 'register',
                element: <Register />,
              },
              {
                path: 'login',
                element: <Login />,
              },
            ],
          },
        ],
      },
    ],
    errorElement: <Error />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
