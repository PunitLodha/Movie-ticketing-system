import React, { useEffect } from 'react';
import './seat.css';

const Seat = ({ value, onSeatClick, row, disabled, active }) => {
  const classes = active ? 'active' : null;

  return (
    <div className="seat-container">
      <input
        type="button"
        value={value}
        className={`seat ${classes}`}
        data-row={row}
        onClick={onSeatClick}
        disabled={disabled}
      />
    </div>
  );
};

export default Seat;
