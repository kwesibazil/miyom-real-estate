import { type RouteObject } from "react-router-dom";

import Layout from "@pages/private/Layout";
import MainLayout from "@pages/private/main-layout";


import Dashboard from "@pages/private/Dashboard/Dashboard.page";
import Property from "@pages/private/Property/PropertyLayout.page";
import SingleProperty from "@pages/private/Property/SingleProperty.page";
import Investor from "@pages/private/Investor/InvestorLayout.page";
import SingleInvestor from "@pages/private/Investor/SingleInvestor.page";
import FirstTimeLogin from "@pages/private/FirstTimeLogin";

import PrivateRoute from "@helpers/guard.helper";


const privateRoutes: RouteObject = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: "dashboard",
      element: <Layout />,
      children: [
        { index: true, element: <Dashboard /> },
      ],
    },
    {
      path: "property",
      element: <Layout />,
      children: [
        { index: true, element: <PrivateRoute element={<Property />} role="admin" />},
        { path: ":id", element: <SingleProperty /> },
      ],
    },
    {
      path: "investor",
      element: <Layout />,
      children: [
        { index: true,  element: <PrivateRoute element={ <Investor />} role="admin" />},
        { path: ":id",  element: <PrivateRoute element={ <SingleInvestor />} role="admin" />},
      ],
    },
    { path: "new-password", element: <FirstTimeLogin /> },
  ],
};

export default privateRoutes;
