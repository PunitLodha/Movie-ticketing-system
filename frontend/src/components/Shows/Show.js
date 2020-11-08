import React from 'react';
import './show.css';
import { useHistory } from 'react-router-dom';

const Show = ({ show }) => {
  const { theatreName, location, screenID, date, time, seats_avail, showID } = show;
  const parsedDate = new Date(date).toDateString();
  const parsedTime = new Date(time).getHours();

  const history = useHistory();

  const handleClick = (event) => {
    const userID = localStorage.getItem('userID');
    if (userID) {
      history.push('/book', {
        screenID,
        showID,
      });
    } else {
      history.push('/login', {
        screenID,
        showID,
      });
    }
  };

  return (
    <div className="show">
      <div className="details">
        <h3>
          {theatreName} <span className="loc">{location}</span>
        </h3>
        <p>
          <span className="label">Screen:- </span> {screenID}
        </p>
        <p>
          <span className="label">Date:- </span> {parsedDate}
        </p>
        <p>
          <span className="label">Timing:- </span> {parsedTime} hrs
        </p>
        <p>
          <span className="label">Seats Available:- </span> {seats_avail}
        </p>
      </div>
      <div>
        <button className="book" onClick={handleClick}>
          Book Tickets
        </button>
      </div>
    </div>
  );
};

export default Show;
