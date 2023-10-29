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
  TableContainer,
  TablePagination,
  IconButton
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import { useEffect } from 'react';
import React from 'react';
// import * as Yup from 'yup';
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

export default function ConfirmedOrders() {
  // const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [USERLIST, setUserlist] = useState([]);

  const fetchCustomers = () => {
    const promise = new Promise((resolve, reject) => {
      axios
        .get(`/GetOrders?cartId=123456&Status=approved`)
        .then((response) => {
          const orderData = response.data.existedOrders;
          setUserlist(orderData);
          //   toast.success('Order Fetched Successfully!');

          resolve(orderData);
        })
        .catch((error) => {
          toast.error('Failed to Fetch Order. Please try again later.');
          console.error('Error fetching Order:', error);
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: 'Fetching Confirmed Order...',
      success: 'Confirmed Order fetched successfully!!',
      error: 'Failed to fetch Confirmed Order!!!'
    });
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

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={1}>
          <Typography variant="h1" gutterBottom>
            Confirmed Orders
          </Typography>
        </Stack>
        <Toaster />

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
