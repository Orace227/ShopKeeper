import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const UpdatePass = () => {
  const initialValues = {
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleSubmit = (values) => {
    // Add your password update logic here
    console.log(values);
  };

  return (
    <div className=" max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Update Password</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block font-semibold">Change Password</label>
              <Field type="password" name="newPassword" className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400" />
              <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block font-semibold">Confirm Changed Password</label>
              <Field type="password" name="confirmPassword" className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400" />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-3 rounded hover:bg-blue-700" disabled={isSubmitting}>
              Update Password
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdatePass;
