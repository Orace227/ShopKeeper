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
  Dialog,
  DialogTitle,
  DialogContent,
  // DialogActions,
  Grid,
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
import ProductTable from './ProductTable';

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
      // console.log(row);
      const user = USERLIST.find((user) => user.orderId == row.orderId);
      // console.log(user);
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
      const newSelecteds = USERLIST.map((n) => n.orderId);
      setSelected(newSelecteds);
    } else {
      // If the checkbox is unchecked, clear the selection
      setSelected([]);
    }
  };
  const handleClick = (event, orderId) => {
    const selectedIndex = selected.indexOf(orderId);
    let newSelected = [];

    if (selectedIndex === -1) {
      // If the item is not selected, add it to the selection
      newSelected = [...selected, orderId];
    } else if (selectedIndex >= 0) {
      // If the item is selected, remove it from the selection
      newSelected = selected.filter((id) => id !== orderId);
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

  const handleDeleteOrder = async (row) => {
    try {
      // row.products = updatedProducts;
      row.Status = 'canceled';
      row.products.forEach((product) => {
        console.log(product);
        product.Status = 'canceled';
        product.updatedQuantity = product.actualQuantity;
      });
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
      row.updatedAt = formattedDate;
      row.EmployeeNotification = true;
      console.log(row);
      let canceled = confirm(`Are you sure you want to canceled this Order No: ${row.orderId}?`);
      if (canceled) {
        const updatedOrder = await axios.post('/UpdateOrder', row);
        if (updatedOrder) {
          console.log(updatedOrder);
          handleCloseEditModal();
          toast.success('Whole Order Canceled successfully!!');
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      }
    } catch (err) {
      console.log({ error: err });
    }
  };

  const handleAcceptedOrder = async (row) => {
    // row.products = updatedProducts;
    row.Status = 'approved';
    row.products.forEach((product) => {
      console.log(product);
      product.Status = 'approved';
      product.updatedQuantity = product.actualQuantity;
    });
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    row.updatedAt = formattedDate;
    row.EmployeeNotification = true;
    console.log(row);
    let approved = confirm(`Are you sure you want to approve this Order No: ${row.orderId}?`);
    if (approved) {
      const updatedOrder = await axios.post('/UpdateOrder', row);
      if (updatedOrder) {
        console.log(updatedOrder);
        handleCloseEditModal();
        toast.success('Whole Order Approved successfully!!');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }
  };

  // const handleEdit = (row) => {
  //   row.products = updatedProducts;
  //   console.log('this is main order :', row);
  // };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

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
            <DialogTitle className="text-lg">Give Remarks</DialogTitle>
            <DialogContent>
              <Container>
                <>
                  {/* {console.log(editedUserData)} */}

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={7}>
                      <div className={`text-2xl `}>
                        <h1 className="font-bold">
                          Title:<span className="font-semibold"> {editedUserData.title}</span>
                        </h1>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <div
                        className={`p-1 w-[90px]  rounded-full text-center ${
                          editedUserData.Status === 'pending'
                            ? 'bg-yellow-200'
                            : Status === 'approved'
                            ? 'bg-green-200'
                            : Status === 'canceled'
                            ? 'bg-red-200'
                            : ''
                        }`}
                      >
                        {editedUserData.Status}
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <ProductTable row={editedUserData} handleCloseEditModal={handleCloseEditModal} />
                    </Grid>
                  </Grid>
                </>
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
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, orderId)} />
                            </TableCell>
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
                                className="bg-green-300 hover:bg-green-500"
                                onClick={() => {
                                  handleAcceptedOrder(row);
                                }}
                              >
                                <Iconify icon={'eva:checkmark-outline'} /> {/* Accept icon */}
                              </IconButton>
                              <IconButton
                                size="large"
                                className="bg-blue-300 hover:bg-blue-500 ml-2"
                                color="inherit"
                                onClick={() => {
                                  // handleDeleteOrder(row);
                                  handleOpenEditModal(row);
                                }}
                              >
                                <Iconify icon={'eva:edit-outline'} />
                              </IconButton>
                              <IconButton
                                size="large"
                                className="bg-red-300 hover:bg-red-500 ml-2"
                                color="inherit"
                                onClick={() => {
                                  handleDeleteOrder(row);
                                }}
                              >
                                <Iconify icon={'eva:close-outline'} />
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
// const ProductTable = ({ row }) => {
//   const { products } = row;
//   console.log({ products });
//   const [remarksMap, setRemarksMap] = useState({});
//   const [QtyMap, setQtyMap] = useState({});
//   const [updatedProducts, setUpdatedProduct] = useState([]);

//   const handleRemarksChange = (productId, remarks) => {
//     setRemarksMap((prevRemarks) => ({
//       ...prevRemarks,
//       [productId]: remarks
//     }));
//   };
//   const handleQTYChange = (productId, QTY, QTYinStock) => {
//     // const parsedQTY = parseInt(QTY, 10); // Parse the input as an integer

//     // Check if the parsed quantity is not more than QTYinStock
//     if ((/^[1-9]\d*$/.test(QTY) || QTY == '') && QTY <= QTYinStock) {
//       setQtyMap((prevQty) => ({
//         ...prevQty,
//         [productId]: QTY
//       }));
//     }
//   };
//   const addQuantitiesForAllProducts = (products) => {
//     products?.forEach((product) => {
//       handleQTYChange(product.id, product.actualQuantity, 100);
//     });
//   };

//   const handleAcceptSpecificOrder = async (product) => {
//     try {
//       product.Status = 'approved';
//       const productId = product.id;
//       const remark = remarksMap[productId] || ''; // Get the remark from remarksMap
//       const Qty = QtyMap[productId] || ''; // Get the remark from remarksMap
//       // Update the product's remarks field with the retrieved remark
//       const updatedProduct = { ...product, remarks: remark, updatedQuantity: Qty };
//       console.log(updatedProduct);
//       const Products = [...updatedProducts, updatedProduct];
//       console.log(Products);
//       setUpdatedProduct(Products);
//       console.log({ products: updatedProducts });
//     } catch (err) {
//       console.log({ error: err });
//     }
//   };
//   const handleCancelSpecificOrder = async (product) => {
//     try {
//       product.Status = 'canceled';
//       const productId = product.id;
//       const remark = remarksMap[productId] || ''; // Get the remark from remarksMap
//       const Qty = QtyMap[productId] || '';
//       const updatedProduct = { ...product, remarks: remark, updatedQuantity: Qty };
//       console.log(updatedProduct);
//       const Products = [...updatedProducts, updatedProduct];
//       console.log(Products);
//       setUpdatedProduct(Products);
//       console.log({ products: updatedProducts });
//     } catch (err) {
//       console.log({ error: err });
//     }
//   };
//   const handleEdit = (row) => {
//     row.products = updatedProducts;
//     console.log(row);
//   };

//   useEffect(() => {
//     // Call the function with the array of products and the desired quantity
//     addQuantitiesForAllProducts(products);
//     // console.log({ QtyMap });
//   }, []);

//   return (
//     <>
//       <div className="overflow-x-auto">
//         <table className="min-w-full">
//           <thead>
//             <tr>
//               <th className="px-6 py-3 bg-gray-200 text-left">ID</th>
//               <th className="px-6 py-3 bg-gray-200 text-left">Purchaser Name</th>
//               <th className="px-6 py-3 bg-gray-200 text-left">Department</th>
//               <th className="px-6 py-3 bg-gray-200 text-left">Mobile No</th>
//               <th className="px-6 py-3 bg-gray-200 text-left">Designation</th>
//               <th className="px-6 py-3 bg-gray-200 text-left">Title</th>
//               <th className="px-6 py-3 bg-gray-200 text-left">Category</th>
//               <th className="px-6 py-3 bg-gray-200 text-left">Description</th>
//               <th className="px-6 py-3 bg-gray-200 text-left">Image</th>
//               <th className="px-6 py-3 bg-gray-200 text-left">Quantity</th>
//               <th className="px-6 py-3 bg-gray-200 text-left">Quantity in Stock</th>
//               <th className="px-6 py-3 bg-gray-200 text-left">Remarks</th>
//               <th className="px-6 py-3 bg-gray-200 text-left">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products?.map((product) => {
//               // Check if the product's ID is in updatedProducts
//               if (updatedProducts.some((updatedProduct) => updatedProduct.id === product.id)) {
//                 return null; // Don't render the product if it's in updatedProducts
//               } else if (products?.length == 0) {
//                 return;
//               }

//               return (
//                 <tr key={product.id}>
//                   <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">bhavin</td>
//                   <td className="px-6 py-4 whitespace-nowrap">bhavin</td>
//                   <td className="px-6 py-4 whitespace-nowrap">bhavin</td>
//                   <td className="px-6 py-4 whitespace-nowrap">bhavin</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{product.title}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{product.description}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <img src={product.imageUrl} alt={product.title} className="max-w-xs h-[100px]" />
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <input
//                       type="text"
//                       value={QtyMap[product.id]}
//                       onChange={(e) => handleQTYChange(product.id, e.target.value, 100)}
//                       className="w-[200px] px-3 py-4 border rounded"
//                       placeholder="Edit Quantity"
//                     />
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">100</td>
//                   <td className="px-6 py-4 w-auto">
//                     <textarea
//                       value={remarksMap[product.id] || ''}
//                       onChange={(e) => handleRemarksChange(product.id, e.target.value)}
//                       className="w-[200px] h-[100px] px-3 py-4 border rounded"
//                       placeholder="Add remarks"
//                     />
//                     {(remarksMap[product?.id] || '').length < 20 && <p className="mt-1 text-xs text-red-500">*Please enter Remark</p>}
//                   </td>
//                   <td className="px-6 py-4 w-auto">
//                     <IconButton
//                       size="large"
//                       color="inherit"
//                       className="bg-green-300 hover:bg-green-500"
//                       onClick={() => {
//                         handleAcceptSpecificOrder(product);
//                       }}
//                       disabled={(remarksMap[product?.id] || '').length < 20}
//                     >
//                       <Iconify icon={'eva:checkmark-outline'} /> {/* Accept icon */}
//                     </IconButton>
//                     <IconButton
//                       size="large"
//                       className="bg-red-300 hover:bg-red-500 mt-2"
//                       color="inherit"
//                       onClick={() => {
//                         handleCancelSpecificOrder(product);
//                       }}
//                       disabled={(remarksMap[product?.id] || '').length < 20}
//                     >
//                       <Iconify icon={'eva:close-outline'} />
//                     </IconButton>
//                   </td>
//                 </tr>
//               );
//             })}
//             {products?.length > 0 &&
//               products?.filter((product) => !updatedProducts.some((updatedProduct) => updatedProduct.id === product.id)).length === 0 && (
//                 <tr>
//                   <td colSpan="13" className="text-center py-4">
//                     <div className="bg-gray-200 p-4 border  border-gray-300 rounded">
//                       <h1 className="text-2xl font-bold text-red-500">No products here for Action</h1>
//                       <h1>
//                         Click on <span className="font-bold text-blue-500">Finish Order</span> to Complete Order
//                       </h1>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//           </tbody>
//         </table>
//       </div>

//       <Button
//         className=" bg-purple-400 hover:text-black hover:bg-purple-600 text-black hover:scale-105"
//         color="primary"
//         size="large"
//         style={{ marginTop: '1rem' }}
//         onClick={() => {
//           handleEdit(row);
//         }}
//       >
//         Finish Order
//       </Button>
//     </>
//   );
// };
