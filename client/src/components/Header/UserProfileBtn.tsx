import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom"

import { selectUser } from "@store/features/auth/AuthSlice.store";
import { useAppDispatch, useAppSelector } from "@hooks/useRedux.hook";

import { logoutThunk } from '@store/features/auth/AuthThunk.store';
import { resetAuthState } from "@store/features/auth/AuthSlice.store";
import { resetDisplayState } from "@store/features/display/DisplaySlice.store";
import { resetPropertyState } from "@store/features/property/PropertySlice.store";


import { ModalForms } from "@store/features/display/displayStore.interface";

import Modal from "@components/modal/ModalContainer";

import { BsCameraFill } from "react-icons/bs";
import { GoTriangleDown , GoTriangleUp} from "react-icons/go";
import { IoLogOut } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";

import { uploadProfileImageThunk } from "@store/features/auth/AuthThunk.store";
import './Header.css'


const UserProfileBtn = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const menuRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const user = useAppSelector(selectUser)


  const logout = async() => {
    try { 
      dispatch(resetAuthState());
      dispatch(resetDisplayState());
      dispatch(resetPropertyState());
      dispatch(logoutThunk());
      sessionStorage.clear();
      navigate('/')
    } catch (error) {}
  }



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleFileUpload =  useCallback(async(event: React.ChangeEvent<HTMLInputElement>) =>{
    try {
      const input = event.target
      const profileImage = input.files?.[0];

      if (profileImage && profileImage.type.startsWith('image/'))
        await dispatch(uploadProfileImageThunk(profileImage)).unwrap()
  
      input.value = "";
    } catch (error:any) {}
  },[])


  return(
    <div ref={menuRef} className="user-menu me-1 ms-3 ms-sm-4">
      <button onClick={()=> setVisible(prev => !prev)} className="px-1 user-profile-btn btn btn-link d-flex align-items-center">
        <img className="header-profile-img me-2" src={user?.profileImgUrl.url} alt={user?.email} />
        {
          visible ? <GoTriangleUp /> :  <GoTriangleDown />
        }
      </button>
      {
        <div className={`user-menu-box shadow-lg ${visible ? '' : 'd-none'}`}>
          <div className="user-menu-box-header">
            <img className="user-profile-image" src={user?.profileImgUrl.url} alt={user?.email} />
            <div className="overflow-hidden">
              <p className="username mb-0">{user?.firstName} {user?.lastName}</p>
              <p className="user-email mb-0">{user?.email}</p>
            </div>
          </div>
          <ul className="navbar-nav user-menu-nav-links">
            <li  className = "nav-item position-relative upload-container"> 
              <div className="nav-link d-flex ">
                <BsCameraFill />
                <input onChange={handleFileUpload} type="file" className="upload-profile-image" id="profile-img" accept="image/jpeg,image/png,image/webp"/>
                <span className="text-capitalize fw-medium ms-2">upload Profile Image</span>
              </div>
            </li>
            <li  className = "nav-item"  onClick={()=> setVisible(false)}> 
              <Modal buttonText="New Investor" name={ModalForms.UpdatePasswordForm}>
                <div className="nav-link">
                  <RiLockPasswordFill />
                  <span className="text-capitalize fw-medium ms-2">Change Password</span>
                </div>
              </Modal> 
            </li>
            <li className="nav-item logout-btn" onClick={logout}> 
              <NavLink to="" viewTransition className="nav-link">
                <IoLogOut />
                <span className="text-capitalize fw-medium ms-2">Logout</span>
              </NavLink>
            </li>
          </ul>
        </div>
      }
    </div>
  )
}


export default UserProfileBtn