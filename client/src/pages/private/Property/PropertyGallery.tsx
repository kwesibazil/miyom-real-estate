import { useState, useEffect } from 'react';

import {useAppSelector } from '@hooks/useRedux.hook';
import { usePropertyImageUpload } from "@hooks/useUpload";
import { selectUser } from '@store/features/auth/AuthSlice.store';
import { FileUpload } from '@store/features/auth/authStore.interface';

import { IoImagesSharp } from "react-icons/io5";
import { FaCamera} from "react-icons/fa";

import './SingleProperty.css'
import NoResultImage from "@components/skelton/NoResult";

import FormFeedback from '@components/forms/FormFeedback';


const PropertyGallery = ({propertyId, imagesUrl}: {propertyId:string, imagesUrl:FileUpload[] | null}) =>{
  const user = useAppSelector(selectUser)
  const [gridSize, setGridSize] = useState('')
  const {handleFileChange, status, onComplete} = usePropertyImageUpload({ propertyId });

  useEffect(()=>{
    if(imagesUrl && imagesUrl.length >= 3) setGridSize('col-10 col-sm-9 col-md-5')
    else setGridSize('col')
  }, [imagesUrl, propertyId])


  const handleDownload = (image: FileUpload) => {
    // if (user?.userRole !== 'admin') return; 
  
    // const link = document.createElement('a');
    // link.href = image.secureUrl;
    // link.download = image.filename
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    if (user?.userRole !== 'admin') return; // Restrict access

    window.open(image.secureUrl, '_blank', 'noopener,noreferrer');
  };

  
  

  return(
    <div className="property-gallery mt-5">
      <div className='d-flex align-items-center justify-content-between mb-4'>
        
        <h1 className='primary-heading mb-0'>Gallery</h1>
        {(status !== "idle" && status !== "pending") && <FormFeedback showSuccess={false} status={status} onComplete={onComplete} />}


        {
          (imagesUrl && imagesUrl.length > 0) && user?.userRole === 'admin' &&
          <div className='upload-image-btn text-white position-relative'>
            <FaCamera className="camera-icon" />
            <input onChange={handleFileChange}   multiple  type="file" className="file-input" id="fileInput" accept="image/jpeg,image/png,image/webp" />
            <p className='mb-0 ms-2 '>upload image</p>
          </div>
        }
      </div>
      {
        (!imagesUrl || imagesUrl.length === 0) ?
        <>
          {
            (user?.userRole === 'admin') ?
            <div className='upload-box'>
              <div className='icon-container'><IoImagesSharp className='fs-1'/></div>
              <div className='d-flex flex-column'>
                <p>No Images found</p>
                <div className='upload-image-btn text-white position-relative'>
                  <FaCamera className="camera-icon" />
                  <input onChange={handleFileChange}   multiple type="file" className="file-input"  accept="image/jpeg,image/png,image/webp" />
                  <p className='ms-2 text-white'>upload image</p>
                </div>
              </div>
            </div>
              :
              <div className="property-gallery-placeholder ">
                <div className="col property-gallery-card d-flex align-items-center">
                  <div className='d-flex flex-column align-items-center w-50  '>
                    <div className='table-image-container h-75'>
                      <NoResultImage/>
                    </div>
                    <p className=" mb-3 mt-2 ">No image currently available</p>
                  </div>
                </div>
              </div>
          }
        </>
          :
          <div className="property-gallery-grid pb-4">
          {imagesUrl && imagesUrl.map((image, index) =>(
              <div key={index} className={`${ gridSize } property-gallery-card `}>
                <img 
                  src={image.secureUrl} 
                  alt={image.filename}
                  onClick={() => handleDownload(image)}
                  style={{ cursor: user?.userRole === 'admin' ? 'pointer' : 'default' }}
                  title={user?.userRole === 'admin' ? "Click to download" : ""}
                />
              </div>
            ))}
          </div>
      }
    </div>
  )
}



//  <div className="col-3 col-md-2 download text-center">
//     <a href={document.secureUrl} download target="_blank" rel="noopener noreferrer">
//       <IoMdDownload className="mx-3 fs-6" />
//     </a>
//   </div>


export default PropertyGallery;