import PropTypes from 'prop-types';
// import { useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

// assets
// import EarningIcon from 'assets/images/icons/earning.svg';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import Iconify from 'components/iconify';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary,
  color: theme.palette.primary.dark,
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary.dark} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const ShowSurveyForm = ({ isLoading }) => {
  const theme = useTheme();
  // const [disableBtn, setDisableBtn] = useState(false);
  // const [anchorEl, setAnchorEl] = useState(null);

  const handleShowSurvey = async () => {
    const surveyShown = await axios.post('/UpdateSurvey?mainId=9a8b7c');
    // console.log(surveyShown.data.updatedSurvey.matchedCount);
    if (surveyShown.data.updatedSurvey.matchedCount > 0) {
      toast.success('Survey was successfully Shown!!');
    } else {
      toast.error('Survey was not successfully Shown!!!');
    }
  };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Toaster />
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  {/* <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: theme.palette.secondary[800],
                        mt: 1
                      }}
                    >
                      <Iconify icon={'eva:checkmark-outline'} /> 
                    </Avatar>
                  </Grid> */}
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                    <button
                      className={`bg-blue-500 text-white text-lg font-semibold px-4 py-2 mt-2 mb-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 `}
                      onClick={handleShowSurvey}
                      // disabled={disableBtn}
                    >
                      Show Survey
                    </button>
                  </Grid>
                  {/* <Grid item>
                    <Avatar
                      sx={{
                        cursor: 'pointer',
                        ...theme.typography.smallAvatar,
                        backgroundColor: theme.palette.secondary[200],
                        color: theme.palette.secondary.dark
                      }}
                    >
                      <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                    </Avatar>
                  </Grid> */}
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: theme.palette.primary
                  }}
                >
                  Show Survey Form to all Branch Managers
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

ShowSurveyForm.propTypes = {
  isLoading: PropTypes.bool
};

export default ShowSurveyForm;
