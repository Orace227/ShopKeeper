import React from 'react';
import { Container, Typography, TextField, Button, Grid, Select, FormControl, MenuItem, InputLabel, FormLabel } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router';

const validationSchema = Yup.object().shape({
  products: Yup.array().of(
    Yup.object().shape({
      productName: Yup.string().required('Product Name is Required'),
      description: Yup.string().required('Product Description is Required'),
      category: Yup.string().required('Category is required'),
      quantityInStock: Yup.number().required('Product Quantity is required').positive().integer(),
      productImgName: Yup.string().required('Product Image Name is required')
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
  description: '',
  category: '',
  quantityInStock: '',
  productImgName: '',
  productImgPath: '',
  productImg: null
};

const initialValues = {
  products: [initialProduct]
};

const CreateProducts = () => {
  const Navigate = useNavigate();
  const handleSubmit = async (values) => {
    try {
      console.log('All Products:', values);
      const uploadPromises = values.products.map(async (element) => {
        const formData = new FormData();
        formData.append('productImg', element.productImg);
        const uploadedImgPath = await axios.post('/upload-product-img', formData);
        if (uploadedImgPath) {
          console.log(uploadedImgPath.data);
          element.productImgPath = uploadedImgPath.data.path;
          element.productId = generateSixDigitNumber();
          delete element.productImg;
        }
      });

      await Promise.all(uploadPromises);
      console.log(values.products);
      const createProducts = await axios.post('/createProducts', values.products);
      if (createProducts) {
        console.log(createProducts.data);
        toast.success('Products Created Successfully!!');  
        Navigate('/Products');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const handleMobileKeyPress = (event) => {
  //   if (!/^\d+$/.test(event.key)) {
  //     event.preventDefault();
  //   }
  // };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Product Information
      </Typography>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            <FieldArray name="products">
              {({ push, remove }) => (
                <div>
                  {values.products.map((product, index) => (
                    <div key={index}>
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
                            name={`products[${index}].description`}
                            as={TextField}
                            label="Product Description"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`products[${index}].description`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel htmlFor={`products[${index}].category`}>Select Category</InputLabel>
                            <Field
                              label="Select Category"
                              name={`products[${index}].category`}
                              as={Select}
                              inputProps={{
                                id: `products[${index}].category`,
                                shrink: true
                              }}
                            >
                              <MenuItem value="Option1">Option 1</MenuItem>
                              <MenuItem value="Option2">Option 2</MenuItem>
                              <MenuItem value="Option3">Option 3</MenuItem>
                            </Field>
                          </FormControl>
                          <ErrorMessage name={`products[${index}].category`} component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name={`products[${index}].quantityInStock`}
                            as={TextField}
                            label="Product Quantity"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            type="number"
                            inputProps={{
                              inputMode: 'numeric',
                              min: 1
                            }}
                          />
                          <ErrorMessage
                            name={`products[${index}].quantityInStock`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <input
                            id={`products[${index}].productImgName`}
                            name={`products[${index}].productImgName`}
                            type="file"
                            onChange={(e) => {
                              setFieldValue(`products[${index}].productImg`, e.currentTarget.files[0]);
                              setFieldValue(`products[${index}].productImgName`, e.currentTarget.files[0].name);
                            }}
                            accept="image/*"
                            style={{ display: 'none' }}
                          />
                          <FormLabel htmlFor={`products[${index}].productImgName`}>
                            <Button variant="outlined" component="span" fullWidth style={{ textTransform: 'none' }}>
                              Upload Product Image
                            </Button>
                          </FormLabel>
                          <div>
                            {values.products[index].productImgName && (
                              <p style={{ margin: '0', paddingTop: '8px' }}>Selected Image: {values.products[index].productImgName}</p>
                            )}
                          </div>
                          <ErrorMessage
                            name={`products[${index}].productImgName`}
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

export default CreateProducts;
