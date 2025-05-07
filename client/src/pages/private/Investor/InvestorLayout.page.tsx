import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { useAppSelector } from "@hooks/useRedux.hook"


import { Investor } from "@store/features/auth/authStore.interface"
import { selectInvestor } from "@store/features/auth/AuthSlice.store"
import { ModalForms } from "@store/features/display/displayStore.interface";

import NoResultImage from "@components/skelton/NoResult";
import Modal from "@components/modal/ModalContainer";
import './investor.css';


export default function InvestorLayout(){
  const allInvestors = useAppSelector(selectInvestor)
  const [investors, setInvestors] = useState<Investor[] | null>(allInvestors ?? null)

  useEffect(()=>{
    setInvestors(allInvestors ?? null)
  },[allInvestors])

  return(
    <div className='investor h-100'>
      <section className='investor-section-container mt-3 '>
        <div className="investor-section-heading-container mb-3">
          <h2 className='primary-heading'>Investors</h2>
          { investors?.length !== 0 &&  <Modal buttonText="New Investor" name={ModalForms.CreateNewInvestorForm}  />} 
        </div>
      </section>
      {
        investors?.length === 0 ? <InvestorLayoutSkelton/> :
        <section className='h-100 row g-3 mt-0 investor-card-container d-flex align-items-start flex-wrap'>
        {
          
          investors?.map((item:Investor) => (
            <div className="mt-2 gap-1 col-12 col-sm-6 col-xl-4" key={item._id}>
              <InvestorCard investor={item} />
            </div>
          ))
        }
        </section>
      }
    </div>
  )
}


const InvestorCard = ({ investor }: { investor: Investor }) => {
  return(
    <div className="investor-card shadow overflow-hidden rounded-2">
      <div className='d-flex pb-3 mb-3  justify-content-between border-bottom border-2'>
        <div className="col d-flex justify-content-start align-items-center">
          <div className="investor-profile-container">
            <img className="rounded rounded-4 shadow-sm" src={investor.profileImgUrl.url} alt="" />
          </div>
          <h1 className='ms-2 primary-heading fs-5 col-10'>{investor.firstName} {investor.lastName}</h1>
        </div>
      </div>
      <div className="">
          <Row title="Full Name" value={`${investor.firstName} ${investor.lastName}`}/>
          <Row title="Email" value={investor.email} />
          <Row title="Telephone No" value={investor.telephone || ''} />
      </div> 
      <div className="mt-4 ms-auto d-flex w-100 justify-content-end">
        {/* <NavLink  className="me-3"to="/dashboard">Email</NavLink> */}
        <NavLink to={`/investor/${investor._id}`}>View Profile</NavLink>
      </div>
    </div>
  )
}


const Row = ({title, value}: {title: string, value: string | number}) => {
  return(
    <div className='editable-row d-flex py-2 px-1 justify-content-between align-items-center'>
      <p className='detail-title mb-0'>{title}</p>
      <p className='detail-value mb-0'>{value}</p>
    </div>
  )
}



const InvestorLayoutSkelton = () =>{
  return(
    <div className="empty-container border-opacity-75">
      <div className='empty-body' >
        <div className='empty-image-container'>
          <NoResultImage />
        </div>
        <div className=" mt-4 flex-column d-flex justify-content-center align-items-center ">
          <p className="mb-1">t looks like you don't have any Investors yet.</p>
          <p>o get started, click the button below to create your first Investor.</p>
          <Modal buttonText="New Investor" name={ModalForms.CreateNewInvestorForm}  />
        </div>
      </div>
    </div>
  )
}



