import { useState } from 'react';
import { filter } from 'lodash';
import {
  Card,
  Table,
  Stack,
  Paper,
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
import { Formik, Form, Field, ErrorMessage } from 'formik';
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
    return filter(array, (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
const TABLE_HEAD = [
  { id: 'orderNo', label: 'Order No', alignRight: false },
  //   { id: 'cartNo', label: 'Cart No', alignRight: false },
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'NoOfItems', label: 'No of Items', alignRight: false },
  { id: 'orderDate', label: 'Order Date', alignRight: false },
  { id: 'Status', label: 'Status', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false }
];

export default function PendingOrders() {
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
        .get(`/GetOrders?cartId=123456&Status=pending`)
        .then((response) => {
          const orderData = response.data.existedOrders;
          setUserlist(orderData);
          //   toast.success('Order Fetched Successfully!');

          resolve(orderData);
        })
        .catch((error) => {
          toast.error('Failed to Fetch Pending Orders. Please try again later.');
          console.error('Error fetching Order:', error);
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: 'Fetching Pending Order...',
      success: 'Pending Orders fetched successfully!!',
      error: 'Failed to fetch Pending Orders!!!'
    });
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
  // Function to close the edit modal
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };
  const handleSubmit = async (values) => {
    // console.log(editedUserData);
    console.log('values', values);
    const updatedCustomer = await axios.post('/updateClient', values);
    console.log(updatedCustomer);
    toast.success('Customer updated successfully!!');
    handleSaveChanges();
    window.location.reload();
  };

  useEffect(() => {
    fetchCustomers();
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

  const handleDeleteOrder = async (row) => {
    try {
      const user = USERLIST.find((user) => user.orderId == row.orderId);
      console.log(user);
      const isDelete = window.confirm('Are you sure you want to delete Order having name ' + user.title);
      if (isDelete) {
        const deletedCustomer = await axios.post(`/DeleteOrder?cartId=${row.cartId}&orderId=${row.orderId}`);
        if (deletedCustomer) {
          toast.success('Order deleted successfully!!');
          window.location.reload();
        }
      }
    } catch (err) {
      console.log({ error: err });
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is Required')
  });

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={1}>
          <Typography variant="h1" gutterBottom>
            Pending Orders
          </Typography>
        </Stack>
        <Toaster />
        {openEditModal && (
          <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="lg" fullWidth>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogContent>
              <Container>
                <Formik initialValues={editedUserData} validationSchema={validationSchema} onSubmit={handleSubmit}>
                  {() => (
                    <>
                      {console.log(editedUserData)}
                      <Form>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Field name="title" as={TextField} label="Title" fullWidth margin="normal" variant="outlined" />
                            <ErrorMessage name="title" component="div" className="error" style={{ color: 'red' }} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              name="Status"
                              as={TextField}
                              className={`${editedUserData.Status === 'pending' ? ' border-yellow-500' : 'text-yellow-500'}`}
                              label="Status"
                              fullWidth
                              margin="normal"
                              variant="outlined"
                              disabled
                            />
                            <ErrorMessage name="Status" component="div" className="error" style={{ color: 'red' }} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field name="createdAt" as={TextField} label="Date" fullWidth margin="normal" variant="outlined" disabled />
                            <ErrorMessage name="createdAt" component="div" className="error" style={{ color: 'red' }} />
                          </Grid>
                        </Grid>
                        <Button type="submit" color="primary" size="large" style={{ marginTop: '1rem' }}>
                          Save
                        </Button>
                      </Form>
                    </>
                  )}
                </Formik>
              </Container>
            </DialogContent>
          </Dialog>
        )}
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} placeholder="History" />

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
                      const { orderId, products, title, createdAt, Status } = row;
                      const selectedUser = selected.indexOf(orderId) !== -1;
                      const createdDate = new Date(createdAt);
                      const formattedDate = `${createdDate.getDate()}-${createdDate.getMonth() + 1}-${createdDate.getFullYear()}`;
                      return (
                        <>
                          <TableRow hover key={orderId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                            <TableCell align="left">{orderId}</TableCell>
                            {/* <TableCell align="left">{cartId}</TableCell> */}
                            <TableCell align="left">
                              <Link to={`/OrderView/${orderId}`} className="font-semibold hover:cursor-pointer">
                                {title}
                              </Link>
                            </TableCell>
                            <TableCell align="left">{products.length}</TableCell>
                            <TableCell align="left">{formattedDate}</TableCell>
                            <TableCell align="left">
                              <div
                                className={`p-1 w-[90px] rounded-full text-center ${
                                  Status === 'pending'
                                    ? 'bg-yellow-200'
                                    : Status === 'approved'
                                    ? 'bg-green-200'
                                    : Status === 'canceled'
                                    ? 'bg-red-200'
                                    : ''
                                }`}
                              >
                                {Status}
                              </div>
                            </TableCell>
                            <TableCell align="left">
                              <IconButton size="large" color="inherit" onClick={() => handleOpenEditModal(row)}>
                                <Iconify icon={'eva:edit-fill'} />
                              </IconButton>
                              <IconButton
                                size="large"
                                color="inherit"
                                onClick={() => {
                                  handleDeleteOrder(row);
                                }}
                              >
                                <Iconify icon={'eva:trash-2-outline'} />
                              </IconButton>
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
                            No Orders
                          </Typography>
                          <Typography variant="body2">There are currently no Orders available.</Typography>
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
