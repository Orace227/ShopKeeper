import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import History from 'views/Orders/History';
import NotFound from '404Notfound/404page';
import PendingOrders from 'views/Orders/PendingOrders';
import OrderView from 'views/Orders/OrderView';
import AttendedOrders from 'views/Orders/AttendedOrders';
import CreateProducts from 'views/Orders/CreateProducts';
import CreateCategory from 'views/Category/CreateCategory';
import Products from 'views/Products/Products';
import Categories from 'views/Category/Categories';
// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
// const Customers = Loadable(lazy(() => import('views/Products/Customers')));

// sample page routing

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/dashboard',
      element: <DashboardDefault />
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
      path: '*',

      element: <NotFound />
    }
  ]
};

export default MainRoutes;
