import { type RouteObject } from "react-router-dom";
import LandingPage from "@pages/public/Landing.page";

const publicRoutes:RouteObject = {
  path: '/',
  element: <LandingPage />,
}


export default publicRoutes;