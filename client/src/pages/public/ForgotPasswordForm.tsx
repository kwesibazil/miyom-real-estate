import DOMPurify from 'dompurify';
import { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";

import { forgotPasswordThunk } from '@store/features/auth/AuthThunk.store';
import { useAppDispatch, useAppSelector } from '@hooks/useRedux.hook';
import { selectIsLoggedIn, selectAuthStatus } from '@store/features/auth/AuthSlice.store';

import { FaLock } from "react-icons/fa";

import EmailInput from '@components/inputs/EmailInput';
import SubmitBtn from '@components/buttons/SubmitBtn';
import './landingPage.css';




interface SwapFormProp {
  swapForm: (name: any) => void
}

function ForgotPasswordForm ({swapForm}: SwapFormProp){
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthStatus);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const [email, setEmail] = useState<string>('')
  const [show, setShow] =  useState(false);


  const handleClick = () => {
    if(loading !== 'pending')
      swapForm('login')
  }

  useEffect(()=>{
    return () => setShow(false)
  },[])


  const handleSubmit = async(event:React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const sanitizedEmail = DOMPurify.sanitize(email);      
      await dispatch(forgotPasswordThunk(sanitizedEmail)).unwrap();
      setShow(true);
    } catch (error:any) {
      setShow(true)
    }
  }

  if(isLoggedIn) return <Navigate to='/new-password' replace />  

  return(
    <section className="d-flex login-form shadow reset-password-form">
      <article className="col text-center form-container py-5">
        <FaLock className='fs-1 mb-4'/>
        <h1 className='mb-3 fw-bold'>Reset Password</h1>
        <form className='form-body mb-3 position-relative' onSubmit={handleSubmit}>
          <EmailInput onChange={e => setEmail(e.target.value)} value={email} />
            <SubmitBtn >Reset Password</SubmitBtn>
          <div className='w-100'>
            <p className='mt-2 text-center fs-7'>Remember password?
              <span onClick={handleClick} className="ms-2 form-link text-capitalize fw-medium">Login In</span>
            </p>
          </div>
          <Feedback show={show}/>
        </form>
        <p className='form-terms'>
          By continuing, you confirm that you have read and agreed 
          <br/>to our Terms and Conditions and Privacy Policy.
        </p>
      </article>
    </section>
  )
}




const Feedback = ({show}:{show:boolean}) => {
  return(
    <div className='feedback-container  bg-dangers'>
      {
        show &&
        <p className='text-danger mb-1 fs-6 text-start '>
          If account exists, a password reset link has been sent. Please check your inbox for further details.
        </p>
      }
    </div>
  )
}



export default ForgotPasswordForm;