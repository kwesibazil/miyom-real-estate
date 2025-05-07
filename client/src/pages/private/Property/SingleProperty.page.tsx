import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import {useAppDispatch, useAppSelector} from '@hooks/useRedux.hook';
import { Property } from '@store/features/property/propertyStore.interface';
import { getPropertyByIdThunk } from '@store/features/property/PropertyThunk.store';

import {selectPropertyDetails } from '@store/features/property/PropertySlice.store';

import PropertyGallery from './PropertyGallery';
import PropertyImageCard from '@components/card/PropertyImageCard';
import PropertyDetailCard from '@components/card/PropertyDetailCard';
import InvestorDetailCard from '@components/card/InvestorDetailCard';
import PropertyDocumentsTable from './PropertyDocuments';

import './SingleProperty.css'

import { selectUser } from '@store/features/auth/AuthSlice.store';

export default function SingleProperty(){
  const { id } = useParams();
  const navigate = useNavigate()
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch(); 
  const foundProperty = useAppSelector((state) => selectPropertyDetails(state, id!));
  const [property, setProperty] = useState<Property | null>(null);

  /**
 * Asynchronously fetches property information.
 */
  const fetchPropertyData  = useCallback(async()=>{
    try { 
      const result = await dispatch(getPropertyByIdThunk(id!)).unwrap()
      setProperty(result.data[0]); 
    } catch (error:any) {
      navigate('/property');
    }
  },[id, dispatch])



  useEffect(() => {
    if(foundProperty)setProperty(foundProperty)
    else fetchPropertyData()
  }, [dispatch, id, foundProperty]);



  return(
    <section className="single-property-main-container">
      { property &&
        <>
          <PropertyImageCard property={property}/>
          <div className='mt-5'><PropertyDetailCard property={property}/></div>
          {user?.userRole === 'admin' &&   <div className='mt-5'><InvestorDetailCard showModal={false} investor={property.investor} /></div> }
          <PropertyGallery propertyId={property._id} imagesUrl={property.imagesUrl ?? null} />
          <PropertyDocumentsTable propertyId={property._id} reportUrls={property.inspectionReportsUrl ?? []} legalUrls={property.legalDocumentsUrl ?? []} />
        </>
      }
    </section>
  )
}