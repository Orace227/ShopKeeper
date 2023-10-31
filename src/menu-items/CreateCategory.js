// assets
import { IconPackages } from '@tabler/icons';

// constant
const icons = {
  IconPackages
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const orders = {
  id: 'order',
  type: 'group',
  children: [
    {
      id: 'icons',
      title: 'Categories',
      type: 'collapse',
      icon: icons.IconPackages,
      children: [
        {
          id: 'Categories',
          title: 'Categories',
          type: 'item',
          url: '/Categories',
          breadcrumbs: false
        },
        {
          id: 'CreateCategories',
          title: 'Create Categories',
          type: 'item',
          url: '/CreateCategories',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default orders;
