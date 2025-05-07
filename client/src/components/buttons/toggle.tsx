import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@hooks/useRedux.hook";
import { toggleTheme, selectTheme } from "@store/features/display/DisplaySlice.store";

import { IoMdMoon, IoIosSunny } from "react-icons/io";
import './buttons.css'


function ToggleTheme(){
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const handleClick = useCallback(()=>dispatch(toggleTheme()),[])


  return(
    <div>
      <button type="button"  className="btn btn-sm px-1 hvr-pulse theme-toggle-btn" onClick={handleClick}>
        {
          theme === 'dark' 
          ? <IoIosSunny className="fs-5 text-warning" />
          : <IoMdMoon className="fs-5 text-dark" /> 
        } 
      </button>
    </div>
  )
}

export default ToggleTheme
