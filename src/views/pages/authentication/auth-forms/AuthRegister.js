import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form, ErrorMessage, Field } from 'formik';

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AnimateButton from 'ui-component/extended/AnimateButton';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required').trim(),
  dept: Yup.string(),
  designation: Yup.string(),
  mNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits and should not contain characters')
    .required('Mobile Number is required'),
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: Yup.string().max(255).required('Password is required').matches(/^\S*$/, 'Password should not contain spaces'),
  confirmPass: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const initialValues = {
  username: '',
  fullName: '',
  dept: '',
  designation: '',
  mNumber: '',
  email: '',
  password: '',
  confirmPass: '',
  submit: null
};

const FirebaseRegister = () => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  useEffect(() => {
  }, []);

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      const response = await axios.post('/register', values,
      {
        withCredentials: true
      });
      if (response.data) {
        setStatus({ success: true });
        setRegistrationSuccess(true); 
        console.log('success', response.data);     
      } else {
        setErrors({ submit: 'Registration failed' });
      }
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };
  useEffect(() => {
  }, []);
  return (
    <>
  
      {registrationSuccess && (
        toast.success("Your request has been sent to the branch manager.")
      )}
      
<Toaster/>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form noValidate>
          <Grid container spacing={matchDownSM ? 0 : 2}>
            <Grid item xs={12}>
              <Field as={TextField} fullWidth label="Username" margin="normal" name="username" type="text" />
              <ErrorMessage name="username" component={FormHelperText} error />
            </Grid>
            <Grid item xs={12}>
              <Field as={TextField} fullWidth label="Name" margin="normal" name="fullName" type="text" />
            </Grid>
            <Grid item xs={12}>
              <Field as={TextField} fullWidth label="Department" margin="normal" name="dept" type="text" />
              <ErrorMessage name="dept" component={FormHelperText} error />
            </Grid>
            <Grid item xs={12}>
              <Field as={TextField} fullWidth label="Designation" margin="normal" name="designation" type="text" />
            </Grid>
            <Grid item xs={12}>
              <Field as={TextField} fullWidth label="Mobile Number" margin="normal" name="mNumber" type="text" />
              <ErrorMessage name="mNumber" component={FormHelperText} error />

            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Field as={TextField} fullWidth label="Email Address" margin="normal" id="outlined-adornment-email-register" type="email" name="email" />
                <ErrorMessage name="email" component={FormHelperText} error />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Field
                  as={TextField}
                  fullWidth label="Password"
                  id="outlined-adornment-password-register"
                  type={showPassword ? 'text' : 'password'}
                  margin="normal"
                  name="password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <ErrorMessage name="password" component={FormHelperText} error />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Field
                  as={TextField}
                  fullWidth label="Confirm Password"
                  id="outlined-adornment-confirm-password-register"
                  margin="normal"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPass"
                />
                <ErrorMessage name="confirmPass" component={FormHelperText} error />
              </FormControl>
            </Grid>
          </Grid>

          

          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <FormControlLabel control={<Checkbox name="checked" color="primary" />} label="Agree with&nbsp;Terms & Condition." />
            </Grid>
          </Grid>
          <ErrorMessage name="submit" component={FormHelperText} error />

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button fullWidth size="large" type="submit" color="secondary">
                Sign up
              </Button>
            </AnimateButton>
          </Box>
        </Form>
      </Formik>
    </>
  );
};
      

export default FirebaseRegister;
