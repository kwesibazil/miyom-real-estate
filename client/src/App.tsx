import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useAppDispatch, } from "@hooks/useRedux.hook";
import { initTheme } from "@store/features/display/DisplaySlice.store";




export default function App():React.JSX.Element{
  const dispatch = useAppDispatch();
  useEffect(() => { dispatch(initTheme()); }, []);
  return( <Outlet /> )
}