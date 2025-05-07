import { useId } from 'react';
import { MdEmail } from "react-icons/md";
import { FaAsterisk } from "react-icons/fa6";
import './input.css';


interface EmailInputProps {
  value: string
  classes?: string;
  placeholder?:string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}




function EmailInput({onChange, value, classes, placeholder="email"}: EmailInputProps){
  const id = useId();
  return(
    <div className={`input-container mb-4 ${classes} `}>
      <label htmlFor={id}>
        Email address<FaAsterisk className='asterisk-icon'/>
        </label>
      <input 
        required
        name="email"
        id={id}
        type="email" 
        value={value} 
        autoComplete="email"
        onChange={onChange}
        placeholder={placeholder}
      />
      <MdEmail className="input-icon start-0"/>
    </div>
  )
}

export default EmailInput;