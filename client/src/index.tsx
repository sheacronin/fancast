import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Home, Book, Register, Login } from './pages';
import { AuthProvider } from './context';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthProvider />,
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          {
            path: '/',
            element: <Home />,
          },
          {
            path: '/books/:id',
            element: <Book />,
          },
          {
            path: '/register',
            element: <Register />,
          },
          {
            path: '/login',
            element: <Login />,
          },
        ],
      },
    ],
  },
  // TODO: errorElement: <Error />
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
