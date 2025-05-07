
import { useState, useCallback } from "react";
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from "@hooks/useRedux.hook";

import { FaPeopleGroup } from "react-icons/fa6";
import {FaAlignJustify } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { BsXLg, BsHousesFill } from "react-icons/bs";

import SearchBar from "@components/inputs/SearchInput";
import type { ToggleSideNavProp } from 'src/types/general.interface';
import { selectSideNavCollapse, toggleSideNav } from "@store/features/display/DisplaySlice.store";
import './SideNav.css'

import { selectUser } from "@store/features/auth/AuthSlice.store";

const links = [
  {to: '/dashboard', name:'dashboard', icon: BiSolidDashboard, admin: false},
  {to: '/property', name:'property', icon: BsHousesFill, admin: true},
  {to: '/investor', name:'investors', icon:  FaPeopleGroup, admin:true},
]

interface NavLinksProp{
  handleToggle: () => void
}


export default function SideNav(){
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectSideNavCollapse); 
  const handleToggle = useCallback(() => { 
    dispatch(toggleSideNav());
  }, [dispatch]);


  return(
    <>
      <div className={`modal-overlay ${isOpen ? 'visible' : ''}`} onClick={handleToggle}></div>
      <aside className={`side-nav shadow ${isOpen ? 'visible' : ''}`}>
        <Toggle handleToggle={handleToggle}/>
        <SearchBarContainer />
        <NavLinks handleToggle={handleToggle}/>
      </aside>
    </>
  )
}


// hidden on large and greater screens
const Toggle = ({handleToggle}:ToggleSideNavProp) => {
  return(
    <div className="side-nav-toggle-container mt-2">
      <span> <FaAlignJustify onClick={handleToggle} className="fs-4 mx-2 d-none d-lg-block" /></span>
      <h1 className="primary-heading text-uppercase target ">mioym</h1>
      <BsXLg onClick={handleToggle} className="ms-auto fs-5 d-lg-none"/> 
    </div>
  )
}



const SearchBarContainer = () => {
  return(
    <div className="side-nav-search-container my-4 mt-5 shadow-sm border border-dark rounded-2">
      <SearchBar/>
    </div>
  )
}


const NavLinks = ({handleToggle}:NavLinksProp)=> {
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard');
  const user = useAppSelector(selectUser)

  const handleClick = (name:string) => {
    setActive(name);
    if (window.innerWidth < 992) handleToggle();
  }

  const navigateTo = useCallback((url:string)=>{
    navigate(url)
  },[]) 

  return(
    <nav className="navbar align-items-start col pt-3 border-top border-secondary">
      <ul className="navbar-nav w-100">
        {links
        .filter(link => user?.userRole === 'admin' || !link.admin)
        .map(link => (
          <li onClick={()=>navigateTo(link.to) } key={link.name} className = {`nav-item ${active === link.name ? 'active closeSideNavMobile' : ''}`}> 
            <NavLink to={link.to} viewTransition className="nav-link" onClick={_ => handleClick(link.name)}>
              <link.icon className="nav-icon me-2 fs-5 fs-md-4" />
              <span className="text-capitalize fw-medium">{link.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="fixed-to-bottom px-4 ">
        <p className="mb-1">Privacy Policy Terms of Service</p>
        <p className="mb-1">@2025</p>
      </div>
    </nav>
  )
}
