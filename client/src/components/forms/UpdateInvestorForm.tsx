import DOMPurify from 'dompurify';
import { useState, useEffect, useCallback } from 'react';
import {useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector} from '@hooks/useRedux.hook';

import {UpdateInvestorPayload } from '@store/features/auth/authStore.interface';
import { ModalForms } from '@store/features/display/displayStore.interface';
import { selectForm } from '@store/features/display/DisplaySlice.store';
import { updateInvestorThunk } from '@store/features/auth/AuthThunk.store';

import { selectInvestorDetails } from '@store/features/auth/AuthSlice.store';

import TextInput from '@components/inputs/TextInput'; 
import FormFeedback from './FormFeedback';
import './forms.css';


interface UpdatePropertyFormProp{
  investorId: string | undefined;
  closeModal: () => void;
  handleToggle: (event: React.MouseEvent<HTMLElement>) => void
}


const UpdateInvestorForm = ({handleToggle, closeModal, investorId}:UpdatePropertyFormProp) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(selectForm(ModalForms.CreateNewInvestorForm));
  const investor = useAppSelector((state) => selectInvestorDetails(state, investorId!));

  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false)
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');


  useEffect(()=>{
    if(investor){
      setEmail(investor.email)
      setFirstName(investor.firstName)
      setLastName(investor.lastName)
      setTelephone(investor.telephone || '')
    }

    else navigate('/investor')
  },[investorId])


  const resetForm = () => {
    setError('');
    setEmail('');
    setLastName('');
    setFirstName('');
    setTelephone('');
    setShowError(false)
    setStatus('pending');
  };
  


  useEffect(() => {
    if (isModalOpen) resetForm()
  }, [isModalOpen]);



  const handleComplete = useCallback(() => {
    if (status === "failed") setShowError(true);
    else if(status === 'success')closeModal();
    setStatus("idle");
  }, [status]);
  

  const handleSubmit = useCallback(async(event:React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setShowError(false);
      setStatus('pending')
      setError('');

      const sanitizedTelephone = DOMPurify.sanitize(telephone);
      const phoneRegex = /^\+?[0-9]{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
      const isValid = phoneRegex.test(sanitizedTelephone);

      if(!isValid && sanitizedTelephone){
        const error = new Error('please enter a valid telephone number');
        error.name = "ValidationError";
        throw error
      }

      const payload: UpdateInvestorPayload = {
        investorId: investorId!,
        updatedData: {
          telephone: sanitizedTelephone,
          firstName: DOMPurify.sanitize(firstName),
          lastName: DOMPurify.sanitize(lastName),
          email: DOMPurify.sanitize(email),
        }
      };

      await dispatch(updateInvestorThunk(payload)).unwrap(); 
      setStatus('success');
    } catch (error:any) {
      setStatus('failed');
      if(error.name === 'BadRequestError')setError(error.message)
      else if(error.name === 'ConflictError')setError("Account with email already exist")
      else if(error.name === 'UnprocessableError')setError('Missing or incorrect data');
      else if(error.name === 'ValidationError')setError(error.message)
      else setError('Failed to Update user. Please try again.'); 
    }

  },[showError,status, error,investorId, telephone, firstName, lastName, email])



  return (
    <div className="modal-form-container">
      <h1 className='fs-3 pb-2 text-center fw-bold'>Update Investor</h1>
      {(status !== "idle" && status !== "pending") && <FormFeedback status={status}  onComplete={handleComplete} />}
      {(error && showError) && <div className='form-error-pop'>{error}</div> }

      <form className='mt-3 overflow-auto ' onSubmit={handleSubmit}>
        <div className='d-sm-flex gap-4 align-items-center'>
          <TextInput  onChange={e => setFirstName(e.target.value)} value={firstName} classes="mt-3" required={true}  name="update-investor-first-name" label="First Name" placeholder="First Name"/>
          <TextInput  onChange={e => setLastName(e.target.value)} value={lastName} classes="mt-3" required={true}  name="update-investor-last-name"  label="Last Name" placeholder="Last Name"/>
        </div>

        <TextInput onChange={e => setEmail(e.target.value)} value={email}  classes="mt-4" required={true} type={'email'} name="update-investor-email"  label="Email address" placeholder="email address"/>
        <TextInput type='telephone' onChange={e => setTelephone(e.target.value)} value={telephone} classes="mt-4" required={false} name="update-investor-telephone"  label="Telephone" placeholder="telephone"/>
        
        <div className='d-flex gap-4 justify-content-center mt-5'>
          <button onClick={(e) => {handleToggle(e) }} type="button" className="btn w-25 btn-secondary">Cancel</button>
          <button type="submit" className="btn w-25 btn-primary">Create</button>
        </div>
      </form>
    </div>
  )
}




export default UpdateInvestorForm;