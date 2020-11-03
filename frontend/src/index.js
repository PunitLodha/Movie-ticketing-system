import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import App from './App';
import reportWebVitals from './reportWebVitals';

axios.defaults.baseURL = 'http://localhost:8000/api/';

// Add a request interceptor
/* axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const tokenConfig = config;
    const token = localStorage.getItem('token');
    if (token) {
      tokenConfig.headers.Authorization = `Token ${token}`;
    }
    return tokenConfig;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
); */

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
