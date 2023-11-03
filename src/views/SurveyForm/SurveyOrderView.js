import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Container, Typography, Grid, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function SurveyOrderView() {
  const [orderData, setOrderData] = useState(null);
  let { surveyId } = useParams();
  surveyId = parseInt(surveyId, 10);

  const getOrders = () => {
    return axios
      .get(`/GetSurvey?surveyId=${surveyId}`, {
        withCredentials: true // Include credentials (cookies) with the request
      })
      .then((response) => {
        const oneOrder = response.data.findSurvey[0];
        if (oneOrder) {
          setOrderData(oneOrder);
        } else {
          throw new Error('No Order found');
        }
      })
      .catch((error) => {
        console.error('Error fetching order', error);
        throw error;
      });
  };

  useEffect(() => {
    getOrders()
      .then(() => {
        toast.success('Order Fetched Successfully!!');
      })
      .catch(() => {
        toast.error('Failed to fetch Order!!!');
      })
      .finally(() => {
        toast.dismiss();
      });
  }, []);

  //   const extractDate = (datetimeString) => {
  //     if (datetimeString) {
  //       const parts = datetimeString.split('T');
  //       if (parts.length > 0) {
  //         return parts[0];
  //       }
  //     }
  //     return '';
  //   };

  return (
    <>
      <Toaster />
      <Container maxWidth="md" style={{ padding: '17px' }}>
        <Typography variant="h4" align="center" style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '17px' }}>
          Survey Details
        </Typography>
        {orderData && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" style={{ fontSize: '26px', fontWeight: 'bold', marginTop: '17px', marginBottom: '17px' }}>
                Name: {orderData.name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                <strong>Survey ID:</strong> {orderData.surveyId}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                <strong>Department:</strong> {orderData.department}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                <strong>Email Address:</strong> {orderData.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                <strong>Mobile No:</strong> {orderData.mobileNo}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider style={{ marginTop: '20px' }}>
                {' '}
                <Typography variant="body1" style={{ fontSize: '22px' }}>
                  <strong>Products</strong>
                </Typography>
              </Divider>
            </Grid>
            <Grid container spacing={2} className="mt-2">
              {orderData.products.map((product, index) => (
                <Grid item xs={12} sm={6} key={product._id.$oid}>
                  <div className="bg-white border border-gray-300 rounded p-4 shadow-md">
                    <Typography variant="h6" className="text-lg font-bold mb-2">
                      Product Name: {product.productName}
                    </Typography>
                    <Typography variant="body1" className="text-base text-gray-500 mb-2">
                      <strong>Category:</strong> {product.productCategory}
                    </Typography>

                    <Typography variant="body1" className="text-base text-gray-500 mb-2">
                      <strong>Wanted Quantity:</strong> {product.productQuantity}
                    </Typography>
                  </div>
                  {(index + 1) % 2 === 0 && <div style={{ width: '100%', clear: 'both' }}></div>}
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
}
