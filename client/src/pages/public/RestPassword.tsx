import DOMPurify from 'dompurify';
import { useState,useCallback, useEffect} from 'react';
import { Navigate, useNavigate} from "react-router-dom";


import { selectIsLoggedIn} from '@store/features/auth/AuthSlice.store';
import { useAppDispatch, useAppSelector} from '@hooks/useRedux.hook';


import FormFeedback from '@components/forms/FormFeedback';
import {validatePasswordAsync }from '@helpers/utils.helpers';
import PasswordInput from '@components/inputs/PasswordInput';
import SubmitBtn from '@components/buttons/SubmitBtn';


import { resetPasswordThunk } from '@store/features/auth/AuthThunk.store';

import '@components/Header/Header.css'
import '../../components/forms/forms.css'



export default function ResetPasswordForm(){
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [token, setToken] = useState<string|null>(null)
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'pending' | 'success' | 'failed' | null>(null);


  const handleSubmit = useCallback(async(event:React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()
      setStatus('pending')
      setShowError(false)
      setError('');


      if(!token){                                                                               
        const error = new Error('Missing token. Please ensure you are using a valid link');
        error.name = "CustomError";
        throw error
        return   
      }

      if(newPassword !== confirmPassword){
        const error = new Error('Password do not match');
        error.name = "CustomError";
        throw error
      }

      const clean:string = DOMPurify.sanitize(newPassword)
      await validatePasswordAsync(clean);

      const payload ={
        password: clean,
        token
      }

      const result = await dispatch(resetPasswordThunk(payload)).unwrap(); 
      setStatus('success');
      alert(result.message)
      navigate('/')
      alert('Your password has been successfully updated. You can now log in using your new password');
      
    } catch (error:any) {
      setStatus('failed');
      if(error.name === 'UnauthorizedError')setError('Invalid Link: Please enure you are using a valid link')
      else if(error.name === 'CustomError')setError(error.message)
      else if(error.name === 'ValidationError')setError('Try a password with uppercase, lowercase, etc.')
      else setError('The password reset link is invalid or has expired');
    }
    
  },[newPassword, confirmPassword, dispatch])



  useEffect(()=>{
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    setToken(token)
  },[])


  const onComplete = useCallback(() => {
    if(status === 'success'){
      return
    }
    setShowError(true)  
  }, [status, ]);


  if(isLoggedIn) return <Navigate to='/' replace />
  

  return(
      <section className="d-flex new-password-form shadow">
        <article className="col text-center form-container">
        <h1 className='mb-4 fw-bold position-relative'>Welcome</h1>
        <p className='tag-message mb-4' >For security, please change your temporary password before continuing.</p>
        
        {status && <FormFeedback status={status}  onComplete={onComplete} />}
        {(error && showError) && <Feedback error={error} />}

        <form className='form-body mb-5  position-relative'  onSubmit={handleSubmit}>
          <PasswordInput onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword} name='new-password' label="Password "placeholder="password" classes='mb-4'/>
          <PasswordInput onChange={e => setNewPassword(e.target.value)} value={newPassword} name='new-password' label="Confirm Password "placeholder="confirm password" classes='mb-1'/>
          <p className={`password-hint fs-sm-8 ${showError ? 'text-danger': ''}`}>
          Password must be at least 8 characters long and include at least, 
          one uppercase, one lowercase, and one number.
        </p>
          <SubmitBtn>Create password</SubmitBtn>
        </form>

        <p className='form-terms'>
          By continuing, you confirm that you have read and agreed 
          <br/>to our Terms and Conditions and Privacy Policy.
        </p>
      </article>
    </section>
  )
}


const Feedback = ({error}:{error:string}) =>{
  return(
    <div className='set-password-feedback'>
      <span className='text-danger'>{error}</span>
    </div>
  )
}