import ReactDOM from "react-dom";
import {useCallback} from "react";
import { useAppDispatch, useAppSelector } from "@hooks/useRedux.hook";
import { selectForm, toggleModal, closeForm } from "@store/features/display/DisplaySlice.store";

import { MdEdit } from "react-icons/md";
import { IoIosAdd, IoMdClose } from "react-icons/io";
import { ModalForms } from "@store/features/display/displayStore.interface";

import CreateNewInvestorForm from "@components/forms/CreateNewInvestorForm";
import CreateNewPropertyForm from "@components/forms/CreateNewPropertyForm";
import UpdatePropertyForm from "@components/forms/UpdatePropertyForm";
import UpdateInvestorForm from "@components/forms/UpdateInvestorForm";
import UpdatePasswordForm from "@components/forms/UpdatePasswordForm";

import { selectUser } from "@store/features/auth/AuthSlice.store";

import './Modal.css';

interface ModalContainerProps {
  id?: string,
  name: ModalForms;
  buttonText:string
  children?: React.ReactNode;
}


function ModalContainer({buttonText, name, id, children}: ModalContainerProps){
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectForm(name));
  const user = useAppSelector(selectUser)
  
  const handleToggle = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const targetElement = event.target as HTMLElement;
    if (
      event.currentTarget.contains(targetElement) || 
      targetElement.closest('.modal-close-btn')
    ) {
      dispatch(toggleModal(name));
    }
  }, [dispatch, name]);


  const closeModal = useCallback(() => {
    dispatch(closeForm(name));
  }, [dispatch, name]);

  if(name !== ModalForms.UpdatePasswordForm && user?.userRole !== 'admin') return null

  const modalContent = (
    <>
      <div className={`main-modal-overlay ${isOpen ? 'visible' : ''}`} onClick={handleToggle}></div>
        <div className={`px-4 modal-container shadow ${isOpen ? 'visible' : ''} ${name === ModalForms.UpdatePasswordForm ? 'small-modal' : ''} `} data-modal-content>
          <span className="modal-close-btn" onClick={handleToggle}>
            <IoMdClose className="ms-auto mb-2 mt-3 fs-4 bi bi-x-lg text-secondary" />
          </span>

          {(ModalForms.UpdatePasswordForm === name) && <UpdatePasswordForm closeModal={closeModal} handleToggle={handleToggle} />}
          {(ModalForms.CreateNewInvestorForm === name) && <CreateNewInvestorForm closeModal={closeModal} handleToggle={handleToggle} />}
          {(ModalForms.CreateNewPropertyForm  === name) && <CreateNewPropertyForm handleToggle={handleToggle} closeModal={closeModal} />}
          {(ModalForms.UpdatePropertyForm === name)  && <UpdatePropertyForm propertyId={id} closeModal={closeModal} handleToggle={handleToggle} />}
          {(ModalForms.UpdateInvestorForm === name) && <UpdateInvestorForm closeModal={closeModal} investorId={id} handleToggle={handleToggle} />}
        </div>
    </>
  );

  return (
    <>
      {ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!)}
      {
        children ? <span  onClick={handleToggle}>{children}</span>:
        <button className='d-flex align-items-center btn btn-sm btn-primary text-white' onClick={handleToggle}>
          {(name === ModalForms.UpdatePropertyForm || name === ModalForms.UpdateInvestorForm)
            ? <MdEdit className="fs-6" />
            : <IoIosAdd className='fs-5' />}
          <span>{buttonText}</span>
        </button>
      }
    </>
  );
}

export default ModalContainer;