import React, { createContext, useState } from 'react';

export const LogContext = createContext();

const LogContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogIn = () => {
    setLoggedIn((prevState) => !prevState);
  };
  return <LogContext.Provider value={{ loggedIn, handleLogIn }}>{children}</LogContext.Provider>;
};

export default LogContextProvider;
