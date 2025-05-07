import { useNavigate} from "react-router-dom"
import { useCallback} from "react";

import { selectUser} from "@store/features/auth/AuthSlice.store";
import { useAppDispatch, useAppSelector } from "@hooks/useRedux.hook";
import { toggleSideNav } from "@store/features/display/DisplaySlice.store";

import {FaAlignJustify} from "react-icons/fa";
import ToggleTheme from "@components/buttons/toggle";
import './header.css';


import UserProfileBtn from "./UserProfileBtn";

export default function Header(){
  return(
    <header className="main-header px-2 px-lg-1">
      <Brand/>
      <div className="header-util-menu col col-sm-6 ms-auto">
        <ToggleTheme />
        <UserProfileBtn />
      </div>
    </header>
  )
}




const Brand = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser)


  const handleClick = useCallback(()=>{
    navigate('/dashboard')
  },[])

  
  const handleToggle = useCallback(()=>{
    dispatch(toggleSideNav()); 
  },[])


  return(
    <div className="header-brand-container col">
      <span>
        <FaAlignJustify onClick={handleToggle} className="hamburger fs-2 ms-2 me-3 ms-lg-2 d-lg-none " /> 
      </span>
      <div className="header-brand" >
        <div onClick={handleClick}>
          <h3 className="header-brand-username d-flex  fw-bold mt-1">
            Welcome Back 
            <span className="d-none d-sm-block mx-1 text-capitalize fw-bold">{user?.firstName}</span> 
            <span className="d-none d-sm-block">👋</span>
            </h3>
          <p className="header-brand-message d-none d-lg-block ">Here’s what’s happening with your real estate investments today</p>
        </div>
      </div>
    </div>
  )
}
