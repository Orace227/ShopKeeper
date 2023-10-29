import { useState } from 'react';
import { filter } from 'lodash';
import {
  Card,
  Table,
  Stack,
  Paper,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  // DialogActions,
  TextField,
  Grid
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import { useEffect } from 'react';
import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'Mobile', label: 'Mobile No.', alignRight: false },
  { id: 'Email', label: 'Email Address', alignRight: false },
  { id: 'Family Members', label: 'Family Members', alignRight: false },
  { id: 'total Bookings', label: 'Total Bookings', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'action', label: 'Action' }
];

export default function Customers() {
  // const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [USERLIST, setUserlist] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedUserData, setEditedUserData] = useState([]);

  const fetchCustomers = () => {
    const promise = new Promise((resolve, reject) => {
      axios
        .get('/getclients')
        .then((response) => {
          const customersData = response.data.allClients;
          setUserlist(customersData);
          toast.success('Customers Fetched Successfully!');

          resolve(customersData);
        })
        .catch((error) => {
          toast.error('Failed to Fetch Customers. Please try again later.');
          console.error('Error fetching customers:', error);
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: 'Fetching customers...',
      success: 'Customers fetched successfully!',
      error: 'Failed to fetch customers!'
    });
  };

  useEffect(() => {
    fetchCustomers();
    // console.log(USERLIST);
  }, []);

  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // If the checkbox is checked, select all items
      const newSelecteds = USERLIST.map((n) => n.clientId);
      setSelected(newSelecteds);
    } else {
      // If the checkbox is unchecked, clear the selection
      setSelected([]);
    }
  };

  const handleClick = (event, clientId) => {
    const selectedIndex = selected.indexOf(clientId);
    let newSelected = [];

    if (selectedIndex === -1) {
      // If the item is not selected, add it to the selection
      newSelected = [...selected, clientId];
    } else if (selectedIndex >= 0) {
      // If the item is selected, remove it from the selection
      newSelected = selected.filter((id) => id !== clientId);
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleOpenEditModal = (row) => {
    try {
      console.log(row);
      const user = USERLIST.find((user) => user.clientId == row.clientId);
      console.log(user);
      setEditedUserData(user);
      setOpenEditModal(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const handleDeleteCustomer = async (row) => {
    try {
      const user = USERLIST.find((user) => user.clientId == row.clientId);
      console.log(user);
      const isDelete = window.confirm('Are you sure you want to delete customer having name ' + user.firstName + user.lastName);
      if (isDelete) {
        const deletedCustomer = await axios.post('/deleteClient', { clientId: user.clientId });
        if (deletedCustomer) {
          toast.success('Customer deleted successfully!!');
        }
      }
      window.location.reload();
    } catch (err) {
      console.log({ error: err });
    }
  };
  // Function to close the edit modal
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleSaveChanges = () => {
    handleCloseEditModal();
  };
  // const handleMobileKeyPress = (e) => {
  //   // Prevent non-numeric characters
  //   if (!/^\d+$/.test(e.key)) {
  //     e.preventDefault();
  //   }
  // };
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is Required'),
    lastName: Yup.string().required('Last Name is Required'),
    email: Yup.string().email('Invalid email address').required('Email is Required'),
    mobile: Yup.string().required('Mobile is Required'),
    // dateOfBirth: Yup.date().required('Date of Birth is required'),
    passportNumber: Yup.string().required('Passport Number is Required'),
    // passportExpiryDate: Yup.date().required('Passport Expiry Date is required'),
    frequentFlyerNumbers: Yup.array().of(
      Yup.object().shape({
        type: Yup.string().required('Frequent Flyer Type is Required'),
        number: Yup.string().required('Frequent Flyer Number is Required')
      })
    ),
    hotelLoyaltyNumbers: Yup.array().of(
      Yup.object().shape({
        type: Yup.string().required('Hotel Loyalty Type is Required'),
        number: Yup.string().required('Hotel Loyalty Number is Required')
      })
    ),
    address: Yup.string().required('Address is Required'),
    city: Yup.string().required('City is Required'),
    country: Yup.string().required('Country is Required'),
    postalCode: Yup.string().required('Postal Code is Required'),
    foodPreferences: Yup.string(),
    companyName: Yup.string(),
    companyGSTNumber: Yup.string(),
    companyGSTEmail: Yup.string().email()
  });
  const handleSubmit = async (values) => {
    // console.log(editedUserData);
    console.log('values', values);
    const updatedCustomer = await axios.post('/updateClient', values);
    console.log(updatedCustomer);
    toast.success('Customer updated successfully!!');
    handleSaveChanges();
    window.location.reload();
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h1" gutterBottom>
            Customers
          </Typography>
          <Link to="/createCustomer">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Add Customer
            </Button>
          </Link>
        </Stack>
        <Toaster />
        {openEditModal && (
          <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="lg" fullWidth>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogContent>
              <Container>
                <Formik initialValues={editedUserData} validationSchema={validationSchema} onSubmit={handleSubmit}>
                  {({ values }) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="firstName"
                            as={TextField}
                            label="First Name"
                            // value={editedUserData.firstName || ' '}
                            // onChange={(e) => {
                            //   const updatedUserData = { ...editedUserData, firstName: e.target.value };
                            //   setEditedUserData(updatedUserData);
                            // }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="firstName" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="lastName"
                            as={TextField}
                            label="Last Name"
                            // value={editedUserData.lastName || ' '}
                            // onChange={(e) => {
                            //   const updatedUserData = { ...editedUserData, lastName: e.target.value };
                            //   setEditedUserData(updatedUserData);
                            // }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="lastName" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            name="email"
                            as={TextField}
                            // value={editedUserData.email || ' '}
                            // onChange={(e) => {
                            //   const updatedUserData = { ...editedUserData, email: e.target.value };
                            //   setEditedUserData(updatedUserData);
                            // }}
                            label="Email"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="email" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="mobile"
                            as={TextField}
                            label="Mobile"
                            type="text"
                            // value={editedUserData.mobile || ' '}
                            // onChange={(e) => {
                            //   handleMobileKeyPress(e);
                            //   const updatedUserData = { ...editedUserData, mobile: e.target.value };
                            //   setEditedUserData(updatedUserData);
                            // }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            inputProps={{
                              inputMode: 'numeric',
                              maxLength: 10 // Add maximum length attribute
                            }}
                            error={editedUserData.mobile && editedUserData.mobile.length !== 10}
                            helperText={
                              editedUserData.mobile && editedUserData.mobile.length !== 10
                                ? 'Mobile number must be exactly 10 characters'
                                : ''
                            }
                          />
                          <ErrorMessage name="mobile" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="dateOfBirth"
                            as={TextField}
                            label="Date of Birth"
                            // value={editedUserData.dateOfBirth}
                            // onChange = {(e) =>{
                            //   const updatedUserData = {...editedUserData,dateOfBirth : e.target.value}
                            //   setEditedUserData(updatedUserData)}}
                            type="date"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                          <ErrorMessage name="dateOfBirth" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="passportNumber"
                            as={TextField}
                            // value={editedUserData.passportNumber || ' '}
                            // onChange={(e) => {
                            //   const updatedUserData = { ...editedUserData, passportNumber: e.target.value };
                            //   setEditedUserData(updatedUserData);
                            // }}
                            label="Passport Number"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="passportNumber" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="passportExpiryDate"
                            as={TextField}
                            // value={editedUserData.passportExpiryDate}
                            // onChange = {(e) =>{
                            //   const updatedUserData = {...editedUserData,passportExpiryDate : e.target.value}
                            //   setEditedUserData(updatedUserData)}}
                            label="Passport Expiry Date"
                            type="date"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                          <ErrorMessage name="passportExpiryDate" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h5" gutterBottom>
                            Frequent Flyer Numbers
                          </Typography>
                          <FieldArray name="frequentFlyerNumbers">
                            {({ push, remove }) => (
                              <div>
                                {values.frequentFlyerNumbers.map((ffNumber, index) => (
                                  <div key={index}>
                                    <Field
                                      name={`frequentFlyerNumbers[${index}].type`}
                                      as={TextField}
                                      label="Frequent Flyer Type"
                                      // onChange={(e) => {
                                      //   const updatedUserData = { ...editedUserData };
                                      //   const frequentFlyerNumbers = [...updatedUserData.frequentFlyerNumbers];
                                      //   frequentFlyerNumbers[index].type = e.target.value;
                                      //   updatedUserData.frequentFlyerNumbers = frequentFlyerNumbers;
                                      //   setEditedUserData(updatedUserData);
                                      // }}
                                      fullWidth
                                      margin="normal"
                                      variant="outlined"
                                    />
                                    <ErrorMessage
                                      name={`frequentFlyerNumbers[${index}].type`}
                                      component="div"
                                      className="error"
                                      style={{ color: 'red' }}
                                    />
                                    <Field
                                      name={`frequentFlyerNumbers[${index}].number`}
                                      as={TextField}
                                      label="Frequent Flyer Number"
                                      // onChange={(e) => {
                                      //   const updatedUserData = { ...editedUserData };
                                      //   const frequentFlyerNumbers = [...updatedUserData.frequentFlyerNumbers];
                                      //   frequentFlyerNumbers[index].number = e.target.value;
                                      //   updatedUserData.frequentFlyerNumbers = frequentFlyerNumbers;
                                      //   setEditedUserData(updatedUserData);
                                      // }}
                                      fullWidth
                                      margin="normal"
                                      variant="outlined"
                                    />
                                    <ErrorMessage
                                      name={`frequentFlyerNumbers[${index}].number`}
                                      component="div"
                                      className="error"
                                      style={{ color: 'red' }}
                                    />
                                    <Button type="button" variant="outlined" color="secondary" onClick={() => remove(index)}>
                                      Remove Frequent Flyer
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outlined"
                                  style={{ marginTop: '10px' }}
                                  onClick={() => push({ type: '', number: '' })}
                                >
                                  Add Frequent Flyer
                                </Button>
                              </div>
                            )}
                          </FieldArray>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h5" gutterBottom>
                            Hotel Loyalty Numbers
                          </Typography>
                          <FieldArray name="hotelLoyaltyNumbers">
                            {({ push, remove }) => (
                              <>
                                <div>
                                  {values.hotelLoyaltyNumbers.map((hlNumber, index) => (
                                    <div key={index}>
                                      <Field
                                        name={`hotelLoyaltyNumbers[${index}].type`}
                                        as={TextField}
                                        label="Hotel Loyalty Type"
                                        // value={editedUserData.hotelLoyaltyNumbers[index].type || ''}
                                        // onChange={(e) => {
                                        //   const updatedUserData = { ...editedUserData };
                                        //   const hotelLoyaltyNumbers = [...updatedUserData.hotelLoyaltyNumbers];
                                        //   hotelLoyaltyNumbers[index].type = e.target.value;
                                        //   updatedUserData.hotelLoyaltyNumbers = hotelLoyaltyNumbers;
                                        //   setEditedUserData(updatedUserData);
                                        // }}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                      />
                                      <ErrorMessage
                                        name={`hotelLoyaltyNumbers[${index}].type`}
                                        component="div"
                                        className="error"
                                        style={{ color: 'red' }}
                                      />
                                      <Field
                                        name={`hotelLoyaltyNumbers[${index}].number`}
                                        as={TextField}
                                        label="Hotel Loyalty Number"
                                        // value={values.hotelLoyaltyNumbers[index].number || ''}
                                        // onChange={(e) => {
                                        //   const updatedUserData = { ...editedUserData };
                                        //   const hotelLoyaltyNumbers = [...updatedUserData.hotelLoyaltyNumbers];
                                        //   hotelLoyaltyNumbers[index].number = e.target.value;
                                        //   updatedUserData.hotelLoyaltyNumbers = hotelLoyaltyNumbers;
                                        //   setEditedUserData(updatedUserData);
                                        // }}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                      />
                                      <ErrorMessage
                                        name={`hotelLoyaltyNumbers[${index}].number`}
                                        component="div"
                                        className="error"
                                        style={{ color: 'red' }}
                                      />
                                      <Button type="button" variant="outlined" color="secondary" onClick={() => remove(index)}>
                                        Remove Hotel Loyalty
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outlined"
                                    style={{ marginTop: '10px' }}
                                    onClick={() => push({ type: '', number: '' })}
                                  >
                                    Add Hotel Loyalty
                                  </Button>
                                </div>
                              </>
                            )}
                          </FieldArray>
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="address"
                            // value={editedUserData.address || ' '}
                            // onChange={(e) => {
                            //   const updatedUserData = { ...editedUserData, address: e.target.value };
                            //   setEditedUserData(updatedUserData);
                            // }}
                            as={TextField}
                            label="Address"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="address" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="city"
                            as={TextField}
                            // value={editedUserData.city || ' '}
                            // onChange={(e) => {
                            //   const updatedUserData = { ...editedUserData, city: e.target.value };
                            //   setEditedUserData(updatedUserData);
                            // }}
                            label="City"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="city" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="country"
                            // value={editedUserData.country || ''}
                            // onChange={(e) => {
                            //   const updatedUserData = { ...editedUserData, country: e.target.value };
                            //   setEditedUserData(updatedUserData);
                            // }}
                            as={TextField}
                            label="Country"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="country" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="postalCode"
                            // value={editedUserData.postalCode || ''}
                            // onChange={(e) => {
                            //   const updatedUserData = { ...editedUserData, postalCode: e.target.value };
                            //   setEditedUserData(updatedUserData);
                            // }}
                            as={TextField}
                            label="Postal Code"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            inputProps={{
                              pattern: '^\\d{6}$', // Regular expression for exactly 6 digits
                              title: 'Postal code must be exactly 6 digits' // Error message
                            }}
                          />
                          <ErrorMessage name="postalCode" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="foodPreferences"
                            as={TextField}
                            label="Food Preferences"
                            fullWidth
                            // value={editedUserData.foodPreferences || ''}
                            // onChange={(e) => {
                            //   const updatedUserData = { ...editedUserData, foodPreferences: e.target.value };
                            //   setEditedUserData(updatedUserData);
                            // }}
                            margin="normal"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="companyName"
                            // value={editedUserData.companyName || ''}
                            // onChange={(e) => {
                            //   const updatedUserData = { ...editedUserData, companyName: e.target.value };
                            //   setEditedUserData(updatedUserData);
                            // }}
                            as={TextField}
                            label="Company Name"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="companyGSTNumber"
                            as={TextField}
                            label="Company GST Number"
                            // value={editedUserData.companyGSTNumber || ''}
                            // onChange={(e) => {
                            //   const updatedUserData = { ...editedUserData, companyGSTNumber: e.target.value };
                            //   setEditedUserData(updatedUserData);
                            // }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="companyGSTEmail"
                            as={TextField}
                            // value={editedUserData.companyGSTEmail || ''}
                            // onChange={(e) => {
                            //   const updatedUserData = { ...editedUserData, companyGSTEmail: e.target.value };
                            //   setEditedUserData(updatedUserData);
                            // }}
                            label="Company GST Email"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="companyGSTEmail" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                      </Grid>
                      <Button type="submit" variant="contained" color="primary" size="large" style={{ marginTop: '1rem' }}>
                        Save
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Container>
            </DialogContent>
          </Dialog>
        )}
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeholder="Customers"
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .reverse()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      // console.log(row);
                      const { clientId, firstName, lastName, companyName, familyMembers, totalBookings, email, mobile, address } = row;
                      const selectedUser = selected.indexOf(clientId) !== -1;

                      return (
                        <>
                          <TableRow hover key={clientId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, clientId)} />
                            </TableCell>

                            <TableCell align="left">
                              <Typography noWrap>
                                <Link to={`/GetCustomer/${clientId}`} style={{ textDecoration: 'none', color: 'black' }}>
                                  {firstName} {lastName}
                                </Link>
                              </Typography>
                            </TableCell>

                            <TableCell align="left">{companyName}</TableCell>

                            <TableCell align="left">{mobile}</TableCell>

                            <TableCell align="left">{email}</TableCell>

                            <TableCell align="left">{familyMembers}</TableCell>
                            <TableCell align="left">{totalBookings}</TableCell>
                            <TableCell align="left">{address}</TableCell>

                            <TableCell align="left">
                              <IconButton size="large" color="inherit" onClick={() => handleOpenEditModal(row)}>
                                <Iconify icon={'eva:edit-fill'} />
                              </IconButton>

                              <IconButton
                                size="large"
                                color="inherit"
                                onClick={() => {
                                  handleDeleteCustomer(row);
                                }}
                              >
                                <Iconify icon={'eva:trash-2-outline'} />
                              </IconButton>
                              <Button
                                component={Link}
                                to={`/familyMembers?clientId=${clientId}`} // Specify the correct URL here
                                variant="contained"
                                style={{ textAlign: 'center' }}
                                color="primary"
                              >
                                Family Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                  {USERLIST.length === 0 && (
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No Customers
                          </Typography>
                          <Typography variant="body2">There are currently no Customers available.</Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
