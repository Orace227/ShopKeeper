import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Customization from 'layout/Customization';
import { Google } from '@mui/icons-material';
import axios from 'axios';

const validDepartments = ['Dept1', 'Dept2'];

const validationSchema = Yup.object().shape({
  empId: Yup.number()
    .integer('Employee ID must be a number')
    .positive('Employee ID must be a positive number')
    .required('Employee ID is required'),
  username: Yup.string().required('Username is required').trim(),
  dept: Yup.string().required('Department is required').oneOf(validDepartments, 'Invalid department'),
  designation: Yup.string(),
  mNumber: Yup.string(),
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
  // const [checked, setChecked] = useState(true);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const googleHandler = async () => {
    console.error('Register');
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('123456');
  }, []);

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      const response = await axios.post('/register', values,
      {
        withCredentials: true
      });
      if (response.data) {
        // Registration was successful
        setStatus({ success: true });
        console.log('success', response.data);
        navigate("/dashboard");
      } else {
        // Handle registration error
        setErrors({ submit: 'Registration failed' });
      }
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              variant="outlined"
              fullWidth
              onClick={googleHandler}
              size="large"
              sx={{
                color: 'grey.700',
                backgroundColor: theme.palette.grey[50],
                borderColor: theme.palette.grey[100]
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
              </Box>
              Sign up with Google
            </Button>
          </AnimateButton>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ alignItems: 'center', display: 'flex' }}>
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
            <Button
              variant="outlined"
              sx={{
                cursor: 'unset',
                m: 2,
                py: 0.5,
                px: 7,
                borderColor: `${theme.palette.grey[100]} !important`,
                color: `${theme.palette.grey[900]}!important`,
                fontWeight: 500,
                borderRadius: `${Customization.borderRadius}px`
              }}
              disableRipple
              disabled
            ></Button>
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign up with Email address</Typography>
          </Box>
        </Grid>
      </Grid>

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
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-email-register">Email Address</InputLabel>
                <Field as={TextField} id="outlined-adornment-email-register" type="email" name="email" />
                <ErrorMessage name="email" component={FormHelperText} error />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                <Field
                  as={TextField}
                  id="outlined-adornment-password-register"
                  type={showPassword ? 'text' : 'password'}
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
                <InputLabel htmlFor="outlined-adornment-confirm-password-register">Confirm Password</InputLabel>
                <Field
                  as={TextField}
                  id="outlined-adornment-confirm-password-register"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPass"
                />
                <ErrorMessage name="confirmPass" component={FormHelperText} error />
              </FormControl>
            </Grid>
          </Grid>

          {strength !== 0 && (
            <FormControl fullWidth>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" fontSize="0.75rem">
                      {level?.label}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </FormControl>
          )}

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
