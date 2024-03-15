import { useState } from 'react';
import { filter } from 'lodash';
import {
  Card,
  Table,
  // Stack,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  // Container,
  Typography,
  TableContainer,
  TablePagination,
  // IconButton,
  Checkbox,
  Button
} from '@mui/material';
// components
// import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import { useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
// import Iconify from 'components/iconify';
import Scrollbar from 'components/scrollbar/Scrollbar';
import { UserListHead, UserListToolbar } from 'sections/@dashboard/user';

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
    return filter(array, (_user) => _user.username.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
const TABLE_HEAD = [
  { id: 'EmployeeNo', label: 'Branch Manger ID', alignRight: false },
  { id: 'Name', label: 'Name', alignRight: false },
  // { id: 'Designation', label: 'Designation', alignRight: false },
  { id: 'Dept', label: 'Department', alignRight: false },
  { id: 'Email', label: 'Email', alignRight: false },
  { id: 'mobileNo', label: 'Mobile No.', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false }
];

export default function BranchManagers() {
  // const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [USERLIST, setUserlist] = useState([]);

  const fetchCustomers = async () => {
    const promise = new Promise((resolve, reject) => {
      axios
        .get(`/GetBranchManagers`, {
          withCredentials: true // Include credentials (cookies) with the request
        })
        .then((response) => {
          console.log(response);
          const orderData = response.data.findEmployees;
          console.log(orderData);
          setUserlist(orderData);
          //   toast.success('Order Fetched Successfully!');

          resolve(orderData);
        })
        .catch((error) => {
          toast.error('Failed to retrieve Branch Managers. Please try again later.');
          console.error('Error retrieve Branch Managers:', error);
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: 'retrieve Branch Managers...',
      success: 'Branch Managers retrieve  successfully!!',
      error: 'Failed to retrieve Branch Managers!!!'
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
      const newSelecteds = USERLIST.map((n) => n.branchManagerId);
      setSelected(newSelecteds);
    } else {
      // If the checkbox is unchecked, clear the selection
      setSelected([]);
    }
  };

  const handleClick = (event, branchManagerId) => {
    const selectedIndex = selected.indexOf(branchManagerId);
    let newSelected = [];

    if (selectedIndex === -1) {
      // If the item is not selected, add it to the selection
      newSelected = [...selected, branchManagerId];
    } else if (selectedIndex >= 0) {
      // If the item is selected, remove it from the selection
      newSelected = selected.filter((id) => id !== branchManagerId);
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

  const downloadPdf = async (pdfUrl, fileName) => {
    try {
      console.log(pdfUrl);
      const response = await fetch(pdfUrl, {
        credentials: 'include',
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      return 'PDF downloaded successfully';
    } catch (error) {
      throw new Error(`Error downloading PDF: ${error}`);
    }
  };

  const handleDownloadReport = async (row) => {
    const user = USERLIST.find((user) => user.branchManagerId == row.branchManagerId);
    console.log(user);
    // const isDelete = window.confirm('Are you sure you want to approve request of Employee having name ' + user.username);
    // if (isDelete) {
    // user.isConfirmed = 'approved';
    const pdfUrl = `http://localhost:4469/generate-pdf-branch-manager?empId=${row.branchManagerId}`;
    console.log(row);
    const fileName = `${row.username}.pdf`;

    // Show a "pending" toast message
    const pendingToastId = toast('Downloading PDF...', {
      autoClose: false // Keep it open until the download is complete
    });

    try {
      const result = await downloadPdf(pdfUrl, fileName);
      console.log(result);
      // Hide the "pending" toast when the download is complete
      toast.dismiss(pendingToastId);
      // Show a "success" toast
      toast.success('PDF Downloaded Successfully');
    } catch (error) {
      // Hide the "pending" toast in case of an error
      toast.dismiss(pendingToastId);
      // Show an "error" toast
      toast.error(`Error downloading PDF: ${error.message}`);
      console.error(error);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <>
        <Toaster />

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeholder="Employee"
            name="List of Branch Managers"
          />

          <Scrollbar>
            <TableContainer>
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
                      const { branchManagerId, username, dept, mNumber, email } = row;
                      const selectedUser = selected.indexOf(branchManagerId) !== -1;
                      // const createdDate = new Date(createdAt);
                      // const formattedDate = `${createdDate.getDate()}-${createdDate.getMonth() + 1}-${createdDate.getFullYear()}`;
                      return (
                        <>
                          <TableRow hover key={branchManagerId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, branchManagerId)} />
                            </TableCell>
                            <TableCell align="left">{branchManagerId}</TableCell>

                            <TableCell align="left">{username}</TableCell>
                            {/* <TableCell align="left">{designation}</TableCell> */}
                            <TableCell align="left">{dept}</TableCell>
                            <TableCell align="left">{email}</TableCell>
                            <TableCell align="left">{mNumber}</TableCell>
                            <TableCell align="left">
                              <Button
                                size="large"
                                color="inherit"
                                className="bg-blue-300 hover:bg-blue-500"
                                onClick={() => {
                                  handleDownloadReport(row);
                                }}
                              >
                                Download Report
                                {/* <Iconify icon={'eva:checkmark-outline'} /> Accept icon */}
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
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No Any Branch Managers
                          </Typography>
                          <Typography variant="body2">There are currently no No any Branch Managers available.</Typography>
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
      </>
    </>
  );
}
