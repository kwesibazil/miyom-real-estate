import DOMPurify from 'dompurify';
import { useState,useCallback} from 'react';
import { Navigate, useNavigate} from "react-router-dom";


import { selectIsLoggedIn, selectFirstLogin} from '@store/features/auth/AuthSlice.store';
import { useAppDispatch, useAppSelector} from '@hooks/useRedux.hook';


import FormFeedback from './FormFeedback';
import {validatePasswordAsync }from '@helpers/utils.helpers';
import PasswordInput from '@components/inputs/PasswordInput';
import SubmitBtn from '@components/buttons/SubmitBtn';


import { setPasswordThunk } from '@store/features/auth/AuthThunk.store';
import { UpdatePasswordPayload } from '@store/features/auth/authStore.interface';

import '@components/Header/Header.css'
import './forms.css'



export default function SetPasswordForm(){
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isFirstLogin = useAppSelector(selectFirstLogin);

  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [newPassword, setNewPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [status, setStatus] = useState<'pending' | 'success' | 'failed' | null>(null);


  const handleSubmit = useCallback(async(event:React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()
      setStatus('pending')
      setShowError(false)
      setError('');

      const payload:UpdatePasswordPayload = {
        newPassword:DOMPurify.sanitize(newPassword),
        currentPassword: DOMPurify.sanitize(currentPassword)
      };
      
      await validatePasswordAsync(payload.newPassword);
      await validatePasswordAsync(payload.currentPassword);
      await dispatch(setPasswordThunk(payload)).unwrap(); 
      setStatus('success')
      navigate('/dashboard')
    } catch (error:any) {
      setStatus('failed');
      if(error.name === 'ForbiddenError')setError(error.message)
      else if(error.name === 'TemporaryLockedError')setError(error.message)
      else if(error.name === 'LockedError')setError(error.message)
      else if(error.name === 'ValidationError')setError('Try a password with uppercase, lowercase, etc.')
      else setError('Password update failed');
    }
    
  },[newPassword, currentPassword, dispatch])
  

  const onComplete = useCallback(() => {
    if(status === 'success'){
      return
    }
    setShowError(true)  
  }, [status, ]);



  if(!isLoggedIn) return <Navigate to='/' replace />
  if(!isFirstLogin)  <Navigate to='/dashboard' replace />
  

  return(
      <section className="d-flex new-password-form shadow">
        <article className="col text-center form-container">
        <h1 className='mb-4 fw-bold position-relative'>Welcome</h1>
        <p className='tag-message mb-4' >For security, please change your temporary password before continuing.</p>
        
        {status && <FormFeedback status={status}  onComplete={onComplete} />}
        {(error && showError) && <Feedback error={error} />}

        <form className='form-body mb-5  position-relative'  onSubmit={handleSubmit}>
          <PasswordInput onChange={e => setCurrentPassword(e.target.value)} value={currentPassword} name='current-password' label="Current Password "placeholder="current password" classes='mb-4'/>
          <PasswordInput onChange={e => setNewPassword(e.target.value)} value={newPassword} name='new-password' label="New Password "placeholder="new password" classes='mb-1'/>
          <p className={`password-hint fs-sm-8 ${showError ? 'text-danger': ''}`}>
          Password must be at least 8 characters long and include at least, 
          one uppercase, one lowercase, and one number.
        </p>
          <SubmitBtn>Update password</SubmitBtn>
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
      <span className='text-danger' > {error}</span>
    </div>
  )
}