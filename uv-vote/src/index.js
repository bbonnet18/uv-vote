import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import About from './About';
import Confirm from './Confirm';
import Feeds from './Feeds';
import Register from './Register';
import Buddy from './Buddy';
import Info from './Info';
import Error from "./Error";
import NotFound from './NotFound';
import NoKey from './NoKey'; 
import Validate from "./Validate";
import FAQs from './FAQs';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import ErrorView from "./ErrorView";
import { createBrowserRouter, Route, RouterProvider, createRoutesFromElements } from 'react-router-dom';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorView></ErrorView>}>
      <Route path="/" element={<Info />} />
      <Route path="/getkey" element={<Register />}/>
      <Route path="/buddy" element={<Buddy />}/>
      <Route path="/votes" element={<Feeds />}/>
      {/* <Route path="/actions" element={<Actions />}>
        <Route index element={<Choices />} />
        <Route path="conduit" element={<Conduit/>} />
      </Route> */}
      <Route path="/nokey" element={<NoKey />} />
      <Route path="/confirm" element={<Confirm />}/>
      <Route path="/registration-error" element={<Error />}/>
      <Route path="/validate" element={<Validate />}/>
      <Route path="/faqs" element={<FAQs />}/>
      <Route path="/about" element={<About />}/>
      <Route path="*" element={<NotFound></NotFound>} />
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
