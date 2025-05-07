import { type RouteObject } from "react-router-dom";

import ErrorLayout from "@pages/errors/ErrorLayout.page";


const errorRoutes:RouteObject = {
  path: 'error',
  element: <ErrorLayout/>,
}

export default errorRoutes;