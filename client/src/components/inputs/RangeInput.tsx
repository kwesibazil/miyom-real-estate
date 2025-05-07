import { useId } from 'react';
import { FaAsterisk } from "react-icons/fa6";
import './input.css';



export interface RangeInputProps {
  label:string;
  name: string;
  value?: string
  classes?: string;
  placeholder:string;
  required?: boolean,
  ref?:React.RefObject<HTMLInputElement | null>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}



function RangeInput({onChange, ref, value, name, placeholder, label, classes, required = false}:RangeInputProps){
  const id = useId();
  return(
    <div className={`form-input-container ${classes}`}> 
      <label htmlFor={id} className="form-label mb-0 mt-4">
        {label} {required && <FaAsterisk className='asterisk-icon'/>}
        <span className="ms-2  fw-bold">{value} %</span>
      </label>

      <input 
        ref={ref}
        id={id}
        max={100}
        min={0}
        type="range" 
        name={name}
        value= {value}
        required={required}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default RangeInput;


