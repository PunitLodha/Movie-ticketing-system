import React from 'react';
import './seat.css';

const Seat = ({ value, onSeatClick, row, disabled }) => {
  return (
    <div className="seat-container">
      <input
        type="button"
        value={value}
        className="seat"
        data-row={row}
        onClick={onSeatClick}
        disabled={disabled}
      />
    </div>
  );
};

export default Seat;
