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
      title: 'Products',
      type: 'collapse',
      icon: icons.IconPackages,
      children: [
        {
          id: 'Products',
          title: 'Products',
          type: 'item',
          url: '/Products',
          breadcrumbs: false
        },
        {
          id: 'CreateProducts',
          title: 'Create Products',
          type: 'item',
          url: '/CreateProducts',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default orders;
