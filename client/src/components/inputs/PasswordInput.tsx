import { useState } from "react";
import { useId } from 'react';

import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import { FaAsterisk } from "react-icons/fa6";
import './input.css';


export interface PasswordInputProps {
  label:string;
  name: string;
  placeholder:string;
  classes?: string;
  value: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


function PasswordInput({value, onChange, name, label="Password", classes, placeholder="Password"}: PasswordInputProps){
  const id = useId();
  const [passwordType, setPasswordType] = useState('password')

  return(
    <div className={`input-container mb-2 ${classes} `}>
      <label htmlFor={id}  className="form-label">
        {label} <FaAsterisk className='asterisk-icon'/>
        </label>
      <input 
        required
        id={id}
        name={name}
        value={value} 
        type={passwordType}
        onChange={onChange}
        autoComplete={name}
        placeholder={placeholder}
      />


      <RiLockPasswordFill className="input-icon  start-0"/>
      {
        passwordType ==='text' 
        ? <IoIosEyeOff className="input-icon end-0 mx-3" onClick={()=>setPasswordType('password')}/> 
        : <IoMdEye className="input-icon end-0 mx-3" onClick={()=>setPasswordType('text')}/>
      }
    </div>
  )
}

export default PasswordInput;