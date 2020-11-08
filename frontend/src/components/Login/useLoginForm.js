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
    let errors1 = false;
    let password1 = ' ';
    let email1 = ' ';

    if (values.email === '') {
      errors1 = true;
      email1 = 'Please fill out this field';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors1 = true;
      email1 = 'Please enter a valid email';
    }
    if (values.password === '') {
      errors1 = true;
      password1 = 'Please fill out this field';
    } else if (values.password.length < 8) {
      errors1 = true;
      password1 = 'Password should have more than 8 characters';
    }

    return {
      errors: errors1,
      email: email1,
      password: password1,
    };
  };

  // values of email and password
  const [values, setValues] = useState({ email: '', password: '' });

  /*   // toggle to show password on password input
  const [showPassword, setShowPassword] = useState(false); */

  // error messages to be added to the inputs
  const [error, setError] = useState({
    errors: false,
    email: ' ',
    password: ' ',
  });
  // contains the error value. value depends on the response from server
  const [invalidCred, setInvalidCred] = useState('');

  // true only if submit button is pressed
  const [isSubmitting, setIsSubmitting] = useState(false);
  // true when waiting for an response from API
  const [isLoading, setIsLoading] = useState(false);

  // used to programmatically change the url
  const history = useHistory();

  // function to post the credentials to the server. if credentials are valid then we get a token,
  // which is stored in localStorage and then user is redirected to homepage.
  //  if credentials are invalid then invalidcred is set to appropriate errors got from API

  const apiFetch = async (formData) => {
    try {
      setIsLoading(true);
      const response = await postEndPoint('/auth/users/login/', formData, null, history);

      const { data } = response;
      console.log(data);
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('isAdmin', data.data.user.isAdmin);
      localStorage.setItem('email', data.data.user.email);
      localStorage.setItem('userID', data.data.user.userID);
      localStorage.setItem('mobile', data.data.user.mobile);
      localStorage.setItem('name', data.data.user.name);
      setIsLoading(false);
      if (screenID) {
        history.push('/book', {
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
      };
      // post data to server
      apiFetch(formData);
      setIsSubmitting(false);
      // reset inputs
      // setValues((prevState) => ({ ...prevState, email: '', password: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSubmitting]);

  /*  // function to toggle show password
  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };
 */
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
    values,
    /*    showPassword,
    toggleShowPassword, */
    isLoading,
    screenID,
    showID,
  };
};

export default useForm;
