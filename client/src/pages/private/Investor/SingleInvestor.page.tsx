import { useState, useEffect ,useCallback} from 'react';
import {Navigate, useParams, useNavigate} from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@hooks/useRedux.hook';

import InvestorDetailCard from '@components/card/InvestorDetailCard';
import PropertyTable from "@pages/private/Property/PropertyTable"

import { Property } from '@store/features/property/propertyStore.interface';
import { getInvestorPropertiesThunk } from '@store/features/property/PropertyThunk.store';

import { selectInvestorDetails } from '@store/features/auth/AuthSlice.store';

import './investor.css'


export default function SingleInvestorPage(){
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { id } = useParams<{ id: string }>();
  const [amount, setAmount] = useState<number>(0)
  const [properties, setProperties] = useState<Property[] | null>(null);
  const investor = useAppSelector((state) => selectInvestorDetails(state, id!));
  
  /**
 * Asynchronously fetches all investor properties information.
 */
  const fetchInvestorData  = useCallback(async()=>{
    try {
      const result = await dispatch(getInvestorPropertiesThunk(id!)).unwrap();
      
      const userData = result.data.filter((p:Property) => {
        if(p.investor._id === id){
          setAmount(prev => prev += p.amountInvested)
          return p
        }
      })
      setProperties(userData); 

    } catch (error:any) {
      if(error.name !== 'NotFoundError')
        navigate('/investor');
    }
  },[id])
    
  
  useEffect(() => {
    fetchInvestorData()
  }, [dispatch, id]);



  if(!id || !investor) return <Navigate to='/investor' replace />  

  return(
    <div className='investor-single mt-4 h-100 overflow-auto pb-4'>
      <section className=' px-2 px-lg-0  mt-2'>
        <div className="d-flex justify-content-between">
          <h2 className='d-none d-sm-block primary-heading '>Name:
            <span className='text-capitalize'> {investor?.firstName} {investor?.lastName}</span>
          </h2>
          <h2 className='secondary-heading fs-5 pe-3 text-danger'>Total Invested: <span className='investor-amount'>${amount || 0}</span></h2>
        </div>
        <InvestorDetailCard investor={investor} />
      </section>
      <section className='px-2 px-lg-0 mt-5 overflow-auto  flex-grow-1 '>
        <div className=" mb-4">
          <h2 className='primary-heading'>Property List</h2>
        </div>
        <div className='overflow-y-auto  h-100'>
          <PropertyTable property={properties}/>
        </div>
      </section>
    </div>
  )
}