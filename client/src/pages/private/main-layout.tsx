import {useCallback, useEffect, useState } from 'react'
import {Outlet, Navigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from '@hooks/useRedux.hook';
import { selectIsLoggedIn} from '@store/features/auth/AuthSlice.store';
import { selectDashboardViewed, updateViewed } from "@store/features/display/DisplaySlice.store";

import LoadingScreen from './Loading';

function MainLayout(){
  const dispatch = useAppDispatch();
  const viewed = useAppSelector(selectDashboardViewed);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  
  const [viewedOnce, setViewedOnce] = useState(viewed);
  const handleLoading = useCallback(() => setViewedOnce(true),[])

  useEffect(()=>{
    if(viewedOnce)
      dispatch(updateViewed('dashboard'))    
  },[viewedOnce])


  if(!isLoggedIn) return <Navigate to='/' replace />
  if(!viewedOnce) return <LoadingScreen handleLoading={handleLoading} />  


  return( 
  <div className='w-100'>
    <Outlet />
  </div>

)
}


export default MainLayout;