import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
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
  empId: Yup.number()
    .integer('Employee ID must be a number')
    .positive('Employee ID must be a positive number')
    .required('Employee ID is required'),
  username: Yup.string().required('Username is required').trim(),
  dept: Yup.string().required('Department is required'),
  designation: Yup.string(),
  mNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits and should not contain characters')
    .required('Mobile Number is required'),
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: Yup.string().max(255).required('Password is required'),
  confirmPass: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required')
});

const initialValues = {
  empId: '',
  username: '',
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
  const [isSubmitting, setIsSubmitting] = useState(true);

  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      const response = await axios.post('/register', values, {
        withCredentials: true
      });
      if (response.data) {
        // Registration was successful
        setStatus({ success: true });
        console.log('success', response.data);
        navigate('/dashboard');
      } else {
        // Handle registration error
        setErrors({ submit: 'Registration failed' });
      }
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      if (error.response.status === 400) {
        toast.error('User already exist!!!');
        setErrors({ submit: 'User already exist!!! Change your email to continue' });
      }

      if (error.response.status === 500) {
        toast.error('username already exists!!!');
        setErrors({ submit: 'username already exists!!!!!! Change your username to continue' });
      }
      // setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Toaster />
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form noValidate>
          <Grid container spacing={matchDownSM ? 0 : 2}>
            <Grid item xs={12}>
              <Field as={TextField} fullWidth label="Employee ID" margin="normal" name="empId" type="number" />
              <ErrorMessage name="empId" component={FormHelperText} error />
            </Grid>
            <Grid item xs={12}>
              <Field as={TextField} fullWidth label="Username" margin="normal" name="username" type="text" />
              <ErrorMessage name="username" component={FormHelperText} error />
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
              <Field as={TextField} fullWidth label="email" margin="normal" name="email" type="text" />
              <ErrorMessage name="email" component={FormHelperText} error />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Field
                  label="Password"
                  as={TextField}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  InputProps={{
                    endAdornment: (
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
                    )
                  }}
                />
                <ErrorMessage name="password" component={FormHelperText} error />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Field
                  label="Confirm Password"
                  as={TextField}
                  id="outlined-adornment-confirm-password-register"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPass"
                  InputProps={{
                    endAdornment: (
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
                    )
                  }}
                />
                <ErrorMessage name="confirmPass" component={FormHelperText} error />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    name="checked"
                    color="primary"
                    onChange={() => {
                      setIsSubmitting(!isSubmitting);
                    }}
                  />
                }
                label="Agree with&nbsp;Terms & Condition."
              />
            </Grid>
          </Grid>
          <ErrorMessage name="submit" component={FormHelperText} error />

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
        </Form>
      </Formik>
    </>
  );
};

export default FirebaseRegister;
