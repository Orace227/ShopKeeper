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
  Grid,
  FormLabel
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
import blankImg from './blank.jpg';
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
    return filter(array, (_user) => _user.categoryName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
const TABLE_HEAD = [
  { id: 'CategoryId', label: 'Category ID', alignRight: false },
  { id: 'CategoryName', label: 'Category Name', alignRight: false },
  { id: 'CategoryImage', label: 'Category Image', alignRight: false },
  // { id: 'Description', label: 'Description', alignRight: false },
  // { id: 'Category', label: 'Category', alignRight: false },
  // { id: 'totalQuantity', label: 'total Quantity in Stock', alignRight: false },
  { id: 'action', label: 'Action' }
];

export default function Categories() {
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
        .get('/GetCategory', {
          withCredentials: true // Include credentials (cookies) with the request
        })
        .then((response) => {
          const findCategoryData = response.data.findCategories;
          const allCategory = findCategoryData.map((category) => ({
            ...category,
            categoryImgPath: `${category.categoryImgPath.replace('\\', '/')}`
          }));
          console.log({ allCategory });

          // Check if the image exists before setting it
          const promises = allCategory.map(async (category) => {
            try {
              console.log(category.categoryImgPath);

              const img = await axios.get(category.categoryImgPath);
              console.log(img);
              if (img) {
                console.log(category.categoryImgPath);
                category.categoryImgPath = `${category.categoryImgPath.replace('\\', '/')}`;
              }
              return img;
              // category.categoryImgPath = `http://localhost:4469/${category.categoryImgPath.replace('\\', '/')}`;
            } catch (error) {
              category.categoryImgPath = blankImg;
            }
          });

          // Wait for all promises to complete
          Promise.all(promises).then(() => {
            console.log(allCategory);
            setUserlist(allCategory);
            resolve(allCategory);
          });
        })
        .catch((error) => {
          toast.error('Failed to retrieve Categories. Please try again later.');
          console.error('Error retrieving Categories:', error);
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: 'Retrieving Categories...',
      success: 'Categories retrieved successfully!!',
      error: 'Failed to retrieve Categories!!!'
    });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.categoryId);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, categoryId) => {
    const selectedIndex = selected.indexOf(categoryId);
    let newSelected = [];

    if (selectedIndex === -1) {
      // If the item is not selected, add it to the selection
      newSelected = [...selected, categoryId];
    } else if (selectedIndex >= 0) {
      // If the item is selected, remove it from the selection
      newSelected = selected.filter((id) => id !== categoryId);
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
      const user = USERLIST.find((user) => user.categoryId == row.categoryId);
      console.log(user);
      setEditedUserData(user);
      setOpenEditModal(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const handleDeleteCustomer = async (row) => {
    try {
      const user = USERLIST.find((user) => user.categoryId == row.categoryId);
      console.log(user);
      const isDelete = window.confirm('Are you sure you want to delete Category having CategoryId ' + user.categoryId);
      if (isDelete) {
        const deletedCustomer = await axios.post('/DeleteCategory', { categoryId: user.categoryId });
        if (deletedCustomer) {
          toast.success('Category deleted successfully!!');
        }
      }
      window.location.reload();
    } catch (err) {
      toast.error('Some error occurred when deleting Category  successfully!!');
      console.log({ error: err });
    }
  };
  // Function to close the edit modal
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  // const handleSaveChanges = () => {
  //   handleCloseEditModal();
  // };
  // const handleMobileKeyPress = (e) => {
  //   // Prevent non-numeric characters
  //   if (!/^\d+$/.test(e.key)) {
  //     e.preventDefault();
  //   }
  // };

  const validationSchema = Yup.object().shape({
    products: Yup.array().of(
      Yup.object().shape({
        categoryName: Yup.string().required('Category Name is Required'),
        categoryImgName: Yup.string().required('Category Image Name is required')
      })
    )
  });

  // const handleSubmit = async (values) => {
  //   console.log('values', values);
  //   const updatedCategory = await axios.post('/UpdateCategory', values);
  //   console.log(updatedCategory);
  //   toast.success('Category updated successfully!!');

  //   window.location.reload();
  // };

  const handleSubmit = async (values) => {
    try {
      console.log({ values });
      if (values?.categoryImg) {
        console.log('workng');
        const parts = values?.categoryImgPath.split('/');
        const filename = parts[parts.length - 1];
        console.log(filename);
        const DeletedBannerImg = await axios.post(
          '/delete-category-img',
          { filename },
          {
            withCredentials: true // Include credentials (cookies) with the request
          }
        );
        if (DeletedBannerImg) {
          console.log(DeletedBannerImg);
          const formData = new FormData();
          formData.append('categoryImg', values.categoryImg);
          console.log(values.categoryImg);
          // console.log({ formData });
          const uploadedImg = await axios.post('/upload-category-img', formData, {
            withCredentials: true // Include credentials (cookies) with the request
          });
          console.log(uploadedImg);
          values.categoryImgPath = uploadedImg.data.path;
          console.log('main value', values);
          if (uploadedImg) {
            const updatedPackage = await axios.post('/UpdateCategory', values, {
              withCredentials: true // Include credentials (cookies) with the request
            });
            console.log(updatedPackage);
            // console.log(editedUserData);
            if (updatedPackage) {
              toast.success('Category Updated Successfully!!');

              window.location.reload();
            }
          }
        }
      } else {
        console.log('values', values);
        const updatedCategory = await axios.post('/UpdateCategory', values, {
          withCredentials: true // Include credentials (cookies) with the request
        });
        if (updatedCategory) {
          console.log(updatedCategory);
          toast.success('Category updated successfully!!');
          window.location.reload();
        }
      }
      // console.log({ 'img path': values.packageImgPath, PATH });
    } catch (error) {
      console.error('Error updating package:', error);
      if (error.response.status == 422) {
        toast.error('You cannot make this package shown as there are already 4 packages of this type which is shown on website!!');
      }
      if (error.response.status == 500) {
        toast.error('Failed to update customer. Please try again.');
      }
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h1" gutterBottom>
            Categories
          </Typography>
          <Link to="/createCategories">
            <Button startIcon={<Iconify icon="eva:plus-fill" />}>Add Categories</Button>
          </Link>
        </Stack>
        <Toaster />
        {openEditModal && (
          <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="lg" fullWidth>
            <DialogTitle>Edit Categories</DialogTitle>
            <DialogContent>
              <Container>
                <Formik initialValues={editedUserData} validationSchema={validationSchema} onSubmit={handleSubmit}>
                  {({ values, setFieldValue }) => (
                    <Form>
                      <Typography variant="h4" className="mt-2" gutterBottom>
                        Category
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Field name="categoryName" as={TextField} label="Category Name" fullWidth margin="normal" variant="outlined" />
                          <ErrorMessage name="categoryName" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>

                        <Grid item xs={12}>
                          <input
                            id="categoryImgName"
                            name="categoryImgName"
                            type="file"
                            onChange={(e) => {
                              setFieldValue('categoryImg', e.currentTarget.files[0]);
                              setFieldValue('categoryImgName', e.currentTarget.files[0].name);
                            }}
                            accept="image/*"
                            style={{ display: 'none' }}
                          />
                          <FormLabel htmlFor="categoryImgName">
                            <Button variant="outlined" component="span" fullWidth style={{ textTransform: 'none' }}>
                              Upload Category Image
                            </Button>
                          </FormLabel>
                          <div>
                            {values.categoryImgName && (
                              <p style={{ margin: '0', paddingTop: '8px' }}>Selected Image: {values.categoryImgName}</p>
                            )}
                          </div>
                          <ErrorMessage name="categoryImgName" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12}>
                          <Button type="submit" className="mb-3" variant="outlined">
                            Submit Category
                          </Button>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Container>
            </DialogContent>
          </Dialog>
        )}
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} placeholder="Category" />

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
                      let { categoryId, categoryName, categoryImgPath } = row;
                      const selectedUser = selected.indexOf(categoryId) !== -1;
                      console.log(categoryImgPath);
                      categoryImgPath = `http://localhost:4469/${categoryImgPath}`;
                      return (
                        <>
                          <TableRow hover key={categoryId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, categoryId)} />
                            </TableCell>
                            <TableCell align="left">{categoryId}</TableCell>
                            <TableCell align="left">
                              <Typography noWrap>{categoryName}</Typography>
                            </TableCell>
                            <TableCell align="left">
                              {categoryImgPath ? (
                                <img className="w-[130px] " src={categoryImgPath} alt="img" />
                              ) : (
                                <img className="w-[130px] " src={blankImg} alt="img" />
                              )}
                            </TableCell>
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
                            No Products
                          </Typography>
                          <Typography variant="body2">There are currently no Products available.</Typography>
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
