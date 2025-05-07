import DOMPurify from 'dompurify';
import {useState } from 'react';
import { Navigate} from "react-router-dom";

import { validatePasswordAsync} from '@helpers/utils.helpers';
import { loginThunk } from '@store/features/auth/AuthThunk.store';
import { useAppDispatch, useAppSelector } from '@hooks/useRedux.hook';
import { LoginPayload } from '@store/features/auth/authStore.interface';
import { selectIsLoggedIn} from '@store/features/auth/AuthSlice.store';


import PasswordInput from '@components/inputs/PasswordInput';
import EmailInput from '@components/inputs/EmailInput';
import SubmitBtn from '@components/buttons/SubmitBtn';
import HeroImage from './HeroImage';
import './Landing.page';



interface SwapFormProp{
  swapForm: (name: any) => void
}


function LoginForm ({swapForm}: SwapFormProp){
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  if(isLoggedIn) return <Navigate to='/new-password' replace />

  return(
    <section className="d-flex login-form shadow">
      <div className="col d-none d-xl-block info-container">
        <h1 className='fs-2 mb-3 fw-bold'>Welcome to Mioym Investment</h1>
        <p className='fs-7'>Your path to thriving real estate returns, guided by expert advice and strong partnerships</p>
        <div className='info-image-container'>
          <HeroImage/>
        </div>
      </div>
      <Form swapForm={swapForm}/>
    </section>
  )
}


const Form = ({swapForm}: SwapFormProp) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState({error:false, message:''});
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const handleSubmit = async(event:React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setError({error:false, message:''});

      const payload:LoginPayload = {
        email:DOMPurify.sanitize(email),
        password: DOMPurify.sanitize(password)
      };
      
      await validatePasswordAsync(payload.password);
      await dispatch(loginThunk(payload)).unwrap();
    } catch (error:any) {
      setError(_ => ({error: true, message: error.message}))  
    }
  }



  return(
    <article className="col text-center form-container">
      <h1 className='mb-5 fw-bold'>Welcome Back</h1>
      <form className='form-body mb-5 position-relative' onSubmit={handleSubmit}>
        <EmailInput 
          onChange={e => setEmail(e.target.value)} 
          value={email}
        />
        
        <PasswordInput 
          label="Password" 
          value={password}
          name='current-password'
          onChange={e => setPassword(e.target.value)} 
          placeholder="Enter your password" 
        />

        <span 
          onClick={()=> swapForm('forgot')} 
          className="forgot-password-btn ms-auto form-link">
          Forgot Password?
        </span>

        <ErrorFeedback error={error.error} message={error.message}/>
        <SubmitBtn>Sign In</SubmitBtn>
      </form>
      <p className='form-terms'>
        By continuing, you confirm that you have read and agreed 
        <br/>to our Terms and Conditions and Privacy Policy.
      </p>
    </article>
  )
}




const ErrorFeedback = ({error, message}: {error: boolean, message:string}) => {
  return(
    <div className='feedback-container'>
      {
        error &&
          <p className='text-danger mb-2 text-start '>
            {`${message ? message: 'Incorrect email or password'}`}
          </p>
      }
    </div>
  )
}


export default LoginForm;