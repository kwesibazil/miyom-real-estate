import { useId } from 'react';
import './input.css';


export interface NumberInputProps {
  label:string;
  name: string;
  classes?: string;
  max?:number
  placeholder:string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?:React.RefObject<HTMLInputElement | null>;
}



function NumberInput({max, value, onChange, ref, name, placeholder, label, classes}:NumberInputProps){
  const id = useId();
  
  return(
    <div className={`form-input-container ${classes}`}>
      <label htmlFor={id} className="form-label" >
        {label}</label>
      <input 
        step="0.001"
        required
        ref={ref}
        type="number" 
        id={id}
        name={name}
        min="0"
        max={max}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default NumberInput;
