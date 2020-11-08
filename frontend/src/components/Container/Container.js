import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ShowList from '../Shows/ShowList';
import './container.css';
import EventDetails from '../Event/EventDetails';
import Book from '../Book/Book';
import Payment from '../Payment/Payment';
import Home from '../Home';
import MovieList from '../Event/MovieList';
import PlayList from '../Event/PlayList';
import TalkList from '../Event/TalkList';

const Container = () => {
  return (
    <div className="out-container">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/payment" component={Payment} />
        <Route exact path="/book" component={Book} />
        <Route exact path="/details" component={EventDetails} />
        <Route exact path="/shows" component={ShowList} />
        <Route exact path="/movies" component={MovieList} />
        <Route exact path="/plays" component={PlayList} />
        <Route exact path="/talk" component={TalkList} />
      </Switch>
    </div>
  );
};

export default Container;
