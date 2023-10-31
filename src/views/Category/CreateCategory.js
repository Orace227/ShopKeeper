import React from 'react';
import { Container, Typography, TextField, Button, Grid, FormLabel } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router';

const validationSchema = Yup.object().shape({
  products: Yup.array().of(
    Yup.object().shape({
      categoryName: Yup.string().required('Category Name is Required'),
      categoryImgName: Yup.string().required('Category Image Name is required')
    })
  )
});

const generateSixDigitNumber = () => {
  const min = 100000; // Smallest 6-digit number
  const max = 999999; // Largest 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const initialCategory = {
  categoryId: 0,
  categoryName: '',
  categoryImgName: '',
  categoryImgPath: '',
  categoryImg: null
};
const initialValues = {
  categories: [initialCategory]
};

const CreateCategory = () => {
  const Navigate = useNavigate();
  const handleSubmit = async (values) => {
    try {
      console.log('All categories:', values);
      const uploadPromises = values.categories.map(async (element) => {
        const formData = new FormData();
        formData.append('categoryImg', element.categoryImg);
        const uploadedImgPath = await axios.post('/upload-category-img', formData);
        if (uploadedImgPath) {
          console.log(uploadedImgPath.data);
          element.categoryImgPath = uploadedImgPath.data.path;
          element.categoryId = generateSixDigitNumber();
          delete element.categoryImg;
        }
      });

      await Promise.all(uploadPromises);
      console.log(values.categories);
      const createCategories = await axios.post('/createCategory', values.categories);
      if (createCategories) {
        console.log(createCategories.data);
        toast.success('Categories Created Successfully!!');
        Navigate('/Categories');
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
        Category Information
      </Typography>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            <FieldArray name="categories">
              {({ push, remove }) => (
                <div>
                  {values.categories.map((product, index) => (
                    <div key={index}>
                      <Typography variant="h4" className="mt-2" gutterBottom>
                        Category: {index + 1}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Field
                            name={`categories[${index}].categoryName`}
                            as={TextField}
                            label="Category Name"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`categories[${index}].categoryName`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <input
                            id={`categories[${index}].categoryImgName`}
                            name={`categories[${index}].categoryImgName`}
                            type="file"
                            onChange={(e) => {
                              setFieldValue(`categories[${index}].categoryImg`, e.currentTarget.files[0]);
                              setFieldValue(`categories[${index}].categoryImgName`, e.currentTarget.files[0].name);
                            }}
                            accept="image/*"
                            style={{ display: 'none' }}
                          />
                          <FormLabel htmlFor={`categories[${index}].categoryImgName`}>
                            <Button variant="outlined" component="span" fullWidth style={{ textTransform: 'none' }}>
                              Upload Category Image
                            </Button>
                          </FormLabel>
                          <div>
                            {values.categories[index].categoryImgName && (
                              <p style={{ margin: '0', paddingTop: '8px' }}>Selected Image: {values.categories[index].categoryImgName}</p>
                            )}
                          </div>
                          <ErrorMessage
                            name={`categories[${index}].categoryImgName`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button type="button" className="mb-3" variant="outlined" onClick={() => remove(index)}>
                            Remove Category
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                  <Button type="button" variant="outlined" onClick={() => push({ ...initialCategory })}>
                    Add Category
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

export default CreateCategory;
