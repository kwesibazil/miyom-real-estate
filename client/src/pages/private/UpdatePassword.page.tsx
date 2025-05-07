import { Navigate} from "react-router-dom";
import {useAppSelector} from '@hooks/useRedux.hook';
import { selectIsLoggedIn, selectFirstLogin} from '@store/features/auth/AuthSlice.store';


import ToggleTheme from "@components/buttons/toggle";
import SetPasswordForm from "@components/forms/SetPasswordForm";
import '@components/Header/Header.css'


export default function FirstTimeLogin():React.JSX.Element{
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isFirstLogin = useAppSelector(selectFirstLogin);

  if(!isLoggedIn) return <Navigate to='/' replace />
  if(!isFirstLogin) return  <Navigate to='/dashboard' replace />
  

  return(
    <section className="px-5">
      <Header/>
      <SetPasswordForm />
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
