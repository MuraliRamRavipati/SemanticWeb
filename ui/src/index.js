import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {  BrowserRouter as Router, Routes ,Route } from 'react-router-dom';

import List from './List';
import Details from './Details';
const Routing = () => {
  return(
    <Router>
      <Routes>
          <Route exact path="/" element={<App />} />
          <Route exact path="/nations/:nation" element={<List type="nation-winners" />} />
          <Route exact path="/categories/:category" element={<List type="category-winners" />} />
          <Route exact path="/years/:year" element={<List type="year-winners" />} />
          <Route exact path="/years/:year/:category" element={<List type="year-category-winners" />} />
          <Route exact path="/details/:user" element={<Details />} />
      </Routes>
    </Router>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
