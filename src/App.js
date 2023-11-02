import { useSelector } from 'react-redux';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
// import index from 'index.css';
import { Route } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
// routing  
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from './layout/NavigationScroll';

import 'tailwindcss/tailwind.css';
// import { CartProvider } from 'hooks/Cart/CartOrders';
import FirebaseRegister from 'views/pages/authentication/auth-forms/AuthRegister';
import CartManager from 'Helpers/CartManager';

// ==============================|| APP ||============================== //
// Define a function to get a cookie by its name
function getCookie(name) {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
}

const App = () => {
  const customization = useSelector((state) => state.customization);
  axios.defaults.baseURL = 'http://localhost:4469';
  axios.defaults.withCredentials = true;
  
  const navigate = useNavigate();

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        if (window.location.pathname !== '/register') {
          console.log('Redirecting to login');
          navigate('/login');
        }
      }
      return Promise.reject(error);
    }
  );
  
  axios.interceptors.request.use(
    (config) => {
      const token = getCookie("Authtoken"); 
      if (token) {
        navigate('/dashboard');
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <CartManager>
          <NavigationScroll>
            {/* <CartProvider> */}
            <Routes>
              <Route path="/register" Component={FirebaseRegister}></Route>
              <Route path="/login" Component={FirebaseRegister}></Route>
            </Routes>
            {/* </CartProvider>/ */}
          </NavigationScroll>
        </CartManager>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
