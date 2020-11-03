import React from 'react';
import useForm from './useLoginForm';
import Spinner from '../Spinner/Spinner';
import './login.css';

const Login = () => {
  const { handleChange, handleSubmit, error, values, isLoading, invalidCred } = useForm();
  return (
    <div className="login">
      <div className="container">
        <h2>Login</h2>
        <p className="error">{isLoading ? <Spinner /> : invalidCred || ' '}</p>
        <form noValidate onSubmit={handleSubmit} autoComplete="off">
          <div className="form-element">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="login-email"
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
              id="login-password"
              name="password"
              onChange={handleChange}
              value={values.password}
            />
            <p className="error">{error.password || ' '}</p>
          </div>
          <input type="submit" className="submit" value="Submit" onSubmit={handleSubmit} />
        </form>
      </div>
    </div>
  );
};

export default Login;
