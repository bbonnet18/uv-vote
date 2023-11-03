import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Confirm from './Confirm';
import Register from './Register';
import Home from './Home';
import Info from './Info';
import About from './About';
import ErrorPage from './error-page';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path:'/',
    element:<App />,
    errorElement:<ErrorPage />,
    children:[
      {
        path:'/',
        element:<Info />
      },
      {
        path:"getkey",
        element:<Register />
      },
      {
        path:"votes",
        element:<Home />
      },
      {
        path:"about",
        element:<About />
      },
      {
        path:"confirm",
        element: <Confirm />
      }
    ]

  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
