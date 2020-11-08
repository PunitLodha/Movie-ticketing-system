import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { postEndPoint } from '../utils/Requests';
import './eventDetails.css';

const EventDetails = () => {
  const location = useLocation();
  const history = useHistory();
  const { eventID } = location.state;

  const [event, setEvent] = useState({});

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await postEndPoint('/shows/event/', { eventID: `${eventID}` }, null, history);
        const { data } = res;
        setEvent(data.data);
      } catch (e) {
        const status = e.response.status;
        if (status === 403 || status === 404) {
          console.log(e);
        }
      }
    };
    getDetails();
  }, [eventID, history]);

  const handleClick = (event) => {
    history.push('/shows', {
      eventID,
    });
  };

  return (
    <>
      {event.eventID ? (
        <div className="event">
          <div className="details">
            <h1>{event.name}</h1>
            <p className="sub">
              <span>{event.genre} | </span>
              <span>{event.lang} | </span>
              <span>{event.duration} mins | </span>
              <span>{event.rating}</span>
            </p>
            {event.cast ? (
              <p className="cast">
                Cast:- <span className="names">{event.cast}</span>
              </p>
            ) : null}
            <p className="desc">{event.description}</p>
            <button className="book" onClick={handleClick}>
              Check shows
            </button>
          </div>
          <div className="poster">
            <img
              src="https://image.tmdb.org/t/p/w342/5KCVkau1HEl7ZzfPsKAPM0sMiKc.jpg"
              alt="poster"
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default EventDetails;
