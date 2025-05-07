import DOMPurify from 'dompurify';
import { useState, useEffect, memo, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector} from '@hooks/useRedux.hook';

import { CreateUserPayload } from '@store/features/auth/authStore.interface';
import { ModalForms } from '@store/features/display/displayStore.interface';
import { selectForm } from '@store/features/display/DisplaySlice.store';
import { NewInvestorThunk } from '@store/features/auth/AuthThunk.store';

import TextInput from '@components/inputs/TextInput'; 
import FormFeedback from './FormFeedback';
import './forms.css';


interface NewInspectorFormProp{
  closeModal: () => void;
  handleToggle: (event: React.MouseEvent<HTMLElement>) => void
}


const CreateNewInvestorForm = ({handleToggle, closeModal}:NewInspectorFormProp) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(selectForm(ModalForms.CreateNewInvestorForm));


  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [investorId, setInvestorId] = useState<string>('')
  const [lastName, setLastName] = useState('');
  const [telephone, setTelephone] = useState('');
  

  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false)
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");


  const resetForm = useCallback(()=>{
    setEmail('');
    setError('');
    setFirstName('');
    setLastName('');
    setTelephone('');
    setShowError(false)
    setStatus('pending');
  },[])

  
  useEffect(() => {
    if (isModalOpen) resetForm()
  }, [isModalOpen, resetForm]);


  const handleComplete = useCallback(() => {
    if (status === "failed") setShowError(true);

    else if(status === 'success'){
      closeModal();
      setTimeout(()=> navigate(`/investor/${investorId}`), 1000)
    }   
    setStatus("idle");
  }, [status]);




  const handleSubmit = useCallback(async(event:React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setShowError(false);
      setStatus('pending');
      setError('');


      const sanitizedTelephone = DOMPurify.sanitize(telephone);
      const phoneRegex = /^\+?[0-9]{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
      const isValid = phoneRegex.test(sanitizedTelephone);


      if(!isValid && sanitizedTelephone){
        const error = new Error('please enter a valid telephone number');
        error.name = "ValidationError";
        throw error
      }
  
      const payload: CreateUserPayload = {
        telephone: sanitizedTelephone,
        firstName: DOMPurify.sanitize(firstName),
        lastName: DOMPurify.sanitize(lastName),
        email: DOMPurify.sanitize(email),
      };

      const investor = await dispatch(NewInvestorThunk(payload)).unwrap(); 
      setStatus('success');
      setInvestorId(investor.data[0]._id)
    } 
    catch (error:any) {
      setStatus('failed');
      if(error.name === 'BadRequestError')setError(error.message)
      else if(error.name === 'ConflictError')setError("Account with email already exist")
      else if(error.name === 'UnprocessableError')setError('Missing or incorrect information');
      else if(error.name === 'ValidationError')setError(error.message)
      else setError('Failed to create user. Please try again.');
    }
  },[firstName, lastName, email, telephone])




  return (
    <div className="modal-form-container">
      <h1 className='fs-3 pb-2 text-center fw-bold'>New Investor</h1>
      {(status !== "idle" && status !== "pending") && <FormFeedback status={status} onComplete={handleComplete} />}
    
      {(error && showError) && <div className='form-error-pop'>{error}</div> }

      <form className='mt-3 overflow-auto ' onSubmit={handleSubmit}>
        <div className='d-sm-flex gap-4 align-items-center'>
          <TextInput onChange={e => setFirstName(e.target.value)} value={firstName} classes="mt-3" required={true}  name="create-investor-first-name" label="First Name" placeholder="First Name"/>
          <TextInput onChange={e => setLastName(e.target.value)} value={lastName} classes="mt-3" required={true}  name="create-investor-last-name"  label="Last Name" placeholder="Last Name"/>
        </div>
        <TextInput onChange={e => setEmail(e.target.value)} value={email}  classes="mt-4" required={true} type={'email'}  name="create-investor-email"  label="Email address" placeholder="email address"/>
        <TextInput type='telephone' onChange={e => setTelephone(e.target.value)} value={telephone} classes="mt-4" required={false} name="create-investor-telephone"  label="Telephone" placeholder="telephone"/>
        <div className='d-flex gap-4 justify-content-center mt-5'>
          <button onClick={(e) => {resetForm(); handleToggle(e) }} type="button" className="btn w-25 btn-secondary">Cancel</button>
          <button type="submit" className="btn w-25 btn-primary">Create</button>
        </div>
      </form>
    </div>
  )
}


export default memo(CreateNewInvestorForm);