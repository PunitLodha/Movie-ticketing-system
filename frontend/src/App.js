import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import 'react-slideshow-image/dist/styles.css'
import Home from './components/Home';
import Navbar from './components/Navbar';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
