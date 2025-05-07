import { Navigate, useNavigate} from "react-router-dom";
import {useAppSelector} from '@hooks/useRedux.hook';
import { selectIsLoggedIn, selectFirstLogin} from '@store/features/auth/AuthSlice.store';

import { useAppDispatch } from "@hooks/useRedux.hook";

import ToggleTheme from "@components/buttons/toggle";
import SetPasswordForm from "@components/forms/SetPasswordForm";
import '@components/Header/Header.css'


import { logoutThunk } from '@store/features/auth/AuthThunk.store';
import { resetAuthState } from "@store/features/auth/AuthSlice.store";
import { resetDisplayState } from "@store/features/display/DisplaySlice.store";
import { resetPropertyState } from "@store/features/property/PropertySlice.store";



export default function FirstTimeLogin():React.JSX.Element{
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isFirstLogin = useAppSelector(selectFirstLogin);

  if(!isLoggedIn) return <Navigate to='/' replace />
  if(!isFirstLogin) return  <Navigate to='/dashboard' replace />

  
  const logout = async() => {
    try { 
      dispatch(resetAuthState());
      dispatch(resetDisplayState());
      dispatch(resetPropertyState());
      dispatch(logoutThunk());
      sessionStorage.clear();
      navigate('/')
    } catch (error) {}
  }
  


  return(
    <section className="px-5 ">
      <Header/>
      <SetPasswordForm />

      <button onClick={logout} className="btn btn-link return-home-btn mb-4">
        Exit
      </button>

    </section>
  )
}


const Header = () => {
  return(
    <header className="d-flex justify-content-between py-4">
      <div className="header-brand"><h1>MIOYM</h1></div>
      <div className="d-flex">
      <ToggleTheme />
      </div>
    </header>
  )
}
