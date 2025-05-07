import { useState, useCallback } from "react";

import LoginForm from "./LoginForm";
import ToggleTheme from "@components/buttons/toggle";
import ForgotPasswordForm from "./ForgotPasswordForm";
import '@components/Header/Header.css'


export default function LoginPage():React.JSX.Element{
  const [form, setForm] = useState('login')
  const swapForm = useCallback((name:string) => setForm(name),[])
  

  
  return(
    <section className="px-5">
      <Header/>
      {form === 'login' && <LoginForm swapForm={swapForm}/> }
      {form === 'forgot' && <ForgotPasswordForm swapForm={swapForm}/>}
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