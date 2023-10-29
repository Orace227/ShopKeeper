// assets
import { IconDashboard } from '@tabler/icons';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const pages = {
  id: 'dashboard',
  title: 'Buy Products',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Buy Products',
      type: 'item',
      url: '/Categories',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default pages;
