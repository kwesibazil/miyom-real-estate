import './input.css';
import { useId } from 'react';

export interface DateInputProps {
  label:string;
  name: string;
  classes?: string;
  placeholder:string;
  value: string;
  ref?:React.RefObject<HTMLInputElement | null>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}



function DateInput({ref, value, onChange, name, placeholder, label, classes}:DateInputProps){
  const id = useId();

  return(
    <div className={`form-input-container ${classes}`}>
      <label  htmlFor={id} className="form-label">{label}</label>
      <input 
        ref={ref}
        id={id}
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default DateInput;
