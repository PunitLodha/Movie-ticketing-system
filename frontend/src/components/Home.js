import React from 'react';
import './Home.css'
import { Zoom } from "react-slideshow-image";
//import image1 from "./images/slide_1.jpg";
import image2 from "./images/slide_2.jpg";
import image3 from "./images/slide_3.jpg";
import image4 from "./images/slide_4.jpg";
import image5 from "./images/slide_5.jpg";

// style was imported in index.css
// import "react-slideshow-image/dist/styles.css";

const images = [image2, image3, image4, image5];

const zoomOutProperties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  scale: 0.4,
  arrows: true
};

const Slideshow = () => {
  return (
    <div className="slide-container">
      <Zoom {...zoomOutProperties}>
        {images.map((each, index) => (
          <img key={index} style={{ width: "100%" }} src={each} />
        ))}
      </Zoom>
    </div>
  );
};

// ################################################################################################
const Home = () => {
  return (
    <div className="parent">
      <Slideshow />
      <div className="Cards">
        <h3>Movies to watch</h3>
        <div class="container">
        <div class="row">
            <div class="col-3">
                <div class="box">
                    <div class="icon">
                        <img src="./images/movieImage.jpg"></img>
                    </div>
                    <label>Movie 1</label>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut</p>
                </div>
            </div>
            <div class="col-3">
                <div class="box">
                    <div class="icon">
                        <img src="./images/movieImage.jpg"></img>
                    </div>
                    <label>Movie 2</label>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut</p>
                </div>
            </div>
            <div class="col-3">
                <div class="box">
                    <div class="icon">
                        <img src="frontend\src\components\images\movieImage.jpg"></img>
                    </div>
                    <label>Movie 3</label>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut</p>
                </div>
            </div>
            <div class="col-3">
                <div class="box">
                    <div class="icon">
                        <img src="./images/movieImage.jpg"></img>
                    </div>
                    <label>Movie 4</label>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
    <div class="row">
        <div class="col-3">
            <div class="box">
                <div class="icon">
                    <img src="./images/movieImage.jpg"></img>
                </div>
                <label>Movie 5</label>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut</p>
            </div>
        </div>
        <div class="col-3">
            <div class="box">
                <div class="icon">
                    <img src="./images/movieImage.jpg"></img>
                </div>
                <label>Movie 6</label>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut</p>
            </div>
        </div>
        <div class="col-3">
            <div class="box">
                <div class="icon">
                    <img src="frontend\src\components\images\movieImage.jpg"></img>
                </div>
                <label>Movie 7</label>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut</p>
            </div>
        </div>
        <div class="col-3">
            <div class="box">
                <div class="icon">
                    <img src="./images/movieImage.jpg"></img>
                </div>
                <label>Movie 8</label>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
                </div>
            </div>
        </div>
    </div>


        </ div>
    </div>
  );
};

export default Home;
