import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: React.JSX.Element;
  role: "admin" | "investor"; 
}
import { useAppSelector, useAppDispatch } from "@hooks/useRedux.hook";
import { logoutThunk } from '@store/features/auth/AuthThunk.store';
import { selectUser } from "@store/features/auth/AuthSlice.store";
import { resetAuthState } from "@store/features/auth/AuthSlice.store";
import { resetDisplayState } from "@store/features/display/DisplaySlice.store";
import { resetPropertyState } from "@store/features/property/PropertySlice.store";




const PrivateRoute = ({ element, role }:PrivateRouteProps) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser);

  if (!user) {
    dispatch(resetAuthState());
    dispatch(resetDisplayState());
    dispatch(resetPropertyState());
    dispatch(logoutThunk());
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  if (role === 'admin' && user?.userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return element;

}


export default PrivateRoute
