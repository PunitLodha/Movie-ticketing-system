import React, { useEffect, useState } from 'react';
import './book.css';
import Seat from './Seat';
import { useLocation, useHistory } from 'react-router-dom';
import { postEndPoint } from '../utils/Requests';
import Modal from '../Modal/Modal';

const Book = () => {
  const location = useLocation();
  const history = useHistory();

  const { screenID, showID } = location.state;
  /* const [seats, setSeats] = useState('1');

  const handleChange = (event) => {
    setSeats(event.target.value);
  }; */

  const [selected, setSelected] = useState([]);
  const [price, setPrice] = useState(0);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState(false);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await postEndPoint(
          '/shows/screen/tickets/booked/',
          { screenID: `${screenID}` },
          null,
          history,
        );
        const { data } = res;
        setBookedSeats(data.data);
      } catch (e) {
        const status = e.response.status;
        if (status === 403 || status === 404) {
          console.log(e);
        }
      }
    };
    getDetails();
  }, [query, screenID, history]);

  const onSeatClick = (event) => {
    const target = event.target;
    target.classList.toggle('active');
    const row = target.dataset.row;
    const value = target.value;
    const seat = `${row}${value}`;
    console.log(row);
    if (selected.includes(seat)) {
      setPrice((prevState) => {
        return ['A', 'B', 'C'].includes(row) ? prevState - 200 : prevState - 500;
      });
      setSelected((prevState) => {
        const temp = [...prevState];
        return temp.filter((val) => val !== seat);
      });
    } else {
      setPrice((prevState) => {
        return ['A', 'B', 'C'].includes(row) ? prevState + 200 : prevState + 500;
      });
      setSelected((prevState) => [...prevState, seat]);
    }
  };

  const getSeats = (size, rowName, extra) =>
    Array(size)
      .fill(null)
      .map((_, index) => (
        <Seat
          key={`${rowName}${index + 1 + extra}`}
          value={index + 1 + extra}
          row={rowName}
          disabled={bookedSeats.includes(`${rowName}${index + 1 + extra}`)}
          onSeatClick={onSeatClick}
          active={selected.includes(`${rowName}${index + 1 + extra}`)}
        />
      ));

  const getRow = (rowName) => {
    return (
      <>
        {getSeats(4, rowName, 0)}
        <div></div>
        {getSeats(5, rowName, 4)}
        <div></div>
        {getSeats(4, rowName, 9)}
      </>
    );
  };

  const bookTicket = async () => {
    try {
      const userID = localStorage.getItem('userID');
      const selectedSeats = selected.map((seat) => {
        const ro = seat.substring(0, 1);
        const type = ['A', 'B', 'C'].includes(ro) ? 'Silver' : 'Gold';
        const price = ['A', 'B', 'C'].includes(ro) ? '200' : '500';
        return {
          seat_no: seat.substring(1),
          ro,
          type,
          price,
        };
      });
      const body = {
        no_seats: selected.length,
        userID,
        showID,
        seats: selectedSeats,
        screenID,
      };
      const res = await postEndPoint('/shows/ticket/', body, null, history);
      history.push('/payment', {
        price,
      });
    } catch (e) {
      const status = e.response.status;
      setShowModal(true);
      if (status === 403 || status === 404) {
        console.log(e);
      }
    }
  };

  const toggleModal = () => {
    setShowModal((prevState) => !prevState);
    setQuery((prevState) => !prevState);
    setSelected([]);
  };

  return (
    <div className="book-container">
      <h2>Screen {screenID}</h2>
      <Modal show={showModal} onClose={toggleModal}>
        Sorry, The seat has already been booked
      </Modal>
      {/* <div className="form-element">
        <label htmlFor="seats">No. of Seats</label>
        <select name="seats" id="seats-selection" value={seats} onChange={handleChange}>
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <option value={index + 1}>{index + 1}</option>
            ))}
        </select>
      </div> */}
      <div className="grid-container">
        <div className="seat-type">Silver (₹200)</div>
        <p>A</p>
        {getRow('A')}
        <p>B</p>
        {getRow('B')}
        <p>C</p>
        {getRow('C')}
        <div className="seat-type">Gold (₹500)</div>
        <p>D</p>
        {getRow('D')}
        <p>E</p>
        {getRow('E')}
        <p>F</p>
        {getRow('F')}
      </div>
      <h3>Total Price:- ₹{price} </h3>
      <button className="book" onClick={bookTicket}>
        Book
      </button>
    </div>
  );
};

export default Book;
