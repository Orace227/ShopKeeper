import React, { useState, useEffect } from 'react';
import { IconButton, Button } from '@mui/material';
import Iconify from '../../components/iconify';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const ProductTable = ({ row, handleCloseEditModal }) => {
  const { products } = row;
  console.log({ products });
  const [remarksMap, setRemarksMap] = useState({});
  const [QtyMap, setQtyMap] = useState({});
  const [updatedProducts, setUpdatedProduct] = useState([]);
  // const [UpdatedQuantity, setUpdatedQuantity] = useState([]);

  const handleRemarksChange = (productId, remarks) => {
    setRemarksMap((prevRemarks) => ({
      ...prevRemarks,
      [productId]: remarks
    }));
  };
  const handleQTYChange = (productId, QTY, QTYinStock) => {
    // const parsedQTY = parseInt(QTY, 10); // Parse the input as an integer

    // Check if the parsed quantity is not more than QTYinStock
    if ((/^[1-9]\d*$/.test(QTY) || QTY == '') && QTY <= QTYinStock) {
      setQtyMap((prevQty) => ({
        ...prevQty,
        [productId]: QTY
      }));
    }
    console.log(QtyMap);
  };
  const handleQTY = (productId, QTY) => {
    // const parsedQTY = parseInt(QTY, 10); // Parse the input as an integer

    // Check if the parsed quantity is not more than QTYinStock
    if (/^[1-9]\d*$/.test(QTY) || QTY == '') {
      setQtyMap((prevQty) => ({
        ...prevQty,
        [productId]: QTY
      }));
    }
    console.log(QtyMap);
  };

  const addQuantitiesForAllProducts = (products) => {
    products?.forEach((product) => {
      console.log(product);
      handleQTY(product.productId, product.actualQuantity);
    });
  };

  const handleAcceptSpecificOrder = async (product) => {
    try {
      product.Status = 'approved';
      const productId = product.productId;
      const remark = remarksMap[productId] || ''; // Get the remark from remarksMap
      const Qty = QtyMap[productId] || ''; // Get the remark from remarksMap
      // Update the product's remarks field with the retrieved remark
      const updatedProduct = { ...product, remarks: remark, updatedQuantity: Qty };
      console.log(updatedProduct);
      const Products = [...updatedProducts, updatedProduct];
      console.log(Products);
      setUpdatedProduct(Products);
      console.log({ products: updatedProducts });
    } catch (err) {
      console.log({ error: err });
    }
  };
  const handleCancelSpecificOrder = async (product) => {
    try {
      product.Status = 'canceled';
      const productId = product.productId;
      const remark = remarksMap[productId] || ''; // Get the remark from remarksMap
      // const Qty = QtyMap[productId] || '';
      const updatedProduct = { ...product, remarks: remark };
      console.log(updatedProduct);
      const Products = [...updatedProducts, updatedProduct];
      console.log(Products);
      setUpdatedProduct(Products);
      console.log({ products: updatedProducts });
    } catch (err) {
      console.log({ error: err });
    }
  };
  const handleEdit = async (row) => {
    row.products = updatedProducts;
    row.Status = 'attended';
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    row.updatedAt = formattedDate;
    row.EmployeeNotification = true;
    console.log(row);
    let approved = confirm(`Are you sure you want to approve?cancel partially this Order No: ${row.orderId}?`);
    if (approved) {
      const updatedOrder = await axios.post('/UpdateOrder', row);
      console.log(row.products);
      for (let i = 0; i <= row.products.length; i++) {
        console.log(row.products[i]);
        let productData = row.products[i];
        if (row?.products[i]?.Status === 'approved') {
          const updatedQty = await axios.post(`/UpdateProductsQty?Quantity=${row.products[i].updatedQuantity}`, productData);
          console.log(updatedQty);
        }
      }
      if (updatedOrder) {
        console.log(updatedOrder);
        handleCloseEditModal();
        toast.success('Order Partially Approve Successfully!!');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }
  };

  useEffect(() => {
    addQuantitiesForAllProducts(products);

    // Call the function with the array of products and the desired quantity
    // console.log({ QtyMap });
  }, []);

  return (
    <>
      <div className="overflow-x-auto">
        <Toaster />
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-200 text-left">ID</th>
              <th className="px-6 py-3 bg-gray-200 text-left">Purchaser Name</th>
              <th className="px-6 py-3 bg-gray-200 text-left">Department</th>
              <th className="px-6 py-3 bg-gray-200 text-left">Mobile No</th>
              <th className="px-6 py-3 bg-gray-200 text-left">Designation</th>
              <th className="px-6 py-3 bg-gray-200 text-left">Title</th>
              <th className="px-6 py-3 bg-gray-200 text-left">Category</th>
              <th className="px-6 py-3 bg-gray-200 text-left">Description</th>
              <th className="px-6 py-3 bg-gray-200 text-left">Image</th>
              <th className="px-6 py-3 bg-gray-200 text-left">Quantity</th>
              <th className="px-6 py-3 bg-gray-200 text-left">Quantity in Stock</th>
              <th className="px-6 py-3 bg-gray-200 text-left">Remarks</th>
              <th className="px-6 py-3 bg-gray-200 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => {
              // Check if the product's ID is in updatedProducts
              if (updatedProducts.some((updatedProduct) => updatedProduct.productId === product.productId)) {
                return null; // Don't render the product if it's in updatedProducts
              } else if (products?.length == 0) {
                return;
              }

              return (
                <tr key={product.productId}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.productId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">bhavin</td>
                  <td className="px-6 py-4 whitespace-nowrap">bhavin</td>
                  <td className="px-6 py-4 whitespace-nowrap">bhavin</td>
                  <td className="px-6 py-4 whitespace-nowrap">bhavin</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={product.productImgPath} alt={product.title} className="max-w-xs h-[100px]" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={QtyMap[product.productId]}
                      onChange={(e) => handleQTYChange(product.productId, e.target.value, product.availableQuantity)}
                      className="w-[200px] px-3 py-4 border rounded"
                      placeholder="Edit Quantity"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.availableQuantity}</td>

                  <td className="px-6 py-4 w-auto">
                    <textarea
                      value={remarksMap[product.productId] || ''}
                      onChange={(e) => handleRemarksChange(product.productId, e.target.value)}
                      className="w-[200px] h-[100px] px-3 py-4 border rounded"
                      placeholder="Add remarks"
                    />
                    {(remarksMap[product?.productId] || '').length < 20 && (
                      <p className="mt-1 text-xs text-red-500">*Please enter Remark for cancelation</p>
                    )}
                  </td>
                  <td className="px-6 py-4 w-auto">
                    <IconButton
                      size="large"
                      color="inherit"
                      className="bg-green-300 hover:bg-green-500"
                      onClick={() => {
                        handleAcceptSpecificOrder(product);
                      }}
                    >
                      <Iconify icon={'eva:checkmark-outline'} /> {/* Accept icon */}
                    </IconButton>
                    <IconButton
                      size="large"
                      className="bg-red-300 hover:bg-red-500 mt-2"
                      color="inherit"
                      onClick={() => {
                        handleCancelSpecificOrder(product);
                      }}
                      disabled={(remarksMap[product?.productId] || '').length < 20}
                    >
                      <Iconify icon={'eva:close-outline'} />
                    </IconButton>
                  </td>
                </tr>
              );
            })}
            {products?.length > 0 &&
              products?.filter((product) => !updatedProducts.some((updatedProduct) => updatedProduct.productId === product.productId))
                .length === 0 && (
                <tr>
                  <td colSpan="13" className="text-center py-4">
                    <div className="bg-gray-200 p-4 border  border-gray-300 rounded">
                      <h1 className="text-2xl font-bold text-red-500">No products here for Action</h1>
                      <h1>
                        Click on <span className="font-bold text-blue-500">Finish Order</span> to Complete Order
                      </h1>
                    </div>
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      <Button
        className=" bg-purple-400 hover:text-black hover:bg-purple-600 text-black hover:scale-105"
        color="primary"
        size="large"
        style={{ marginTop: '1rem' }}
        onClick={() => {
          handleEdit(row);
        }}
      >
        Finish Order
      </Button>
    </>
  );
};

export default ProductTable;
