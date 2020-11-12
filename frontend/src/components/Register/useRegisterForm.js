import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { postEndPoint } from '../utils/Requests';
// custom hook for form state management
const useForm = () => {
  const location = useLocation();
  let screenID,
    showID = null;
  if (location.state) {
    screenID = location.state.screenID;
    showID = location.state.showID;
  }

  // function to validate inputs, returns the error statements
  const validateInputs = (values) => {
    const err = {
      errors: false,
      name: ' ',
      mobile: ' ',
      email: ' ',
      password: ' ',
      confirmPassword: ' ',
    };

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      err.email = 'Please enter a valid email';
      err.errors = true;
    }
    if (values.password.length < 8) {
      err.password = 'Password should have more than 8 characters';
      err.errors = true;
    }
    if (values.confirmPassword !== values.password) {
      err.confirmPassword = 'Passwords do not match';
      err.errors = true;
    }

    Object.keys(values).forEach((key) => {
      if (values[key] === '') {
        err[key] = 'Please fill out this field';
        err.errors = true;
      }
    });

    return err;
  };

  const [values, setValues] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  /*   // toggle to show password on password input
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false); */

  // error messages to be added to the inputs
  const [error, setError] = useState({
    errors: false,
    name: ' ',
    mobile: ' ',
    email: ' ',
    password: ' ',
    confirmPassword: ' ',
  });

  // contains the error value. value depends on the response from server
  const [invalidCred, setInvalidCred] = useState('');
  // true only if submit button is pressed
  const [isSubmitting, setIsSubmitting] = useState(false);
  // true when waiting for an response from API
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  // function to post the credentials to the server, then user is redirected to home page.
  //  if credentials are invalid then invalidcred is set to appropriate errors got from API
  const apiFetch = async (formData) => {
    try {
      setIsLoading(true);
      await postEndPoint('/auth/users/register/', formData, null, history);
      setIsLoading(false);
      if (screenID) {
        history.push('/login', {
          screenID,
          showID,
        });
      } else {
        history.push('/');
      }
    } catch (e) {
      if (e.response.status === 403) {
        const responseError = e.response.data.error.msg;
        setInvalidCred(responseError);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // only runs if there are no errors and submit button is pressed
    // isSubmitting is used to avoid running on initial render
    if (!error.errors && isSubmitting) {
      const formData = {
        email: values.email,
        password: values.password,
        name: values.name,
        mobile: values.mobile,
      };
      // post data to server
      apiFetch(formData);
      setIsSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSubmitting]);

  /*  // function to toggle show password
  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleShowconfirmPassword = () => {
    setConfirmPassword((prevState) => !prevState);
  }; */

  // function to handle submit
  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    setError(validateInputs(values));
    setIsSubmitting(true);
  };

  // function to handle any change in inputs
  const handleChange = (event) => {
    // Use event.persist() to stop event pooling done by react
    event.persist();
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  return {
    handleChange,
    handleSubmit,
    error,
    invalidCred,
    setInvalidCred,
    values,
    /* showPassword,
    showConfirmPassword, */
    setError,
    /* toggleShowPassword,
    toggleShowconfirmPassword, */
    isLoading,
    screenID,
    showID,
  };
};

export default useForm;
