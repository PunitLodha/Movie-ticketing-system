import React, { useEffect, useState } from 'react';
import { getEndPoint } from '../utils/Requests';
import './movielist.css';
import { useHistory } from 'react-router-dom';
import EventCard from './EventCard';

const MovieList = () => {
  const history = useHistory();

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await getEndPoint('/all_movies/', null, history);
        const { data } = res;
        setMovies(data.data.movie_results);
      } catch (e) {
        const status = e.response.status;
        if (status === 403 || status === 404) {
          console.log(e);
        }
      }
    };
    getDetails();
  }, [history]);

  return (
    <div className="movielist">
      <h2>All movies</h2>
      {movies.map((event) => (
        <EventCard event={event} />
      ))}
    </div>
  );
};

export default MovieList;
