import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Container, Typography, Grid, Divider, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function ReadCustomerData() {
  const [customerList, setCustomerList] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  let { clientId } = useParams();
  clientId = parseInt(clientId, 10);

  const getCustomer = () => {
    return axios
      .get(`/getClientsById?clientId=${clientId}`)
      .then((response) => {
        const oneClient = response.data.OneClient[0];
        if (oneClient) {
          console.log(oneClient);
          setCustomerList(oneClient);
        } else {
          throw new Error('No customer found');
        }
      })
      .catch((error) => {
        console.error('Error fetching customer', error);
        throw error;
      });
  };

  const getFamilyMembers = () => {
    return axios
      .get(`/getFamilyMembers?id=${clientId}`)
      .then((response) => {
        const allFamilyMembers = response.data.allFamilyMembers;
        if (allFamilyMembers) {
          console.log(allFamilyMembers);
          setFamilyMembers(allFamilyMembers);
        } else {
          throw new Error('No family members found');
        }
      })
      .catch((error) => {
        console.error('Error fetching family members', error);
        throw error;
      });
  };

  useEffect(() => {
    getCustomer()
      .then(() => {
        toast.success('Customer Fetched Successfully!');
      })
      .catch(() => {
        toast.error('Failed to fetch customer!');
      })
      .finally(() => {
        toast.dismiss();
      });
    getFamilyMembers();
  }, []);

  const extractDate = (datetimeString) => {
    if (datetimeString) {
      const parts = datetimeString.split('T');
      if (parts.length > 0) {
        return parts[0];
      }
    }
    return '';
  };

  const renderFrequentFlyerNumbers = (flyers) => {
    if (!flyers || flyers.length === 0) {
      return null;
    }

    return (
      <Grid item xs={12}>
        <Divider style={{ marginTop: '40px' }}>
          <Typography variant="body1" style={{ fontSize: '22px', marginBottom: '10px' }}>
            <strong>Frequent Flyer Numbers</strong>
          </Typography>
        </Divider>
        <Grid container spacing={2}>
          {flyers.map((flyer, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                {index + 1}. <strong>Type:</strong> {flyer?.type}
              </Typography>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                <strong>Number:</strong> {flyer?.number}
              </Typography>
              <div style={{ margin: '10px' }}></div>
            </Grid>
          ))}
          {/* <Grid item xs={12}>
            <Divider style={{ marginTop: '20px' }} />
          </Grid> */}
        </Grid>
      </Grid>
    );
  };

  const renderHotelLoyaltyNumbers = (loyalties) => {
    if (!loyalties || loyalties.length === 0) {
      return null;
    }

    return (
      <Grid item xs={12}>
        <Divider style={{ marginTop: '40px' }}>
          <Typography variant="body1" style={{ fontSize: '22px', marginBottom: '10px' }}>
            <strong>Hotel Loyalty Numbers</strong>
          </Typography>
        </Divider>
        <Grid container spacing={2}>
          {loyalties.map((loyalty, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                {index + 1}. <strong>Type:</strong> {loyalty?.type}
              </Typography>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                <strong>Number:</strong> {loyalty?.number}
              </Typography>
              <div style={{ margin: '10px' }}></div>
            </Grid>
          ))}
          {/* <Grid item xs={12}>
            <Divider style={{ marginTop: '20px' }} />
          </Grid> */}
        </Grid>
      </Grid>
    );
  };

  const renderDocuments = (Documents) => {
    if (!Documents || Documents.length === 0) {
      return null;
    }

    return (
      <Grid item xs={12}>
        <Divider style={{ marginTop: '40px' }}>
          <Typography variant="body1" style={{ fontSize: '22px', marginBottom: '10px' }}>
            <strong>Common Documents</strong>
          </Typography>
        </Divider>
        <Grid container spacing={2}>
          {Documents.map((doc, key) => (
            <Grid item xs={6} sm={6} key={key}>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                {key + 1}. <strong>Document Name:</strong> {doc?.bookingName}
              </Typography>
              <Typography variant="body1" style={{ fontSize: '17px' }}>
                <strong>Booking Document Link: </strong>
                <a
                  href={`http://localhost:7000/${doc.docImgPath}`}
                  // href={`https://travelling-cms-backend.onrender.com/${doc.docImgPath}`}
                  style={{ textDecoration: 'none', color: 'black' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN
                </a>
              </Typography>
            </Grid>
          ))}
          {/* <Grid item xs={12}>
    <Divider style={{ marginTop: '20px' }} />
  </Grid> */}
        </Grid>
      </Grid>
    );
  };

  const renderFamilyMembers = () => {
    if (!familyMembers || familyMembers.length === 0) {
      return null;
    }

    return familyMembers.map((familyMember, index) => (
      <Grid item xs={12} key={familyMember._id}>
        <Paper style={{ padding: '16px', marginBottom: '20px' }}>
          <Typography variant="h4" style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>
            {index + 1}. {`${familyMember.firstName} ${familyMember.lastName}`}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '16px' }}>
                <strong>Email Address:</strong> {familyMember.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '16px' }}>
                <strong>Mobile No.:</strong> {familyMember.mobile}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '16px' }}>
                <strong>Date of Birth:</strong> {extractDate(familyMember.dateOfBirth)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '16px' }}>
                <strong>Passport Number:</strong> {familyMember.passportNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '16px' }}>
                <strong>Passport Expiry Date:</strong> {extractDate(familyMember.passportExpiryDate)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '16px' }}>
                <strong>Relationship:</strong> {familyMember.relationship}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '16px' }}>
                <strong>Address:</strong> {familyMember.address}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '16px' }}>
                <strong>City:</strong> {familyMember.city}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '16px' }}>
                <strong>Country:</strong> {familyMember.country}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '16px' }}>
                <strong>PostalCode:</strong> {familyMember.postalCode}
              </Typography>
            </Grid>
            {renderFrequentFlyerNumbers(familyMember.frequentFlyerNumbers)}
            {renderHotelLoyaltyNumbers(familyMember.hotelLoyaltyNumbers)}
            {renderDocuments(familyMember.bookingDetails)}
          </Grid>
        </Paper>
      </Grid>
    ));
  };

  return (
    <>
      <Toaster />
      <Container maxWidth="md" style={{ padding: '17px' }}>
        <Typography variant="h4" align="center" style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '17px' }}>
          Customer Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" style={{ fontSize: '26px', fontWeight: 'bold', marginTop: '17px', marginBottom: '17px' }}>
              {customerList.firstName} {customerList.lastName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Email Address:</strong> {customerList.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Mobile No. :</strong> {customerList.mobile}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Date of Birth:</strong> {extractDate(customerList?.dateOfBirth)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Passport Number:</strong> {customerList.passportNumber}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Passport Expiry Date:</strong> {extractDate(customerList.passportExpiryDate)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Family Members:</strong> {customerList.familyMembers}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Total Bookings:</strong> {customerList.totalBookings}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Address:</strong> {customerList.address}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>City:</strong> {customerList.city}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Country:</strong> {customerList.country}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Postal Code:</strong> {customerList.postalCode}
            </Typography>
          </Grid>
          {renderDocuments(customerList.bookingDetails)}
          {renderFrequentFlyerNumbers(customerList.frequentFlyerNumbers)}
          {renderHotelLoyaltyNumbers(customerList.hotelLoyaltyNumbers)}
          <Grid item xs={12}>
            <Divider style={{ marginTop: '20px' }}>
              {' '}
              <Typography variant="body1" style={{ fontSize: '22px' }}>
                <strong>Company Details</strong>
              </Typography>
            </Divider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Company Name:</strong> {customerList.companyName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Company GST Email Address:</strong> {customerList.companyGSTEmail}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Company GST Number:</strong> {customerList.companyGSTNumber}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider style={{ marginTop: '20px' }}>
              <Typography variant="body1" style={{ fontSize: '22px' }}>
                <strong>Family Members</strong>
              </Typography>
            </Divider>
          </Grid>
          {renderFamilyMembers()}
        </Grid>
      </Container>
    </>
  );
}
