import { useId } from 'react';
import { FaAsterisk } from "react-icons/fa6";
import './input.css';


export interface TextInputProps {
  label: string;
  name: string;
  value:string;
  classes?: string;
  values: string[];
  required?: boolean,
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  ref?: React.RefObject<HTMLSelectElement | null>;
}


function SelectInput({required = false, ref, value, name, values, label, classes, onChange }: TextInputProps) {
  const id = useId();
  return (
    <div className={`form-input-container d-flex flex-column mt-4  ${classes}`}>
      <label htmlFor={id} className="form-label">
        {label} {required && <FaAsterisk className='asterisk-icon'/>}
      </label>
      <select
        className='pe-4 me-3'
        ref={ref}
        name={name}
        id={id}
        value={value}
        onChange={onChange} 
      >
        {values.map(value => (
          <option key={value} value={value}>{value}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectInput;