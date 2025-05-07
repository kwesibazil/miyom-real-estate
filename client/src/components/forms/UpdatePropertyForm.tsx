import DOMPurify from 'dompurify';
import { useState, useEffect, useCallback} from 'react';
import { useAppDispatch, useAppSelector} from '@hooks/useRedux.hook';


import InvestorSelector from '@components/inputs/InvestorSelector';
import FormFeedback from './FormFeedback';
import TextInput from '@components/inputs/TextInput';
import SelectInput from '@components/inputs/SelectInput';
import DateInput from '@components/inputs/DateInput';
import RangeInput from '@components/inputs/RangeInput';
import NumberInput from '@components/inputs/NumberInput';

import { useNavigate } from 'react-router-dom';
import { UpdatePropertyPayload } from '@store/features/property/propertyStore.interface';


import { selectPropertyDetails } from '@store/features/property/PropertySlice.store';
import { PropertyStatus,} from '@store/features/property/propertyStore.interface';
import { updatePropertyByIdThunk } from '@store/features/property/PropertyThunk.store';
import './forms.css';


interface UpdatePropertyFormProp{
  closeModal: () => void;
  propertyId: string | undefined;
  handleToggle: (event: React.MouseEvent<HTMLElement>) => void
}


const propertyStatusValue = [
  PropertyStatus.completed,
  PropertyStatus.awaitingInspection,
  PropertyStatus.underConstruction,
]




const UpdatePropertyForm = ({handleToggle, propertyId, closeModal}:UpdatePropertyFormProp) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const [formSection, setFormSection] = useState<number>(1)
  const property = useAppSelector((state) => selectPropertyDetails(state, propertyId!));

  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false)
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");
  
  const [investor, setInvestor] = useState('')
  const [propertyZip, setPropertyZip] = useState('');
  const [propertyCity, setPropertyCity] = useState('');
  const [propertyState, setPropertyState] = useState('');
  const [propertyStreet, setPropertyStreet] = useState('');
  const [propertyEndDate, setPropertyEndDate] = useState('')
  const [propertyStartDate, setPropertyStartDate] = useState('')
  const [propertyInvestmentRate, setPropertyInvestmentRate] = useState<number>(17.5)
  const [propertyCompletedSoFar, setPropertyCompletedSoFar] = useState<number>(0)
  const [propertyAmountInvested, setPropertyAmountInvested] = useState<number>(0)
  const [propertyStatus, setPropertyStatus] = useState(PropertyStatus.awaitingInspection)
  
  const incrementFormSection = ()=>{
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



  const handleComplete = useCallback(() => {
    if (status === "failed") setShowError(true);

    else if(status === 'success'){
      closeModal();
      navigate(`/property/${propertyId}`)
    }   
    setStatus("idle");
  }, [status]);
  

  useEffect(()=>{
    if(property){
      setPropertyCity(property.address.city)
      setPropertyZip(property.address.zipCode)
      setPropertyState(property.address.state)
      setPropertyStreet(property.address.street)

      setPropertyStatus(property.status)
      setPropertyInvestmentRate(property.investmentRate)
      setPropertyEndDate(property.endDate ? property.endDate.toString() : '')
      setPropertyStartDate(property.startDate ? property.startDate.toString() : '')
      setPropertyCompletedSoFar(property.completedSoFar)
      setPropertyAmountInvested(property.amountInvested)
      setInvestor(property.investor._id)
    }

    else navigate('/property')
  },[propertyId])



  const handleSubmit = async(event:React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setShowError(false);
      setStatus('pending');
      setError('');


      const payload:UpdatePropertyPayload = {
        propertyId: propertyId,
        updatedData: {
          status: DOMPurify.sanitize(propertyStatus) as PropertyStatus,
          investmentRate: Number(DOMPurify.sanitize(propertyInvestmentRate.toString())),
          completedSoFar: Number(DOMPurify.sanitize(propertyCompletedSoFar.toString())),
          amountInvested: Number(DOMPurify.sanitize(propertyAmountInvested.toString())),
          endDate: propertyEndDate ? new Date(DOMPurify.sanitize(propertyEndDate)).toISOString() : undefined,
          startDate: propertyStartDate ? new Date(DOMPurify.sanitize(propertyStartDate)).toISOString() : undefined,
          investor: DOMPurify.sanitize(investor),
          address: {
            country: 'USA',
            city: DOMPurify.sanitize(propertyCity),
            zipCode: DOMPurify.sanitize(propertyZip),
            state: DOMPurify.sanitize(propertyState),
            street: DOMPurify.sanitize(propertyStreet),
          },
        }
      }
      await dispatch(updatePropertyByIdThunk(payload)).unwrap()
      setStatus('success');
      setFormSection(1);
    } catch (error:any) {
      setStatus('failed');

      if(error.name === 'BadRequestError')setError('Missing or Incorrect Information')
      else if(error.name === 'ConflictError')setError("Property with this already exists. Please verify address")
      else if(error.name === 'UnprocessableError')setError('Missing or incorrect data');
      else setError('Failed to Update user. Please try again.'); 
    }
  }


  
  return (
    <div className="modal-form-container createPropertyForm">
      <h1 className='fs-3 pb-2 text-center fw-bold'>Update Property Details</h1>
  
      {(status !== "idle" && status !== "pending") && <FormFeedback status={status} onComplete={handleComplete} />}
      {(error && showError) && <div className='form-error-pop'>{error}</div> }

      <form className=' overflow-auto' onSubmit={handleSubmit}>
        {
          formSection === 1 &&
          <div className='form-primary-section'>
            <InvestorSelector required={true} onChange={e => setInvestor(e.target.value)} value={investor} label='Investor Name' name="update-investors" />
            <SelectInput required={true} onChange={e => setPropertyStatus(e.target.value as PropertyStatus)} value={propertyStatus} values={propertyStatusValue} label='Property Status' name="update-property-status" />
            <NumberInput classes="mt-4" onChange={e => setPropertyInvestmentRate(Number(e.target.value))} value={String(propertyInvestmentRate)} label='Investment Rate' name='update-property-rate' placeholder='rate'/>
            <RangeInput  required={true} onChange={e => setPropertyCompletedSoFar(Number(e.target.value))} value={String(propertyCompletedSoFar)} label='Completion' name='update-property-completedSoFar' placeholder='percentage'/>
          </div>
        } 
        {
          formSection == 2 &&
          <div className='form-primary-section mt-2'>
            <NumberInput onChange={e => setPropertyAmountInvested(Number(e.target.value))} value={String(propertyAmountInvested)} label='Amount Invested' name='update-property-amountInvested' placeholder='amount invested'/>
            <DateInput classes='mt-4' onChange={e => setPropertyStartDate(e.target.value)} value={propertyStartDate ? propertyStartDate.split('T')[0] : ''} name='update-property-start-date' placeholder='start date' label='Start Date'/>
            <DateInput classes='mt-4' onChange={e => setPropertyEndDate(e.target.value)} value={propertyEndDate ? propertyEndDate.split('T')[0] : ''} name='update-property-end-date' placeholder='end date' label='Expect end Date'/>
          </div>
        }
        {
          formSection === 3 &&
          <div className='property-address-section'>
            <TextInput onChange={e => setPropertyStreet(e.target.value)} value={propertyStreet} classes="mt-3" required={true}  name="update-property-address-street"  label="Street" placeholder="street address"/>
            <TextInput onChange={e => setPropertyCity(e.target.value)} value={propertyCity} classes="mt-4" required={true}  name="update-property-address-city"  label="City" placeholder="city"/>
            <div className='d-flex gap-4'>
              <TextInput onChange={e => setPropertyState(e.target.value)} value={propertyState} classes="mt-4" required={true}  name="update-property-address-state"  label="State" placeholder="state"/>
              <TextInput onChange={e => setPropertyZip(e.target.value)} value={propertyZip} classes="mt-4" required={true}  name="update-property-address-zip" label="Zip Code" placeholder="zip code"/>
            </div>
          </div>
        }
        <div className='d-flex gap-4 justify-content-center mt-5'>
          {formSection === 1 && <button onClick={handleToggle} type="button" className="btn w-25 btn-secondary">Cancel</button>}
          {formSection !== 1 && <button onClick={decrementFormSection} type="button" className="btn w-25 btn-secondary">Back</button>}
          {formSection !== 3 && <button onClick={incrementFormSection} type="button" className="btn w-25 btn-primary">Next</button>}
          {formSection === 3 && <button type="submit" className="btn w-25 btn-primary">Save</button>}
        </div>
      </form>
    </div>
  )
}


export default UpdatePropertyForm;