import { useId } from 'react';

import { FaAsterisk } from "react-icons/fa6";
import { useState, useEffect, useRef } from 'react';
import { GoTriangleDown } from "react-icons/go";

import { useAppSelector, useAppDispatch } from '@hooks/useRedux.hook';
import { selectInvestor } from "@store/features/auth/AuthSlice.store"; 
import { ModalForms } from "@store/features/display/displayStore.interface";
import { openForm, selectForm, closeForm } from "@store/features/display/DisplaySlice.store";
import './input.css';



export interface TextInputProps {
  label: string;
  name: string;
  value: string;
  classes?: string;
  required?: boolean;
  onChange: (e: { target: { name: string; value: string } }) => void;
}

interface DisplayVales {
  id: string;
  displayed: string;
}

function InvestorSelector({ required = true, value, name, label, classes, onChange }: TextInputProps) {
  const id = useId();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<String | null>(null)
  const investorList = useAppSelector(selectInvestor);

  // this is a hack that prevents the create new investor
  // option from displaying in other forms
  const CreatePropertyForm = useAppSelector(selectForm(ModalForms.CreateNewPropertyForm));


  const [values, setValues] = useState<DisplayVales[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if (investorList) {
      const investorSelectValues = investorList.map(investor => ({
        id: investor._id,
        displayed: `${investor.firstName} ${investor.lastName} - ${investor.email}`
      }));
      setValues(investorSelectValues);
    }
  }, [investorList]);




  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);




  const handleSelect = (id: string) => {
    if (id === '__create_new__') {
      dispatch(closeForm(ModalForms.CreateNewPropertyForm));
      dispatch(openForm(ModalForms.CreateNewInvestorForm));
    } 
    
    else onChange({ target: { name, value: id } })
    setOpen(false);
    setCurrent(id)  
  };




  const selectedLabel = value === "__create_new__"
    ? "Create new Investor"
    : values.find(v => v.id === value)?.displayed || "Select an investor";



  return (
    <div className={`form-input-container d-flex flex-column mt-4 ${classes}`} ref={dropdownRef}>
      <label htmlFor={id}  className="form-label">
        {label} {required && <FaAsterisk className="asterisk-icon" />}
      </label>
      
      <div className="custom-dropdown">
        <div className="selected d-flex align-items-center" onClick={() => setOpen(!open)}>
          {selectedLabel}
          <GoTriangleDown className="ms-auto me-4 select-icon" />
        </div>

        {open && (
          <div className="options-container py-2">
            {values.map(item => (
              <div key={item.id}  className="option" onClick={() => handleSelect(item.id)}>
                <span className={`check-mark ${item.id !== current ? 'opacity-0' : '' } `}></span> 
                
                {item.displayed}
              </div>
            ))}
            {
              CreatePropertyForm && 
              <div className="option mx-2 px-3 " onClick={() => handleSelect('__create_new__')}>
                New Investor
              </div>
            }
            
          </div>
        )}

      </div>
    </div>
  );
}

export default InvestorSelector;
