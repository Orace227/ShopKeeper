// assets
import { IconFileSpreadsheet, IconHistory } from '@tabler/icons';

// constant
const icons = { IconFileSpreadsheet, IconHistory };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const Survey = {
  id: 'Feedback',
  type: 'group',
  children: [
    {
      id: 'History',
      title: 'survey History',
      type: 'item',
      url: '/SurveyHistory',
      icon: icons.IconHistory,
      breadcrumbs: false
    }
  ]
};

export default Survey;
