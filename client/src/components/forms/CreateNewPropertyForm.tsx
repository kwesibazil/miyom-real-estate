import DOMPurify from 'dompurify';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector} from '@hooks/useRedux.hook';

import FormFeedback from './FormFeedback';
import TextInput from '@components/inputs/TextInput';
import SelectInput from '@components/inputs/SelectInput';
import DateInput from '@components/inputs/DateInput';
import RangeInput from '@components/inputs/RangeInput';
import NumberInput from '@components/inputs/NumberInput';
import InvestorSelector from '@components/inputs/InvestorSelector';

import { ModalForms } from '@store/features/display/displayStore.interface';
import { selectForm } from '@store/features/display/DisplaySlice.store';
import { createPropertyThunk } from '@store/features/property/PropertyThunk.store';
import { CreatePropertyPayload } from '@store/features/property/propertyStore.interface';
import './forms.css';

interface NewInspectorFormProp{
  handleToggle: (event: React.MouseEvent<HTMLElement>) => void
  closeModal: () => void;
}

const propertyStatusValue = [
  PropertyStatus.completed,
  PropertyStatus.awaitingInspection,
  PropertyStatus.underConstruction,
]

import { PropertyStatus, PropertyType } from '@store/features/property/propertyStore.interface';


const CreateNewPropertyForm = ({handleToggle, closeModal }:NewInspectorFormProp) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [propertyId, setPropertyId] = useState<string>('')
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false)
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");


  const [formSection, setFormSection] = useState<number>(1)
  const isModalOpen = useAppSelector(selectForm(ModalForms.CreateNewPropertyForm));


  const [investor, setInvestor] = useState('')
  const [propertyZip, setPropertyZip] = useState('');
  const [propertyCity, setPropertyCity] = useState('');
  const [propertyState, setPropertyState] = useState('');
  const [propertyStreet, setPropertyStreet] = useState('');
  const [propertyEndDate, setPropertyEndDate] = useState('')
  const [propertyCountry, setPropertyCountry] = useState("USA");
  const [propertyStartDate, setPropertyStartDate] = useState('')
  const [propertyRate, setPropertyRate] = useState<number>(17.5)
  const [propertyCompletedSoFar, setPropertyCompletedSoFar] = useState<number>(0)
  const [propertyAmountInvested, setPropertyAmountInvested] = useState<number>(0)
  const [propertyStatus, setPropertyStatus] = useState(PropertyStatus.awaitingInspection)


  const incrementFormSection = ()=>{

    if(formSection === 1){
      if(!investor){
        setError('Please Select Investor')
        setShowError(true);
        return
      }

      if(investor && error){
        setError('')
      }
    }

    if(formSection === 2){
      if(!propertyStreet){
        setError('Please Enter Address')
        setShowError(true);
        return
      }

      if(!propertyCity){
        setError('Please Enter City')
        setShowError(true);
        return
      }

      if(!propertyState){
        setError('Please Enter State')
        setShowError(true);
        return
      }

      if(!propertyZip){
        setError('Please Enter Zip Code')
        setShowError(true);
        return
      }

      if(propertyZip && propertyStreet &&  propertyCity && propertyState && error){
        setError('')
      }
    }

    setFormSection(prev => {
      if (prev >= 3) return prev;
      return prev + 1;
    })
  }


  const decrementFormSection = ()=>{
    setFormSection(prev => {
      if (prev === 1) return prev;
      return prev - 1;
    })
  }


  const resetForm = useCallback(()=>{
    setShowError(false)
    setStatus('pending');
    setInvestor('');
    setFormSection(1); 
    setPropertyZip('');
    setPropertyCity('');
    setPropertyRate(17.5);
    setPropertyState('');
    setPropertyStreet('');
    setPropertyEndDate('');
    setPropertyStartDate('');
    setPropertyCountry('USA');
    setPropertyCompletedSoFar(0);
    setPropertyAmountInvested(0);
    setPropertyStatus(PropertyStatus.awaitingInspection);
  },[])



  useEffect(() => {
    if (isModalOpen) resetForm()
  }, [isModalOpen, resetForm]);




  const handleComplete = useCallback(() => {
    if (status === "failed") setShowError(true);

    else if(status === 'success'){
      closeModal();
      navigate(`/property/${propertyId}`)
    }   
    setStatus("idle");
  }, [status]);




  const handleSubmit = useCallback(async(event:React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setShowError(false);
      setStatus('pending');
      setError('');

      const payload:CreatePropertyPayload = {
        type: PropertyType.residential,
        investorId: DOMPurify.sanitize(investor),
        status: DOMPurify.sanitize(propertyStatus) as PropertyStatus,
        completedSoFar: Number(DOMPurify.sanitize(propertyCompletedSoFar.toString())),
        amountInvested: Number(DOMPurify.sanitize(propertyAmountInvested.toString())),
        endDate: propertyEndDate ? new Date(DOMPurify.sanitize(propertyEndDate)).toISOString() : undefined,
        startDate: propertyStartDate ? new Date(DOMPurify.sanitize(propertyStartDate)).toISOString() : undefined,
        investmentRate: Number(DOMPurify.sanitize(propertyRate.toString())),
        address: {
          country: 'USA',
          city: DOMPurify.sanitize(propertyCity),
          zipCode: DOMPurify.sanitize(propertyZip),
          state: DOMPurify.sanitize(propertyState),
          street: DOMPurify.sanitize(propertyStreet),
        },
      }

      const property = await dispatch(createPropertyThunk(payload)).unwrap()
      setStatus('success');
      setPropertyId(property.data[0]._id)
      setFormSection(1);
    } catch (error:any) {
      setStatus('failed');
      setFormSection(1);
      if(error.name === 'BadRequestError')setError(error.message)
      if(error.name === 'ConflictError'){
        setError("Property with this Address already exist")
        setFormSection(2);
      }
    }
  }
, [investor, propertyStatus, propertyCompletedSoFar,propertyAmountInvested,propertyEndDate,propertyStartDate, propertyRate , propertyCountry, propertyCity, propertyZip, propertyState,propertyStreet, ])









  return (
    <div className="modal-form-container createPropertyForm">
      <h1 className='fs-3 pb-2 text-center fw-bold'>New Property</h1>
  
      {(status !== "idle" && status !== "pending") && <FormFeedback status={status} onComplete={handleComplete} />}
      {(error && showError) && <div className='form-error-pop'>{error}</div> }

      <form className='mt-3 overflow-auto ' onSubmit={handleSubmit}>
        {
          formSection === 1 &&
          <div className='form-primary-section'>
            <InvestorSelector required={true} onChange={e => setInvestor(e.target.value)} value={investor} label='Investor Name' name="create-property-investors" />
            <NumberInput classes='my-3' onChange={e => setPropertyAmountInvested(Number(e.target.value))} value={String(propertyAmountInvested)} label='Amount Invested' name='create-property-amountInvested' placeholder='amount invested'/>
            <SelectInput required={true} onChange={e =>setPropertyStatus(e.target.value as PropertyStatus)} value={propertyStatus} values={propertyStatusValue} label='Property Status' name="create-property-status" />
          </div>
        } 
        {
          formSection === 2 &&
          <div className='property-address-section'>
            <TextInput onChange={e => setPropertyStreet(e.target.value)} value={propertyStreet} classes="mt-3" required={true}  name="create-property-address-street"  label="Street" placeholder="street address"/>
            <div className='d-flex gap-3 gap-sm-4'>
              <TextInput onChange={e => setPropertyCity(e.target.value)} value={propertyCity} classes="mt-4" required={true}  name="create-property-address-city"  label="City" placeholder="city"/>
              <TextInput onChange={e => setPropertyState(e.target.value)} value={propertyState} classes="mt-4" required={true}  name="create-property-address-state"  label="State" placeholder="state"/>
            </div>
            <div className='d-flex gap-3 gap-sm-4'>
              <TextInput onChange={e => setPropertyZip(e.target.value)} value={propertyZip} classes="mt-4" required={true}  name="create-property-address-zip" label="Zip Code" placeholder="zip code"/>
              <TextInput onChange={e => setPropertyCountry(e.target.value)} value={propertyCountry} classes="mt-4" required={true} name="create-property-address-country"  label="Country" placeholder="country"/>
            </div>
          </div>
        }
        {
          formSection === 3 &&
          <div>
            <div className='d-sm-flex gap-3 gap-sm-4'>
              <DateInput classes='mt-3 mb-2' onChange={e => setPropertyStartDate(e.target.value)} value={propertyStartDate} name='create-property-start-date' placeholder='start date' label='Start Date'/>
              <DateInput classes='mt-3 mb-2' onChange={e => setPropertyEndDate(e.target.value)} value={propertyEndDate} name='create-property-end-date' placeholder='end date' label='Expect end Date'/>
            </div>
              <NumberInput max={100} classes='mt-3 mb-2' onChange={e => setPropertyRate(Number(e.target.value))} value={String(propertyRate)} label='Investment Rate' name='create-property-amountRate' placeholder='Rate'/>
              <RangeInput required={true} onChange={e => setPropertyCompletedSoFar(Number(e.target.value))} value={String(propertyCompletedSoFar)} label='Completion' name='create-property-completedSoFar' placeholder='percentage'/>
          </div>
        }
    
        <div className='d-flex gap-4 justify-content-center mt-5'>
          {formSection === 1 && <button onClick={(e) => {resetForm(); handleToggle(e) }} type="button" className="btn w-25 btn-secondary">Cancel</button>}
          {formSection !== 1 && <button onClick={decrementFormSection} type="button" className="btn w-25 btn-secondary">Back</button>}
          {formSection !== 3 && <button onClick={incrementFormSection} type="button" className="btn w-25 btn-primary">Next</button>}
          {formSection === 3 && <button onClick={incrementFormSection} type="submit" className="btn w-25 btn-primary">Create</button>}
        </div>  
      
      </form>
    </div>
  )
}


export default CreateNewPropertyForm;