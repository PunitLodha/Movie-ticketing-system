import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'react-slideshow-image/dist/styles.css';
import Navbar from './components/Navbar';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import './App.css';
import Container from './components/Container/Container';
import LogContextProvider from './components/LogContext';

function App() {
  const routes = ['/', '/payment', '/book', '/details', '/shows', '/movies', '/plays', '/talk'];
  return (
    <LogContextProvider>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path={routes} component={Container} />
        </Switch>
      </Router>
    </LogContextProvider>
  );
}

export default App;
