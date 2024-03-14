import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { Box, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  // const navigate = useNavigate();
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  /* eslint-disable no-unused-vars */
  // const handleLogin = async (values, {setStatus}) => {
  //   try {
  //     const response = await fetch('http://localhost:4469/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         email: values.email,
  //         password: values.password,
  //       })
  //     });

  //     if (response.ok) {
  //       setStatus({ success: true });
  //       console.log("success");
  //     } else {
  //       const data = await response.json();
  //       setStatus({ success: false });
  //       setErrors({ submit: data.error || 'Login failed' });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setStatus({ success: false });
  //     setErrors({ submit: err.message });
  //   }
  // };
  // const handleSuccessfulLogin = () => {
  //   // Redirect to the home page
  //   navigate.push('/dashboard');
  // }

  const handleSubmit = async (values, setErrors, setStatus, setSubmitting) => {
    try {
      const response = await axios.post(
        '/login',
        { email: values.email, password: values.password },
        {
          withCredentials: true
        }
      );

      if (response.data) {
        setStatus({ success: true });
        console.log(response.data);
        navigate('/dashboard');
      } else {
        // Handle server error
        setStatus({ success: false });
        setErrors({ submit: 'Server error' });
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 400) {
        toast.error('User already exist!!!');
        setErrors({ submit: 'User already exist!!! Change your email to continue' });
      } else if (error.response.status === 401) {
        toast.error('Check your Credentials!!!');
        setErrors({ submit: 'Check your Credentials!!!' });
      } else if (error.response.status === 404) {
        toast.error('User not found!!!');
        setErrors({ submit: 'User not found!!!' });
      }
      if (error.response.status === 500) {
        toast.error('username already exists!!!');
        setErrors({ submit: 'username already exists!!!!!! Change your username to continue' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Toaster />
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const loginResult = await handleSubmit(values, setErrors, setStatus, setSubmitting);
            if (loginResult) {
              setSubmitting(false);
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
            }
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address / Username"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                  className="bg-purple-700 hover:bg-purple-500"
                >
                  Signup
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
