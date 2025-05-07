import {Outlet, Navigate } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/useRedux.hook";

import { FetchInvestorsThunk } from "@store/features/auth/AuthThunk.store";
import { fetchInvestorProperties } from "@store/features/property/PropertyThunk.store";

import Header from '@components/Header/Header';
import SideNav from '@components/navbar/SideNav';
import { selectIsLoggedIn, selectUser, selectFirstLogin} from '@store/features/auth/AuthSlice.store';


function Layout(){
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isFirstLogin = useAppSelector(selectFirstLogin);

  if(!isLoggedIn || !user) return <Navigate to='/' replace />
  if(isFirstLogin) return <Navigate to='/new-password' replace />


  const handleFetchData = useCallback(async()=>{
    try {
      await dispatch(FetchInvestorsThunk(user._id)).unwrap();
      await dispatch(fetchInvestorProperties(user._id)).unwrap();
      
    } catch (error:any) {}
  },[user])

  useEffect(()=>{handleFetchData()},[])
  

  return(
    <div className='d-lg-flex vh-100 overflow-hidden w-100 gap-4'>
      <SideNav />
      <section className='flex-grow-1 h-100 d-flex flex-column'>
        <Header/>
        <main className='pb-3 px-3 pe-lg-2 flex-grow-1 overflow-hidden  me-lg-4 overflow-x-hidden'>
          <Outlet />
        </main>
      </section>
    </div>
  )
}

export default Layout;



// <main className='pb-3 flex-grow-1 overflow-hidden px-3 px-lg-1 pe-lg-4'>
// <Outlet />
// </main>