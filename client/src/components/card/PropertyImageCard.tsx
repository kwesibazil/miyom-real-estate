import {useState, useEffect } from 'react';


import { usePropertyImageUpload } from "@hooks/useUpload";
import { type FileUpload } from '@store/features/auth/authStore.interface';
import {type ThumbnailImages } from '@store/features/property/propertyStore.interface';
import type { Property, PropertyAddress } from '@store/features/property/propertyStore.interface';


import FormFeedback from '@components/forms/FormFeedback';
import { FaCamera } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import './card.css'

import { selectUser } from '@store/features/auth/AuthSlice.store';
import { useAppSelector } from '@hooks/useRedux.hook';


export default function PropertyImageCard({property, secondaryGrid = true}: {property: Property, secondaryGrid?: boolean}) {
  return (
    <div className='property-image-card shadow'>
      {
        (property.imagesUrl ?? []).length >= 1 &&
        <PropertyCardImageGrid id={property._id} secondaryGrid={secondaryGrid}  imagesUrl={property.imagesUrl || []} />
      }
      <PropertyCardDescription address={property.address} amountInvested={property.amountInvested} description={property.description}/>
    </div>
  )
}



const PropertyCardImageGrid = ({id, imagesUrl, secondaryGrid}: {id:string, imagesUrl:FileUpload[],  thumbnails?: ThumbnailImages | null, secondaryGrid: boolean}) => {
  const [images, setImages] = useState<FileUpload []| null>(imagesUrl)
  const {handleFileChange, status, onComplete} = usePropertyImageUpload({ propertyId: id });
  const user = useAppSelector(selectUser)

  useEffect(()=>{
    setImages(imagesUrl)
  },[])


  return(
    <div className="property-card-image-grid-container">
      {(status !== "idle" && status !== "pending") && <FormFeedback showSuccess={false} status={status} onComplete={onComplete} />}

      <div className='col-12 col-md primary-grid position-relative'>
        {
          user?.userRole==='admin' &&
          <div className="image-upload-camera-container">
            <FaCamera className="camera-icon" />
            <input onChange={(event) => handleFileChange(event, 'secondary')} type="file" className="file-input" accept="image/jpeg,image/png,image/webp" />
          </div>
        } 
        { images && images[0] &&  <img className="grid-image" src={images[0].secureUrl} alt={images[0].filename} /> }
      </div>
      {
        (images && images[1] && secondaryGrid) &&
        <div className='d-none d-md-block col-md secondary-grid '>
          <div className='col-xl secondary-sub-grid position-relative'>
            {
              user?.userRole === 'admin' && 
              <div className="image-upload-camera-container">
                <FaCamera className="camera-icon" />
                <input onChange={(event) => handleFileChange(event, 'secondary')} type="file" className="file-input" accept="image/jpeg,image/png,image/webp" />
              </div>
            }
            <img className="grid-image" src={images[1].secureUrl} alt={images[1].filename} />
          </div>
          {
            (images && images[2] && images[3]) &&
            <div className='d-none d-xl-block col-xl secondary-sub-grid d-xl-flex'>
              <div className='col position-relative'>
                {
                  user?.userRole==='admin' &&
                  <div className="image-upload-camera-container">
                    <FaCamera className="camera-icon" />
                    <input onChange={(event) => handleFileChange(event, 'secondary')} type="file" className="file-input" accept="image/jpeg,image/png,image/webp"  />
                  </div>
                }
                <img className="grid-image" src={images[2].secureUrl} alt={images[2].filename} />
              </div>
              <div className='col position-relative'>
                {
                  user?.userRole === 'admin' && 
                  <div className="image-upload-camera-container">
                    <FaCamera className="camera-icon" />
                    <input onChange={(event) => handleFileChange(event, 'secondary')} type="file" className="file-input" accept="image/jpeg,image/png,image/webp" />
                  </div>
                }
                <img className="grid-image" src={images[3].secureUrl} alt={images[3].filename} />
              </div>
            </div>
          }
        </div>
      }
    </div> 
  )
}




const PropertyCardDescription = ({address, amountInvested, description}: {address:PropertyAddress, amountInvested:number, description:string}) => {
  const user = useAppSelector(selectUser)
  
  return(
    <div className='property-card-description-container'>
      <div className="gap-1 property-card-description-body-text">
        <div className='property-title-text col-12 col-md d-flex align-items-center'>
          <FaLocationDot className="text-danger fs-4 me-2"/>
            <span className='me-2'>{address.street},</span>
            <span className='me-2'>{address.city},</span>
            <span className=''>{address.state }</span>
        </div> 
        {
          user?.userRole==='admin' &&
            <div className="col-0 col-md-5 d-flex justify-content-end property-amount-text mb-0 ">
            <span className="me-2 mb-0">Investment:</span>
            <span className="fw-bold text-danger">${amountInvested}</span>
          </div>
        }
      </div>
      <div className='property-description'>
        <p>{description}</p>
      </div>
    </div>
  )
}




