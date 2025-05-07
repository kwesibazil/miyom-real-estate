import { Investor } from "@store/features/auth/authStore.interface";

import {useAppSelector } from "@hooks/useRedux.hook";

import { selectProperty } from "@store/features/property/PropertySlice.store";

import Modal from "@components/modal/ModalContainer";
import { ModalForms } from "@store/features/display/displayStore.interface";
import './card.css'
import { useEffect, useState } from "react";
import { Property } from "@store/features/property/propertyStore.interface";



export default function InvestorDetailCard({showModal=true, investor}:{investor:Investor, showModal?: boolean}) {
  const properties = useAppSelector(selectProperty)
  const [totalProperties, setTotalProperties] = useState<number>(0)

  useEffect(()=>{
    const userProperties = properties?.filter((p:Property) => p.investor._id === investor._id)
    setTotalProperties(userProperties?.length || 0)
  },[investor])



  return (
    <div className="investor-detail-card surface-container shadow">
      <div className='d-flex pb-3 justify-content-between border-bottom border-2'>
        <h1 className='primary-heading fs-4 col'>Investor</h1>
        {showModal && <Modal buttonText="Edit Details" name={ModalForms.UpdateInvestorForm} id={investor._id}  />}
      </div>
      <div className="investor-card-body d-flex gap-4 mt-3">
        <div className="d-none d-sm-block col image-container py-3">
          <img className="rounded rounded-4 shadow-sm" src={investor.profileImgUrl.url} alt="" />
        </div>
        <div className='col d-flex flex-column justify-content-center card-row-container '>
          <Row classes="text-capitalize" title="Full Name" value={`${investor.firstName} ${investor.lastName}`}/>
          <Row classes="text-lowercase" title="Email" value={investor.email} />
          <Row classes="text-lowercase" title="Number of Property" value={totalProperties} />
        </div>
      </div>
    </div>
  )
}

const Row = ({title, value, classes}: {title: string, value: string | number, classes?:string}) => {
  return(
    <div className='p-3 card-row d-flex justify-content-between'>
      <p className='hide-on-small detail-title mb-0'>{title}</p>
      <p className={`${classes} detail-value mb-0 `}>{value}</p>
    </div>
  )
}
