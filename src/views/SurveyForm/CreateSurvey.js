import React from 'react';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Your Name is Required'),
  department: Yup.string().required('Department is Required'),
  mobileNo: Yup.string()
    .matches(/^[0-9]*$/, 'Mobile No must contain only digits')
    .max(10, 'Mobile No must not exceed 10 characters'),
  email: Yup.string().email('Invalid email').required('Email Address is Required'),
  products: Yup.array().of(
    Yup.object().shape({
      productName: Yup.string().required('Product Name is Required'),
      productCategory: Yup.string().required('Product Category is Required'),
      productQuantity: Yup.number()
        .required('Product Quantity is required')
        .positive('Quantity must be positive')
        .integer('Quantity must be an integer')
    })
  )
});

const generateSixDigitNumber = () => {
  const min = 100000; // Smallest 6-digit number
  const max = 999999; // Largest 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const initialProduct = {
  productId: 0,
  productName: '',
  productCategory: '',
  productQuantity: 0,
  productImg: null
};

const initialValues = {
  surveyId: 0,
  empId: 0,
  name: '',
  department: '',
  mobileNo: '',
  email: '',
  products: [initialProduct]
};

const SurveyForm = () => {
  const handleSubmit = async (values) => {
    try {
      values.surveyId = generateSixDigitNumber();
      for (const product of values.products) {
        product.productId = generateSixDigitNumber();
      }
      console.log(values);
      const GetCartId = await axios.get('/GetCartId');
      console.log(GetCartId.data.cartId);
      const cartId = GetCartId.data.cartId;

      const emp = await axios.get(`/GetEmployees?cartId=${cartId}`);
      console.log(emp.data.findEmployees[0]);
      values.empId = await emp.data.findEmployees[0].empId;
      console.log(values);

      let canceled = confirm(`Are you sure you want to Submit this Survey Form ?`);
      if (canceled) {
        const createdSurvey = await axios.post('/CreateSurveyForm', values);
        if (createdSurvey) {
          console.log(createdSurvey);
          toast.success('Survey Submitted successfully!!');
          window.location.reload();
        }
      }
    } catch (err) {
      toast.error('Some error occurred while Submitting Survey Form!!!');
      console.error(err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Product Information
      </Typography>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field name={`name`} as={TextField} label="Your Name" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name={`name`} component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name={`department`} as={TextField} label="Department" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name={`department`} component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name={`mobileNo`} as={TextField} label="Mobile No" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name={`mobileNo`} component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name={`email`} as={TextField} label="Email Address" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name={`email`} component="div" className="error" style={{ color: 'red' }} />
              </Grid>
            </Grid>
            <FieldArray name="products">
              {({ push, remove }) => (
                <div>
                  {values.products.map((product, index) => (
                    <div key={index}>
                      <Typography variant="h4" className="mt-2" gutterBottom>
                        Add product Which you want next month
                      </Typography>
                      <Typography variant="h4" className="mt-2" gutterBottom>
                        Product: {index + 1}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name={`products[${index}].productName`}
                            as={TextField}
                            label="Product Name"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`products[${index}].productName`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name={`products[${index}].productCategory`}
                            as={TextField}
                            label="Product Category"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`products[${index}].productCategory`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name={`products[${index}].productQuantity`}
                            as={TextField}
                            label="Product Quantity"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`products[${index}].productQuantity`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button type="button" className="mb-3" variant="outlined" onClick={() => remove(index)}>
                            Remove Product
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                  <Button type="button" variant="outlined" onClick={() => push({ ...initialProduct })}>
                    Add Product
                  </Button>
                </div>
              )}
            </FieldArray>
            <Button type="submit" color="primary" size="large" style={{ marginTop: '1rem' }}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
      <Toaster />
    </Container>
  );
};

export default SurveyForm;
