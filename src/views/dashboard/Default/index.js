import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// ==============================|| DEFAULT DASHBOARD ||============================== //
const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleNotification = async () => {
    try {
      const Notification = await axios.get('/GetOrders?Status=pending');
      console.log(Notification.data.existedOrders);
      const NotificationArr = Notification.data.existedOrders;
      if (NotificationArr.length > 0) {
        let Message = `${NotificationArr.length} Order is pending`;
        toast.error(Message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          onClick: () => {
            navigate('/PendingOrders');
          }
        });
        NotificationArr.forEach((element) => {
          if (element.Status !== 'pending') {
            element.ShopkeeperNotification = false;
            const offNotification = axios.post('/UpdateOrder', element);
            if (offNotification) {
              console.log(offNotification);
            }
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(false);
    handleNotification();
  }, []);

  return (
    <>
      <ToastContainer />
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <EarningCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <TotalOrderLineChartCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <TotalIncomeDarkCard isLoading={isLoading} />
                </Grid>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <TotalIncomeLightCard isLoading={isLoading} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={8}>
              <TotalGrowthBarChart isLoading={isLoading} />
            </Grid>
            <Grid item xs={12} md={4}>
              <PopularCard isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
