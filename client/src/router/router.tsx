import { createBrowserRouter} from "react-router-dom";

//layout imports
import App from "../App";                                       //👈 root element
import Error from '@pages/errors/ErrorLayout.page';          //👈 error element

import errorRoutes from "./error.routes";                    //👈 error routes
import publicRoutes from "./public.routes";                  //👈 public routes
import privateRoutes from "./private.route";


import ResetPasswordForm from "@pages/public/RestPassword";


export default createBrowserRouter([{
  path: '/',
  element: <App />,
  errorElement: <Error />,
  children:[
    publicRoutes, 
    privateRoutes,
    errorRoutes,
    { path: "reset-password", element: <ResetPasswordForm /> },
    ]
}]);
