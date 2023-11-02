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
  IconButton,
  Checkbox
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import { useEffect } from 'react';
import React from 'react';
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
const TABLE_HEAD = [
  { id: 'EmployeeNo', label: 'Survey ID', alignRight: false },
  { id: 'Name', label: 'Name', alignRight: false },
  { id: 'Dept', label: 'Department', alignRight: false },
  { id: 'Date', label: 'Date', alignRight: false },
  { id: 'Email', label: 'Email', alignRight: false },
  { id: 'mobileNo', label: 'Mobile No.', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false }
];

export default function Survey() {
  // const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [USERLIST, setUserlist] = useState([]);

  const fetchCustomers = async () => {
    const GetCartId = await axios.get('/GetCartId');
    console.log(GetCartId.data.cartId);
    const cartId = GetCartId.data.cartId;
    const emp = await axios.get(`/GetEmployees?cartId=${cartId}`);
    console.log(emp.data.findEmployees[0]);
    const empId = await emp.data.findEmployees[0].empId;

    const promise = new Promise((resolve, reject) => {
      axios
        .get(`/GetSurvey?empId=${empId}`, {
          withCredentials: true // Include credentials (cookies) with the request
        })
        .then((response) => {
          console.log(response);
          const orderData = response.data.findSurvey;
          console.log(orderData);
          setUserlist(orderData);
          //   toast.success('Order Fetched Successfully!');

          resolve(orderData);
        })
        .catch((error) => {
          toast.error('Failed to Fetch History Survey. Please try again later.');
          console.error('Error fetching History Survey:', error);
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: 'Fetching Survey History...',
      success: 'Survey History Retrieved successfully!!',
      error: 'Failed to fetch History Survey!!!'
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
      const newSelecteds = USERLIST.map((n) => n.surveyId);
      setSelected(newSelecteds);
    } else {
      // If the checkbox is unchecked, clear the selection
      setSelected([]);
    }
  };

  const handleClick = (event, surveyId) => {
    const selectedIndex = selected.indexOf(surveyId);
    let newSelected = [];

    if (selectedIndex === -1) {
      // If the item is not selected, add it to the selection
      newSelected = [...selected, surveyId];
    } else if (selectedIndex >= 0) {
      // If the item is selected, remove it from the selection
      newSelected = selected.filter((id) => id !== surveyId);
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

  const handleRejectEmployee = async (row) => {
    try {
      const user = USERLIST.find((user) => user.surveyId == row.surveyId);
      console.log(user);
      const isDelete = window.confirm('Are you sure you want to delete survey form of having survey Id ' + user.surveyId);
      if (isDelete) {
        const deletedCustomer = await axios.post(`/DeleteSurvey?surveyId=${user.surveyId}`, {
          withCredentials: true // Include credentials (cookies) with the request
        });
        if (deletedCustomer) {
          toast.success('Survey history deleted successfully!!');
          window.location.reload();
        }
      }
    } catch (err) {
      toast.error('An error occurs during the Survey history deleting!!');

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
          <Typography variant="h2" gutterBottom>
            Survey History
          </Typography>
        </Stack>
        <Toaster />

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} placeholder="Survey" />

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
                      const { surveyId, name, department, mobileNo, createdAt, email } = row;
                      const selectedUser = selected.indexOf(surveyId) !== -1;
                      const createdDate = new Date(createdAt);
                      const formattedDate = `${createdDate.getDate()}-${createdDate.getMonth() + 1}-${createdDate.getFullYear()}`;
                      return (
                        <>
                          <TableRow hover key={surveyId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, surveyId)} />
                            </TableCell>
                            <TableCell align="left">{surveyId}</TableCell>

                            <TableCell align="left" className="font-semibold">
                              <Link to={`/SurveyOverView/${surveyId}`}>{name}</Link>
                            </TableCell>
                            <TableCell align="left">{department}</TableCell>
                            <TableCell align="left">{formattedDate}</TableCell>
                            <TableCell align="left">{email}</TableCell>
                            <TableCell align="left">{mobileNo}</TableCell>
                            <TableCell align="left">
                              <IconButton
                                size="large"
                                className="bg-red-300 hover:bg-red-500 ml-2"
                                color="inherit"
                                onClick={() => {
                                  handleRejectEmployee(row);
                                }}
                              >
                                <Iconify icon={'eva:trash-outline'} />
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
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No Any Employee Request
                          </Typography>
                          <Typography variant="body2">There are currently no No any employee request available.</Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
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
