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
  Select,
  MenuItem,
  FormLabel
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import { useEffect } from 'react';
import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
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
    return filter(array, (_user) => _user.productName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
const TABLE_HEAD = [
  { id: 'ProductId', label: 'Product ID', alignRight: false },
  { id: 'ProductName', label: 'Product Name', alignRight: false },
  { id: 'ProductImg', label: 'Product Image', alignRight: false },
  { id: 'Description', label: 'Description', alignRight: false },
  { id: 'Category', label: 'Category', alignRight: false },
  { id: 'totalQuantity', label: 'total Quantity in Stock', alignRight: false },
  { id: 'MinQty', label: 'Minimum Limit', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false }
];

export default function SubCategory() {
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
  const [Category, setCategory] = useState([]);

  // const fetchCustomers = () => {
  //   const promise = new Promise((resolve, reject) => {
  //     axios
  //       .get('/GetProducts', {
  //         withCredentials: true // Include credentials (cookies) with the request
  //       })
  //       .then((response) => {
  //         const findProductsData = response.data.findProducts;
  //         const allProducts = findProductsData.map((product) => ({
  //           ...product,
  //           productImgPath: `http://localhost:4469/${product.productImgPath.replace('\\', '/')}`
  //         }));

  //         // Check if the image exists before setting it
  //         const promises = allProducts.map(async (product) => {
  //           try {
  //             await axios.get(product.productImgPath);
  //           } catch (error) {
  //             product.productImgPath = blankImg;
  //           }
  //         });

  //         // Wait for all promises to complete
  //         Promise.all(promises).then(() => {
  //           setUserlist(allProducts);
  //           resolve(allProducts);
  //         });
  //       })
  //       .catch((error) => {
  //         toast.error('Failed to retrieve Products. Please try again later.');
  //         console.error('Error retrieving Products:', error);
  //         reject(error);
  //       });
  //   });

  //   toast.promise(promise, {
  //     loading: 'Retrieving Products...',
  //     success: 'Products retrieved successfully!!',
  //     error: 'Failed to retrieve Products!!!'
  //   });
  // };

  const fetchCustomers = () => {
    const promise = new Promise((resolve, reject) => {
      axios
        .get('/GetProducts', {
          withCredentials: true // Include credentials (cookies) with the request
        })
        .then((response) => {
          const findCategoryData = response.data.findProducts;
          const allCategory = findCategoryData.map((category) => ({
            ...category,
            productImgPath: `${category.productImgPath.replace('\\', '/')}`
          }));
          console.log({ allCategory });

          // Check if the image exists before setting it
          const promises = allCategory.map(async (category) => {
            try {
              console.log(category.productImgPath);

              const img = await axios.get(category.productImgPath);
              console.log(img);
              if (img) {
                console.log(category.productImgPath);
                category.productImgPath = `${category.productImgPath.replace('\\', '/')}`;
              }
              return img;
            } catch (error) {
              category.productImgPath = blankImg;
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
      const newSelecteds = USERLIST.map((n) => n.productId);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, productId) => {
    const selectedIndex = selected.indexOf(productId);
    let newSelected = [];

    if (selectedIndex === -1) {
      // If the item is not selected, add it to the selection
      newSelected = [...selected, productId];
    } else if (selectedIndex >= 0) {
      // If the item is selected, remove it from the selection
      newSelected = selected.filter((id) => id !== productId);
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
      const user = USERLIST.find((user) => user.productId == row.productId);
      console.log(user);
      setEditedUserData(user);
      setOpenEditModal(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const handleDeleteCustomer = async (row) => {
    try {
      const user = USERLIST.find((user) => user.productId == row.productId);
      console.log(user);
      const isDelete = window.confirm('Are you sure you want to delete Product having name ' + user.productName);
      if (isDelete) {
        const deletedCustomer = await axios.post('/DeleteProducts', { productId: user.productId });
        if (deletedCustomer) {
          toast.success('Product deleted successfully!!');
          window.location.reload();
        }
      }
    } catch (err) {
      toast.error('Product is not deleted successfully!!!');
      console.log({ error: err });
    }
  };

  const validationSchema = Yup.object().shape({
    products: Yup.array().of(
      Yup.object().shape({
        productName: Yup.string().required('Product Name is Required'),
        description: Yup.string().required('Product Description is Required'),
        category: Yup.string().required('Category is required'),
        quantityInStock: Yup.number().required('Product Quantity is required').positive().integer(),
        productImgName: Yup.string().required('Product Image Name is required')
      })
    )
  });

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

  // const handleSubmit = async (values) => {
  //   // console.log(editedUserData);
  //   console.log('values', values);
  //   const updatedCustomer = await axios.post('/updateClient', values);
  //   console.log(updatedCustomer);
  //   toast.success('Customer updated successfully!!');
  //   handleSaveChanges();
  //   window.location.reload();
  // };

  const fetchCategory = async () => {
    try {
      const response = await axios.get('/GetCategory', {
        withCredentials: true // Include credentials (cookies) with the request
      });
      const allFindCategories = response.data.findCategories;

      // Map the client data to an array of client objects
      const clientObjects = allFindCategories.map((item) => ({
        categoryId: item.categoryId,
        name: `${item.categoryName}`
      }));

      // Set the clients state with the array of client objects
      setCategory(clientObjects);

      console.log('clientObjects', clientObjects);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleSubmit = async (values) => {
    try {
      console.log({ values });
      if (values?.productImg) {
        console.log('workng');
        const parts = values?.productImgPath.split('/');
        const filename = parts[parts.length - 1];
        console.log(filename);
        const DeletedBannerImg = await axios.post(
          '/delete-product-img',
          { filename },
          {
            withCredentials: true // Include credentials (cookies) with the request
          }
        );
        if (DeletedBannerImg) {
          console.log(DeletedBannerImg);
          const formData = new FormData();
          formData.append('productImg', values.productImg);
          console.log(values.productImg);
          // console.log({ formData });
          const uploadedImg = await axios.post('/upload-product-img', formData, {
            withCredentials: true // Include credentials (cookies) with the request
          });
          console.log(uploadedImg);
          values.productImgPath = uploadedImg.data.path;
          console.log('main value', values);
          if (uploadedImg) {
            const updatedPackage = await axios.post('/UpdateProducts', values, {
              withCredentials: true // Include credentials (cookies) with the request
            });
            console.log(updatedPackage);
            // console.log(editedUserData);
            if (updatedPackage) {
              toast.success('Product Updated Successfully!!');

              window.location.reload();
            }
          }
        }
      } else {
        console.log('values', values);
        const updatedCategory = await axios.post('/UpdateProducts', values, {
          withCredentials: true // Include credentials (cookies) with the request
        });
        if (updatedCategory) {
          console.log(updatedCategory);
          toast.success('Product updated successfully!!');
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error updating Product:', error);
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
            Products
          </Typography>
          <Link to="/createProducts">
            <Button startIcon={<Iconify icon="eva:plus-fill" />}>Add Products</Button>
          </Link>
        </Stack>
        <Toaster />
        {openEditModal && (
          <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="lg" fullWidth>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogContent>
              <Container>
                <Formik initialValues={editedUserData} validationSchema={validationSchema} onSubmit={handleSubmit}>
                  {({ values, setFieldValue, handleChange }) => (
                    <Form>
                      <Typography variant="h4" className="mt-2" gutterBottom>
                        Product
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="productName"
                            label="Product Name"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={values.productName}
                            onChange={handleChange}
                          />
                          <ErrorMessage name="productName" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="description"
                            label="Product Description"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={values.description}
                            onChange={handleChange}
                          />
                          <ErrorMessage name="description" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Select
                            name="category"
                            className="mt-4"
                            variant="outlined"
                            fullWidth
                            value={values.category}
                            onChange={handleChange}
                          >
                            <MenuItem value="">Select Category</MenuItem>
                            {Category.map((option) => (
                              <MenuItem key={option.categoryId} value={option.name}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <ErrorMessage name="category" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="quantityInStock"
                            label="Product Quantity"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            type="number"
                            inputProps={{
                              inputMode: 'numeric',
                              min: 1
                            }}
                            value={values.quantityInStock}
                            onChange={handleChange}
                          />
                          <ErrorMessage name="quantityInStock" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name={`minQty`}
                            label="Minimum Quantity "
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={values.minQty}
                            onChange={handleChange}
                            type="number"
                            inputProps={{
                              inputMode: 'numeric'
                            }}
                          />
                          <Typography variant="h4" gutterBottom>
                            <div className="text-red-500 text-sm">{`*Product's minimum amount to get the Notification!`}</div>
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <input
                            id="productImgName"
                            name="productImgName"
                            type="file"
                            onChange={(e) => {
                              setFieldValue('productImg', e.currentTarget.files[0]);
                              setFieldValue('productImgName', e.currentTarget.files[0].name);
                            }}
                            accept="image/*"
                            style={{ display: 'none' }}
                          />
                          <FormLabel htmlFor="productImgName">
                            <Button variant="outlined" component="span" fullWidth style={{ textTransform: 'none' }}>
                              Upload Product Image
                            </Button>
                          </FormLabel>
                          <div>
                            {values.productImgName && (
                              <p style={{ margin: '0', paddingTop: '8px' }}>Selected Image: {values.productImgName}</p>
                            )}
                          </div>
                          <ErrorMessage name="productImgName" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12}>
                          <Button type="submit" color="primary" size="large" style={{ marginTop: '1rem' }}>
                            Submit
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
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} placeholder="Products" />

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
                      let { productId, productName, description, category, minQty, productImgPath, quantityInStock } = row;
                      const selectedUser = selected.indexOf(productId) !== -1;
                      productImgPath = `http://localhost:4469/${productImgPath}`;

                      return (
                        <>
                          <TableRow hover key={productId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, productId)} />
                            </TableCell>
                            <TableCell align="left">{productId}</TableCell>

                            <TableCell align="left">
                              <Typography noWrap>{productName}</Typography>
                            </TableCell>
                            <TableCell align="left">
                              <img className="w-[130px] " src={productImgPath || blankImg} alt="img" />
                            </TableCell>

                            <TableCell align="left">{description}</TableCell>

                            <TableCell align="left">{category}</TableCell>

                            <TableCell align="left">{quantityInStock}</TableCell>
                            <TableCell align="left">{minQty}</TableCell>

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
                      <TableCell align="center" colSpan={9} sx={{ py: 3 }}>
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
                      <TableCell align="center" colSpan={9} sx={{ py: 3 }}>
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
