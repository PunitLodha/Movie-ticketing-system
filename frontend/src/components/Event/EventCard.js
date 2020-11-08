import React from 'react';
import './eventcard.css';
import { useHistory } from 'react-router-dom';
import { Posters } from '../PosterList';

const EventCard = ({ event }) => {
  const history = useHistory();
  const { name, genre, cast, director, description, eventID } = event;
  const handleClick = () => {
    history.push('/details', {
      eventID,
    });
  };
  return (
    <div className="event-card">
      <img src={`https://image.tmdb.org/t/p/w154${Posters[name]}`} alt="" />
      <div className="details">
        <h3>{name}</h3>
        <p>
          <span className="label">Genre:- </span> {genre}
        </p>
        {director ? (
          <p>
            <span className="label">Director:- </span> {director}
          </p>
        ) : null}
        {cast ? (
          <p>
            <span className="label">Cast:- </span> {cast}
          </p>
        ) : null}

        <p className="desc">{`${description.slice(0, 300)}...`}</p>
      </div>
      <div className="more">
        <button className="book" onClick={handleClick}>
          More Details
        </button>
      </div>
    </div>
  );
};

export default EventCard;
