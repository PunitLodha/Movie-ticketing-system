import React, { useEffect, useState } from 'react';
import './payment.css';
import { useLocation, useHistory } from 'react-router-dom';
import { postEndPoint } from '../utils/Requests';

const Payment = () => {
  const location = useLocation();
  const history = useHistory();
  const { price } = location.state;
  const [card, setCard] = useState('');
  const [found, setFound] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const userID = localStorage.getItem('userID');
        const res = await postEndPoint(
          '/shows/ticket/payment/',
          { userID: `${userID}` },
          null,
          history,
        );
        const { data } = res;
        setCard(data.data.card_number);
        setFound(true);
        console.log(data);
      } catch (e) {
        const status = e.response.status;
        if (status === 403 || status === 404) {
          console.log(e);
        }
      }
    };
    getDetails();
  }, [history]);

  const handleChange = (event) => {
    setCard(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const saveCard = async () => {
    const cardRegex = RegExp(/[\d]{4}-[\d]{4}-[\d]{4}/);

    if (!found && cardRegex.test(card)) {
      try {
        const userID = localStorage.getItem('userID');
        const name = localStorage.getItem('name');
        const res = await postEndPoint(
          '/shows/ticket/payment/save/',
          { userID: `${userID}`, name: `${name}`, card_number: `${card}` },
          null,
          history,
        );
      } catch (e) {
        const status = e.response.status;
        if (status === 403 || status === 404) {
          console.log(e);
        }
      }
    }
    setPaid(true);
  };

  const goToHome = () => {
    history.push('/');
  };

  return (
    <div className="pay-container">
      {paid ? (
        <div className="payment">
          <h1>Payment Successful</h1>
          <h3>Thank you for payment!</h3>
          <input type="submit" className="pay-btn" value="Home" onClick={goToHome} />
        </div>
      ) : (
        <div className="payment">
          <h1>Checkout</h1>
          <h3>Total Price:- {price} </h3>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-element">
              <label htmlFor="card">Card Number</label>
              <input
                title="Credit card number"
                type="text"
                id="pay-card"
                name="card"
                pattern="[\d]{4}-[\d]{4}-[\d]{4}"
                onChange={handleChange}
                value={card}
                required
                maxLength={14}
              />
            </div>
            <div className="form-element">
              <label htmlFor="cvv">CVV</label>
              <input
                title="Credit card CVV"
                type="password"
                id="cvv"
                name="cvv"
                pattern="[\d]{3}"
                required
                maxLength={3}
              />
            </div>
            <input type="submit" className="pay-btn" value="Pay" onClick={saveCard} />
          </form>
        </div>
      )}
    </div>
  );
};

export default Payment;
