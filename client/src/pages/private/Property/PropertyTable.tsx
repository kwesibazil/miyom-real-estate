import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect} from 'react';
import NoResultImage from "@components/skelton/NoResult";

import { selectUser } from '@store/features/auth/AuthSlice.store';
import Modal from "@components/modal/ModalContainer";
import { ModalForms } from "@store/features/display/displayStore.interface";
import { Property } from '@store/features/property/propertyStore.interface';
import { TableRowCount, TableIndexes, TablePagination } from '../../../types/general.interface';
import { useAppSelector } from '@hooks/useRedux.hook';
import WelcomeEmptyImage from '@components/skelton/WelcomeEmpty';


import defaultHouse from '@assets/images/default-house.jpg'



import './table.css'

export default function PropertyTable({property}:{property: Property[]| null}) {
  const [tableData, setTableData] = useState<Property [] | null>(null)
  const [indexes, setIndexes] = useState<TableRowCount>({ start: 1, end: 4 })


  useEffect(()=>{
    setTableData(property)
  },[property])


  
  return (
    <div className="property-table-container shadow-lg  w-100">
      {
        !tableData ? <TableSkelton />: 
        <div className='position-relative h-100 d-flex flex-column'>
          <TableHeader />
          <div className='h-100 gap-2 d-flex flex-column'>
            <TableBody start={indexes.start} end={indexes.end} tableData={tableData} />
            <Pagination setIndexes={setIndexes} tableLength={tableData?.length} rows={4}/>
          </div>
        </div>
      }
    </div>
  )
}



const TableHeader = () => {
  return(
    <header className='table-header overflow-hidden'>
      <h5 className="d-none d-sm-block col-2 col-xl table-id ps-2 ">ID</h5>
      <h5 className="col-3 table-thumbnail-container me-3  ">Image</h5>
      <h5 className="col-6 col-sm col-md-3 col-lg-3 col-xl-2 property-address">Address</h5>
      <h5 className="d-none d-md-block col-1 col-sm-3 col-md col-lg-2 col-xl  ">Completion</h5>
      <h5 className="d-none d-md-block col-2 col-lg-2 col-xl-1 px-3 px-lg-1 table-status">Status</h5>
      <h5 className='d-none d-xl-block col col-xl-1'>Invested</h5>  
      <h5 className="d-none d-lg-block col col-xl-1">Rate</h5>
      <h5 className='d-none d-xxl-block col col-lg-2  col-xxl-1'>Start Date</h5>
      <h5 className='d-none d-xl-block col col-lg-2 col-xl-1 col-xxl-1'>End Date</h5>
      <h5 className="col col-sm-2 col-md-1">view</h5>  
    </header>
  )
}




const TableBody = ({start, end, tableData}: TableIndexes & { tableData: Property[]}) => {
  const navigate = useNavigate()  
  const handleClick = (id: number) => navigate(`/property/${id}`);  
  
  console.log( tableData[1].imagesUrl?.[0])

  return(
    <div className='position-relative property-table-body '>
      {
        tableData.slice(start, end).map((property:Property) => (
          <div key={property._id} className='table-row' onClick={() => handleClick(property._id)}>
            <p className="d-none d-sm-block col-2 col-xl table-id px-1 ">{property.accountNo}</p>
            <div className="col-3 me-3 table-thumbnail-container  h-100 ">
              <img src={property?.imagesUrl?.[0]?.secureUrl || defaultHouse} alt={property?.title || 'House image'} />
            </div>
            <div className="col-6 col-sm col-md-3 col-lg-3 col-xl-2 property-address">
              <p className='property-address-street'>{property.address.street}</p>
              <p className='property-address-city'>{property.address.city} {property.address.state} {property.address.zipCode}</p>
            </div>
            <div className="d-none d-md-block col-1 col-sm-3 col-md col-lg-2 col-xl ">
              <div className='table-progress-container d-flex justify-content-center align-items-center h-100'>
                <span className='table-progress-value'>{property.completedSoFar}%</span>
                <progress className="progress-bar" value={property.completedSoFar} max="100"></progress>
              </div>
            </div>
            <p className="d-none d-md-block col-2 col-lg-2 col-xl-1 px-3 px-lg-1 table-status">{property.status}</p>
            
            <p className="d-none d-xl-block col col-xl-1">{property.amountInvested}</p> 
            
            <p className="d-none d-lg-block col col-xl-1">{property.investmentRate}%</p>
            <p className="d-none d-xxl-block col col-lg-2  col-xxl-1 px-2">{property.startDate ? new Date(property.startDate).toLocaleDateString() : 'N/A'}</p>
            <p className="d-none d-xl-block col col-lg-2 col-xl-1 col-xxl-1 px-2 ">{property.endDate ? new Date(property.endDate).toLocaleDateString() : 'N/A'}</p>
            <NavLink to={`/property/${property._id}`} className=" col col-sm-2 col-md-1 property-view-link my-auto "> 
              <p>view</p> 
            </NavLink>
          </div>
        )) 
      }
    </div>
  )
}



const TableSkelton = () => {
  const user = useAppSelector(selectUser)

  return(
    <div className='d-flex flex-column flex-grow-1 custom-secondary-border h-100 '>
      <header className='table-header py-3'>
        <h5 className="col col-sm-1 ps-sm-3 ">Account</h5>
        <h5 className="col col-sm-3 col-md-2 text-md-start ps-sm-5">Address</h5>
        <h5 className="col">Completion</h5>
        <h5 className="col ">Status</h5>
        <h5 className="col d-none d-sm-block">Invested</h5>  
        <h5 className="col d-none d-md-block">Rate</h5>
        <h5 className="col d-none d-md-block">Start Date</h5>
        <h5 className="col d-none d-md-block">End Date</h5>
      </header>
      <div className='d-flex flex-column justify-content-center align-items-center h-100'>
        <div className='d-flex flex-column align-items-center w-50  '>
          <div className='table-image-container h-75'>
            {
              user?.userRole !== 'admin' 
              ?<WelcomeEmptyImage/>
              : <NoResultImage/>
            }
          </div>
          {
            user?.userRole !== 'admin' ? 
            <>
              <p className='mb-0 mt-3 text-center'>
                <span className='text-muted-custom'> Welcome to your dashboard! Your investment information isn't available just yet. </span>
                <span className='text-muted-custom d-none d-lg-block'> Feel free to check back later or reach out if you have questions.</span>
              </p> 
            </>
            
            :
            <>
              <p className=" mb-3 ">No Property available</p>
              <Modal buttonText="New Property" name={ModalForms.CreateNewPropertyForm}  />
            </>
          }
        </div>
      </div>
    </div>
  )
} 


const Pagination = ({setIndexes, rows, tableLength}:TablePagination) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = tableLength
  const totalPages = Math.ceil(totalItems / rows);

  const incrementIndex = () => {
    setCurrentPage(prev => Math.max(prev + 1, totalPages))
  }

  const decrementIndex = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }
  
  useEffect(() => {
    const start = (currentPage - 1) * rows;
    const end = start + rows;
    setIndexes({start, end});
  }, [currentPage, setIndexes]);


  return(
    <div className="pagination-controls text-center pt-3 ">
      <button className='btn btn-sm btn-primary' onClick={decrementIndex}  disabled={currentPage === 1}>Prev</button>
      <span className='mx-4'>Page {currentPage} of {totalPages}</span>   
      <button className='btn btn-sm btn-primary' onClick={incrementIndex} disabled={currentPage === totalPages} >Next </button>
    </div>
  )
}
