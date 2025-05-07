import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { useAppSelector } from "@hooks/useRedux.hook"

import Modal from "@components/modal/ModalContainer";
import NoResultImage from "@components/skelton/NoResult";

import { Property } from "@store/features/property/propertyStore.interface";
import { selectProperty } from "@store/features/property/PropertySlice.store";

import { ModalForms } from "@store/features/display/displayStore.interface";
import { FaLocationDot } from "react-icons/fa6";



import defaultHouse from '@assets/images/default-house.jpg'



import '../Investor/investor.css';
import './Property.css'

export default function PropertyLayout (){
  const properties = useAppSelector(selectProperty)
  const [property, setProperty] = useState<Property[] | null>(properties ?? null)


  useEffect(()=>{
    setProperty(properties)
  },[properties])

  return(
    <div className='investor h-100'>
      <section className='investor-section-container mt-3 '>
        <div className="investor-section-heading-container mb-3">
          <h2 className='primary-heading'>Property</h2>
          { property?.length !== 0 &&   <Modal buttonText="New Investor" name={ModalForms.CreateNewPropertyForm}  />} 
        </div>
      </section>
      {
        !property || property.length === 0 ? <PropertyLayoutSkelton/> :
        <section className='h-100 row g-3 mt-0 investor-card-container d-flex align-items-start flex-wrap'>
        {
          
          property?.map((item:Property) => (
            <div className="mt-2 gap-1 col-12 col-sm-6 col-xl-4" key={item._id}>
              <PropertyCard property={item} />
            </div>
          ))
        }
        </section>
      }
    </div>
  )
}


const PropertyCard = ({ property }: { property: Property }) => {

  return(
    <div className="investor-card shadow overflow-hidden">
      <div className="property-image-card-container">
        <img className="rounded  shadow-sm" src={property.imagesUrl?.[0]?.secureUrl ?? defaultHouse} alt="" />
      </div>
      <div className='property-card-description-container'>
        <div className="gap-1 property-card-description-body-text">
          <div className='property-title-text col-12 col-md d-flex align-items-center mt-2'>
            <FaLocationDot className="text-danger fs-4 me-2"/>
              <span className='me-2 fw-bold property-street '>{property.title},</span>
          </div> 
            <NavLink viewTransition  className="bg-primary w-100 btn btn-primary text-white mt-2 py-2" to={`/property/${property._id}`}>View Property</NavLink>
        </div>
      </div>
    </div>
  )
}



// const Row = ({title, value, classes}: {title: string, value: string | number, classes?:string}) => {
//   return(
//     <div className='editable-row d-flex py-2 px-1 justify-content-between align-items-center'>
//       <p className='detail-title mb-0 ps-2'>{title}</p>
//       <p className={`${classes} pe-2 detail-value mb-0`}>{value}</p>
//     </div>
//   )
// }



const PropertyLayoutSkelton = () =>{
  return(
    <div className="empty-container border-opacity-75 h-75 d-flex align-items-center b my-auto">
      <div className='empty-body' >
        <div className='empty-image-container'>
          <NoResultImage />
        </div>
        <div className=" mt-4 flex-column d-flex justify-content-center align-items-center ">
          <p className="mb-2 mb-sm-1">It looks like you don't have any Property yet.</p>
          <p className="d-none d-sm-block ">to get started, click the button below to add your first Property</p>
          <Modal buttonText="New Property" name={ModalForms.CreateNewPropertyForm}  />
        </div>
      </div>
    </div>
  )
}

