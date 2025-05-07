import DOMPurify from 'dompurify';
import { useState, useEffect, memo, useCallback} from 'react';

import { useAppDispatch, useAppSelector} from '@hooks/useRedux.hook';
import { selectForm } from '@store/features/display/DisplaySlice.store';
import { ModalForms } from '@store/features/display/displayStore.interface';
import { updatePasswordThunk } from '@store/features/auth/AuthThunk.store';
import { UpdatePasswordPayload } from '@store/features/auth/authStore.interface';

import PasswordInput from '@components/inputs/PasswordInput';
import {validatePasswordAsync }from '@helpers/utils.helpers';

import FormFeedback from './FormFeedback';
import './forms.css';


interface UpdatePasswordFormProp{
  closeModal: () => void;
  handleToggle: (event: React.MouseEvent<HTMLElement>) => void
}


const UpdatePasswordForm = ({handleToggle, closeModal}:UpdatePasswordFormProp) => {
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(selectForm(ModalForms.UpdatePasswordForm));

  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [newPassword, setNewPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [status, setStatus] = useState<'pending' | 'success' | 'failed' | null>(null);


  const onComplete = useCallback(() => {
    if(status === 'success'){
      closeModal()
      return
    }
    setShowError(true)  
  }, [status, closeModal]);


  const resetForm = useCallback(()=>{
    setError('');
    setStatus(null);
    setNewPassword('');
    setShowError(false);
    setCurrentPassword('');
  },[])

  
  useEffect(() => {
    if (isModalOpen) resetForm()
  }, [isModalOpen, resetForm]);



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
      await dispatch(updatePasswordThunk(payload)).unwrap(); 
      setStatus('success')

    } catch (error:any) {
        setStatus('failed');
        
        if(error.name === 'BadRequestError')setError('Same password. Please enter a different one')
        else if(error.name === 'ValidationError')setError('Try a password with uppercase, lowercase, etc.')
        else if(error.name === 'ForbiddenError')setError('Please double-check your current password.')
        else setError('Failed to update Password');
    }
    
  },[newPassword, currentPassword, dispatch])
  

  return (
    <div className="modal-form-container ">
      <h1 className='fs-3 pb-3 mb-4 text-center fw-bold mt-2 update-password-header'>Update Password</h1>

      {status && <FormFeedback status={status}  onComplete={onComplete} />}
      {(error && showError) && <div className='form-error-pop update'>{error}</div> }

      <form className='updatePassword mt-4 overflow-auto ' onSubmit={handleSubmit}>
        <PasswordInput onChange={e => setCurrentPassword(e.target.value)} value={currentPassword} name='current-password' label="Current Password "placeholder="current password" classes='mb-4 mt-1'/>
        <PasswordInput onChange={e => setNewPassword(e.target.value)} value={newPassword} name='new-password' label="New Password "placeholder="new password" classes='mb-1'/>
        <p className={`password-hint fs-sm-8 ${showError ? 'text-danger': ''}`}>
          Password must be at least 8 characters long and include at least, 
          one uppercase, one lowercase, and one number.
        </p>
        <div className='d-flex gap-4 justify-content-center mt-5 mb-3 '>
          <button onClick={(e) => {resetForm(); handleToggle(e) }} type="button" className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn w-25 btn-primary">Update</button>
        </div>
      </form>
    </div>
  )
}

export default memo(UpdatePasswordForm);
