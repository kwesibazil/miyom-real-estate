import {memo, type PropsWithChildren } from 'react';
import './buttons.css'

import { useAppSelector } from '@hooks/useRedux.hook';
import { selectAuthStatus } from '@store/features/auth/AuthSlice.store';

function SubmitBtn({children}:PropsWithChildren){
  const loading = useAppSelector(selectAuthStatus);

  return(
    <button type='submit' className='submit-btn'>
      {children}
      { loading === 'pending' && <span className="ms-3 loader-submit"></span> }
      </button>
  )
}


export default memo(SubmitBtn);        //👈 prevents unnecessary rerender
