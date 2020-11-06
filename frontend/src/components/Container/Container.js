import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ShowList from '../Shows/ShowList';
import './container.css';
import EventDetails from '../Event/EventDetails';
import Book from '../Book/Book';
import Payment from '../Payment/Payment';
import Home from '../Home';

const Container = () => {
  return (
    <div className="out-container">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/payment" component={Payment} />
        <Route exact path="/book" component={Book} />
        <Route exact path="/details" component={EventDetails} />
        <Route exact path="/shows" component={ShowList} />
      </Switch>
    </div>
  );
};

export default Container;
