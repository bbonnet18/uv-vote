import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import About from './About';
import Confirm from './Confirm';
import Register from './Register';
import Buddy from './Buddy';
import Home from './Home';
import Info from './Info';
import Error from "./Error";
import Validate from "./Validate";
import FAQs from './FAQs';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, Route, RouterProvider, createRoutesFromElements } from 'react-router-dom';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Info />}/>
      <Route path="/getkey" element={<Register />}/>
      <Route path="/buddy" element={<Buddy />}/>
      <Route path="/votes" element={<Home />}/>
      <Route path="/confirm" element={<Confirm />}/>
      <Route path="/registration-error" element={<Error />}/>
      <Route path="/validate" element={<Validate />}/>
      <Route path="/faqs" element={<FAQs />}/>
      <Route path="/about" element={<About />}/>
    </Route>
  )
)


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
