import { Property } from "@store/features/property/propertyStore.interface";
import Modal from "@components/modal/ModalContainer";
import { ModalForms } from "@store/features/display/displayStore.interface";
import './card.css'

import { selectUser } from "@store/features/auth/AuthSlice.store";
import { useAppSelector } from "@hooks/useRedux.hook";

export default function PropertyDetailCard({property}: {property:Property}) {
  const user = useAppSelector(selectUser)

  return (
    <div className="property-detail-card surface-container shadow">
      <div className='d-flex pb-3  justify-content-between border-bottom border-2'>
        <h1 className='primary-heading  fs-4 col'>Property Details</h1>
        {user?.userRole === 'admin' &&   <Modal buttonText="Edit Details" name={ModalForms.UpdatePropertyForm} id={property._id}  /> }
      </div>
      <div className='property-detail-row-container mt-4'>
        <Row title="Account No" value={property.accountNo} />
        <Row title="Location" value={property.address.street} />
        <Row title="Current Status" value={property.status} />
        <Row title="Investment Rate" value={property.investmentRate} />
        <Row title="Amount Invested" value={property.amountInvested} />
        <div className="progress-row ">
          <p className='detail-title'>Progress</p>
          <p className='property-detail-value-progress'>
            <progress className="progress-bar" value={property.completedSoFar} max="100"></progress>
            <span className='progress-bar-value'>{property.completedSoFar}%</span>
          </p>
        </div>
        <Row title="Start Date"  value={property.startDate ? new Date(property.startDate).toLocaleDateString() : 'N/A'} />
        <Row title="Expected End Date"  value={property.endDate ? new Date(property.endDate).toLocaleDateString() : 'N/A'} />
      </div>
    </div>
  )
}






const Row = ({title, value}: {title: string, value: string | number}) => {
  return(
    <div className='p-3 property-detail-card-row d-flex justify-content-between'>
      <p className='hide-on-small detail-title mb-0'>{title}</p>
      <p className='detail-value mb-0'>{value}</p>
    </div>
  )
}

