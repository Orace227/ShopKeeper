import React, { useEffect, useState } from 'react';
import './Cartcss.css';
import { syncCartWithDatabase } from 'EndPoints/CreateOrder';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
const Cart = () => {
  const [cartItems, setCart] = useState([]);
  const [orderName, setOrderName] = useState(''); // State for order name

  // Function to update the quantity of an item in the cart
  const updateItemQuantity = (itemId, newQuantity) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
    syncCartWithDatabase(updatedCart);
  };

  const handleOrderNameChange = (e) => {
    setOrderName(e.target.value);
  };

  const fetchCartData = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(localCart);

      // const response = await axios.get('/GetCarts?cartId=123456');
      // const serverCart = response.data.existedOrder[0].Products;

      // console.log(serverCart);
      // setCart(serverCart);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleDelete = async (key) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart'));
      const updatedCart = cart.filter((item) => item.id !== key);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
      syncCartWithDatabase(updatedCart);
    } catch (err) {
      console.log(err);
    }
  };
  function generateRandom6DigitNumber() {
    // Generate a random number between 100,000 (inclusive) and 999,999 (inclusive).
    const min = 100000;
    const max = 999999;
    const random6DigitNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return random6DigitNumber;
  }

  const handleSubmit = async () => {
    try {
      let cartData = {};
      console.log('in submit:', { cartItems });

      cartData.cartId = 123456;
      cartData.orderId = generateRandom6DigitNumber();
      cartData.title = orderName;
      cartData.products = cartItems;
      console.log('in submit after change:', cartData);
      const createOrder = await axios.post('/CreateOrder', cartData);
      if (createOrder) {
        console.log(createOrder);
        toast.success('Your Order placed successfully!!');
        localStorage.setItem('cart', '[]');
        const createdCart = await axios.post('/CreateCart', cartData);
        if (createdCart) {
          console.log(createdCart);
        }

        window.location.reload();
      } else {
        toast.error('Your Order is not placed successfully!!! please try again');
      }
    } catch (err) {
      toast.error('Your Order is not placed successfully!!! please try again');
      console.log(err);
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      <h1 className=" text-3xl font-bold">Cart Items</h1>
      <div className="flex items-baseline">
        <h1 className="text-lg font-semibold ">Order Name: </h1>
        <input
          type="text"
          className="mb-10 text-md outline-none ml-2 bg-inherit border rounded-lg  p-2"
          placeholder="Enter Title of Order"
          value={orderName}
          onChange={handleOrderNameChange}
        />
      </div>
      <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
        <div className="rounded-lg md:w-2/3">
          {cartItems.length !== 0 ? (
            <div className="max-h-[90vh] overflow-y-auto scrollbar">
              {cartItems.map((item) => (
                <CartItemDetail
                  key={item.id}
                  id={item.id}
                  imageSrc={item.imageUrl}
                  title={item.title}
                  description={item.description}
                  quantity={item.quantity}
                  price="259.000 ₭"
                  onDelete={handleDelete}
                  updateItemQuantity={updateItemQuantity} // Pass the updateItemQuantity function
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center md:h-full">
              <h1 className="text-center text-3xl text-red-500">Please Choose Item to make an order!!</h1>
            </div>
          )}
        </div>
        {cartItems.length !== 0 && (
          <div className="mt-6 md:h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
            <SubTotal cartItems={cartItems} handleSubmit={handleSubmit} orderName={orderName} toast={toast} />
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

const CartItemDetail = ({ id, imageSrc, title, description, quantity, onDelete, updateItemQuantity }) => {
  const [productQuantity, setProductQuantity] = useState(quantity);

  const handleIncrement = () => {
    const newQuantity = productQuantity + 1;
    setProductQuantity(newQuantity);
    updateItemQuantity(id, newQuantity); // Update the quantity in the cart
  };

  const handleDecrement = () => {
    if (productQuantity > 1) {
      const newQuantity = productQuantity - 1;
      setProductQuantity(newQuantity);
      updateItemQuantity(id, newQuantity); // Update the quantity in the cart
    }
  };

  const handleQuantityChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d+$/.test(inputValue)) {
      const newQuantity = parseInt(inputValue, 10);
      if (newQuantity >= 1) {
        setProductQuantity(newQuantity);
        updateItemQuantity(id, newQuantity); // Update the quantity in the cart
      }
    }
  };

  return (
    <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="h-6 w-6 cursor-pointer absolute top-2 right-2 duration-150 hover-text-red-500"
        onClick={() => onDelete(id)}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      <img src={imageSrc} alt="product" className="w-full h-[100px] rounded-lg sm:w-40" />
      <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
        <div className="mt-5 sm:mt-0">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-xs text-gray-700">{description}</p>
        </div>
        <div className="flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
          <div className="mt-10 flex items-center border-gray-100">
            <button
              className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover-bg-blue-500 hover-text-blue-50"
              onClick={handleDecrement}
            >
              -
            </button>
            <input
              className="h-7 w-16 border bg-white text-center text-xs outline-none"
              type="text"
              value={productQuantity}
              onInput={handleQuantityChange}
            />
            <button
              className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover-bg-blue-500 hover-text-blue-50"
              onClick={handleIncrement}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubTotal = ({ cartItems, handleSubmit, orderName }) => {
  return (
    <>
      <div className="flex justify-between">
        <p className="text-lg font-medium">Products</p>
        <div>
          <p className="text-lg font-medium">Quantity</p>
        </div>
      </div>
      <hr className="my-2" />

      <div>
        {cartItems.map((item, index) => (
          <div key={index} className="flex justify-between">
            <p className="text-md font-normal">{item.title}</p>
            <p className="text-md font-normal">{item.quantity}</p>
          </div>
        ))}
      </div>
      <hr className="my-2" />

      <div className="flex justify-between">
        <p className="text-lg">Total items</p>
        <div>
          <p className="mb-1 text-lg font-bold">{cartItems.length}</p>
        </div>
      </div>
      <hr className="my-2" />
      <button
        className={`w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover-bg-blue-600 ${
          !orderName.trim() ? 'cursor-not-allowed' : ''
        }`}
        onClick={() => {
          if (!orderName.trim()) {
            toast.error('Please Enter your order name');
          } else {
            handleSubmit();
          }
        }}
        disabled={!orderName.trim()}
      >
        Check out
      </button>
      {!orderName.trim() && <p className="mt-1 text-xs text-red-500">*Please enter your order name</p>}
    </>
  );
};

export default Cart;
