
import Modal from "@components/modal/ModalContainer";
import { ModalForms } from "@store/features/display/displayStore.interface";

import { useAppSelector} from '@hooks/useRedux.hook';
import { selectProperty } from '@store/features/property/PropertySlice.store';
import { selectUser } from "@store/features/auth/AuthSlice.store";

import OverviewGrid from "./OverviewGrid";
import PropertyTable from "@pages/private/Property/PropertyTable";
import './Dashboard.css'



export default function Dashboard(){
  const property = useAppSelector(selectProperty);
  const user = useAppSelector(selectUser);

  return(
    <div className='investor-single mt-4 h-100 overflow-auto pb-4'>
      <section className=' px-2 px-lg-0  mt-2 '>
        <div className="d-flex justify-content-between mb-3">
          <h2 className='primary-heading'>Overview</h2>
          {user?.userRole === 'admin' &&   <Modal buttonText="New Investor" name={ModalForms.CreateNewInvestorForm}  />}
        </div>
        <OverviewGrid/>
      </section>
      <section className='px-2 px-lg-0 mt-5 flex-grow-1'>
        <div className=" mb-4 d-flex justify-content-between">
          <h2 className='primary-heading'>Property List</h2>
          {(property && user?.userRole === 'admin')  && <Modal buttonText="Create Property" name={ModalForms.CreateNewPropertyForm}  />}
        </div>
        <div className='overflow-y-auto  h-100'>
          <PropertyTable property={property} />
        </div>
      </section>
    </div>
  )
}

