import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';

const AddCategoryAndProductForm = () => {
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState('');

  const handleSubmit = async (values) => {
    // Add the category and product to the database.
  };

  return (
    <Formik
      initialValues={{
        category: category,
        product: product,
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        <Field name="category">
          {({ field, form }) => (
            <input
              type="text"
              placeholder="Category"
              {...field}
            />
          )}
        </Field>
        <Field name="product">
          {({ field, form }) => (
            <input
              type="text"
              placeholder="Product"
              {...field}
            />
          )}
        </Field>
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default AddCategoryAndProductForm;