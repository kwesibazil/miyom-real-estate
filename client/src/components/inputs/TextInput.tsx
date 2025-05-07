import './input.css';
import { FaAsterisk } from "react-icons/fa6";

export interface TextInputProps {
  label:string;
  name: string;
  classes?: string;
  placeholder:string;
  required: boolean,
  value?: string
  type?:string;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}



function TextInput({type="text", autoComplete="off", onChange,  value, name, placeholder, label, classes, required = false}:TextInputProps){
  return(
    <div className={`form-input-container ${classes}`}>

      <label htmlFor={name} className="form-label">
        {label} {required && <FaAsterisk className='asterisk-icon'/>}
      </label>

      <input 
        required={required}
        type={type}
        id={name} 
        name={name}
        autoComplete={autoComplete}
        value= {value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}


export default TextInput;
