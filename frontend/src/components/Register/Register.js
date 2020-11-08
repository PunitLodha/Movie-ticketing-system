import React from 'react';
import useForm from './useRegisterForm';
import Spinner from '../Spinner/Spinner';
import './register.css';
import { Link } from 'react-router-dom';

const Register = () => {
  const {
    handleChange,
    handleSubmit,
    error,
    values,
    isLoading,
    invalidCred,
    screenID,
    showID,
  } = useForm();
  return (
    <div className="register">
      <div className="container">
        <h3>Register</h3>
        <p className="error">{isLoading ? <Spinner /> : invalidCred || ' '}</p>
        <form noValidate onSubmit={handleSubmit} autoComplete="off">
          <div className="form-element">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="register-name"
              name="name"
              onChange={handleChange}
              value={values.name}
            />
            <p className="error">{error.name || ' '}</p>
          </div>
          <div className="form-element">
            <label htmlFor="mobile">Mobile</label>
            <input
              type="text"
              id="register-mobile"
              name="mobile"
              onChange={handleChange}
              value={values.mobile}
            />
            <p className="error">{error.mobile || ' '}</p>
          </div>
          <div className="form-element">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="register-email"
              name="email"
              onChange={handleChange}
              value={values.email}
            />
            <p className="error">{error.email || ' '}</p>
          </div>
          <div className="form-element">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="register-password"
              name="password"
              onChange={handleChange}
              value={values.password}
            />
            <p className="error">{error.password || ' '}</p>
          </div>
          <div className="form-element">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="register-confirm-password"
              name="confirmPassword"
              onChange={handleChange}
              value={values.confirmPassword}
            />
            <p className="error">{error.confirmPassword || ' '}</p>
          </div>
          <input className="submit" type="submit" value="Submit" onSubmit={handleSubmit} />
        </form>
        <Link
          to={{
            pathname: '/login',
            state: { screenID, showID },
          }}
        >
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
