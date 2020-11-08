import React, { useEffect, useState } from 'react';
import './Home.css';
import { Zoom } from 'react-slideshow-image';
//import image1 from "./images/slide_1.jpg";
import image2 from './images/slide_2.jpg';
import image3 from './images/slide_3.jpg';
import image4 from './images/slide_4.jpg';
import image5 from './images/slide_5.jpg';
import movieImg from './images/movieImage.jpg';

// style was imported in index.css
// import "react-slideshow-image/dist/styles.css";
import { useHistory } from 'react-router-dom';
import { getEndPoint } from './utils/Requests';
import { Posters } from './PosterList';

const images = [
  'https://image.tmdb.org/t/p/w1280/xJWPZIYOEFIjZpBL7SVBGnzRYXp.jpg',
  'https://image.tmdb.org/t/p/w1280/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg',
  'https://image.tmdb.org/t/p/w1280/4pfXAnWxOfEJsUgDPW0zqzs5UWv.jpg',
  'https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
];

const zoomOutProperties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  scale: 0.4,
  arrows: true,
};

const Slideshow = () => {
  return (
    <div className="slide-container">
      <Zoom {...zoomOutProperties}>
        {images.map((each, index) => (
          <img key={index} style={{ width: '100%' }} src={each} />
        ))}
      </Zoom>
    </div>
  );
};

// ################################################################################################
const Home = () => {
  const history = useHistory();

  const [movie, setMovie] = useState([]);
  const [play, setPlay] = useState([]);
  const [show, setShow] = useState([]);

  useEffect(() => {
    try {
      const getData = async () => {
        const res = await getEndPoint('/topmovies', null, history);
        const { data } = res;
        setMovie(data.data.movie);
        setPlay(data.data.play);
        setShow(data.data.talk_show);
      };
      getData();
    } catch (e) {
      const status = e.response.status;
      if (status === 403 || status === 404) {
        console.log(e);
      }
    }
  }, [history]);

  const handleClick = (eventID) => {
    history.push('/details', {
      eventID,
    });
  };

  return (
    <div className="parent">
      <Slideshow />
      <div className="Cards">
        <h3>Top movies</h3>
        <div class="container">
          <div class="row">
            {movie[0]
              ? movie.map((val) => (
                  <div class="col-3">
                    <div
                      class="box"
                      onClick={() => {
                        handleClick(val.eventID);
                      }}
                    >
                      <div class="icon">
                        <img src={`https://image.tmdb.org/t/p/w185${Posters[val.name]}`}></img>
                      </div>
                      <label>{val.name}</label>
                      <p>{`${val.description.slice(0, 120)}...`}</p>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
        <h3>Top plays</h3>
        <div class="container">
          <div class="row">
            {play[0]
              ? play.map((val) => (
                  <div class="col-3">
                    <div
                      class="box"
                      onClick={() => {
                        handleClick(val.eventID);
                      }}
                    >
                      <div class="icon">
                        <img src={`https://image.tmdb.org/t/p/w185${Posters[val.name]}`}></img>
                      </div>
                      <label>{val.name}</label>
                      <p>{`${val.description.slice(0, 120)}...`}</p>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
        <h3>Top shows</h3>
        <div class="container">
          <div class="row">
            {show[0]
              ? show.map((val) => (
                  <div class="col-3">
                    <div
                      class="box"
                      onClick={() => {
                        handleClick(val.eventID);
                      }}
                    >
                      <div class="icon">
                        <img src={`https://image.tmdb.org/t/p/w185${Posters[val.name]}`}></img>
                      </div>
                      <label>{val.name}</label>
                      <p>{`${val.description.slice(0, 120)}...`}</p>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
