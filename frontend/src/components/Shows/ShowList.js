import React, { useEffect, useState } from 'react';
import Show from './Show';
import { postEndPoint } from '../utils/Requests';
import './showlist.css';
import { useLocation, useHistory } from 'react-router-dom';

const ShowList = () => {
  const location = useLocation();
  const history = useHistory();
  const { eventID } = location.state;

  const [shows, setShows] = useState([]);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await postEndPoint('/showlist/', { eventID: `${eventID}` }, null, history);
        const { data } = res;

        setShows(data.data.shows);
      } catch (e) {
        const status = e.response.status;
        if (status === 403 || status === 404) {
          console.log(e);
        }
      }
    };
    getDetails();
  }, [eventID, history]);

  return (
    <div className="showlist">
      <h2>Shows</h2>
      {shows.map((show) => (
        <Show show={show} />
      ))}
    </div>
  );
};

export default ShowList;
