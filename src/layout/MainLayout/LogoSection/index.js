import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from './IMS.svg';
// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import config from 'config';
// import Logo from 'ui-component/Logo';
import { MENU_OPEN } from 'store/actions';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} component={Link} to={config.defaultPath}>
      {/* <Logo />
       */}
      <div className=" ">
        <img src={logo} alt="this is logo" className="w-[100px] h-[60px] ml-10" />
      </div>
    </ButtonBase>
  );
};

export default LogoSection;
