import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import History from 'views/Orders/History';
import NotFound from '404Notfound/404page';
import PendingOrders from 'views/Orders/PendingOrders';
import OrderView from 'views/Orders/OrderView';
import AttendedOrders from 'views/Orders/AttendedOrders';
import CreateProducts from 'views/Products/CreateProducts';
import CreateCategory from 'views/Category/CreateCategory';
import Products from 'views/Products/Products';
import Categories from 'views/Category/Categories';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router';
import Survey from 'views/SurveyForm/Survey';
import SurveyOrderView from 'views/SurveyForm/SurveyOrderView';
import CreateSubCategory from 'views/SubCategory/CreateSubCategory';
import SubCategory from 'views/SubCategory/SubCategory';
// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
// const Customers = Loadable(lazy(() => import('views/Products/Customers')));

const auth = Cookies.get('Authtoken');

// Define a function to render DashboardDefault or a redirect
function renderDashboardRoute() {
  if (auth) {
    return <DashboardDefault />;
  } else {
    return <Navigate to="/login" />;
  }
}
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: renderDashboardRoute()
    },
    {
      path: '/dashboard',
      element: renderDashboardRoute()
    },
    {
      path: '/OrderHistory',
      element: <History />
    },
    {
      path: '/PendingOrders',
      element: <PendingOrders />
    },
    {
      path: '/OrderView/:orderId',
      element: <OrderView />
    },
    {
      path: '/AttendedOrders',
      element: <AttendedOrders />
    },
    {
      path: '/CreateProducts',
      element: <CreateProducts />
    },
    {
      path: '/CreateCategories',
      element: <CreateCategory />
    },

    {
      path: '/Products',
      element: <Products />
    },
    {
      path: '/Categories',
      element: <Categories />
    },
    {
      path: '/SurveyHistory',
      element: <Survey />
    },
    {
      path: '/SurveyOverView/:surveyId',
      element: <SurveyOrderView />
    },
    {
      path: '/CreateSubCategory',
      element: <CreateSubCategory />
    },
    {
      path: '/SubCategory',
      element: <SubCategory />
    },
    {
      path: '*',

      element: <NotFound />
    }
  ]
};

export default MainRoutes;
