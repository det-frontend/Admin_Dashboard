import React, { useEffect, useState } from "react";
import {
  RouterProvider,
  Navigate,
  createBrowserRouter,
} from "react-router-dom";
import Layout from "./layout/Layout";
import DailyList from "./pages/manager/DailyList";
import DailySale from "./pages/manager/DailySale";
import FuelBalance from "./pages/manager/FuelBalance";
import FuelIn from "./pages/manager/FuelIn";
import Manager from "./pages/manager/Manager";
import SaleSummary from "./pages/manager/SaleSummary";
import TankData from "./pages/manager/TankData";
import PriceChg from "./pages/manager/PriceChg";
import Report from "./components/nested/Report";
import Stock from "./components/nested/Stock";
import Welcome from "./pages/installer/Welcome";
import Device from "./pages/installer/Device";
import Cashier from "./pages/installer/Cashier";
import Role from "./pages/installer/Role";
import Tank from "./pages/installer/Tank";
import Totallizer from "./pages/installer/Totallizer";
import Login from "./pages/Login";
import InstallerManager from "./pages/installer/InstallerManager";
import AuthContext from "./services/AuthContext";
import Re from "./services/Re";
import DeviceControl from "./pages/manager/DeviceControl";
import LoadContext from "./services/LoadContext";

const App = () => {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reFresh, setReFresh] = useState(false);

  const [auth, setAuth] = useState(true);

  useEffect(() => {
    let token = localStorage.getItem("encryptedToken");
    if (token) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [isAuth]);

  useEffect(() => {
    const check = JSON.parse(localStorage.getItem("installed"));
    if (check) {
      setIsInstalling(true);
    } else {
      setIsInstalling(false);
    }
  }, [isAuth]);

  console.log("install", isInstalling);

  // useEffect(() => {
  //   if (localStorage.getItem("installed") === null) {
  //     localStorage.setItem("installed", false);
  //     setIsInstalling(true);
  //   } else {
  //     setIsInstalling(JSON.parse(localStorage.getItem("installed")));
  //   }
  // }, []);

  const managerRouter = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: auth ? <Layout /> : <Navigate to="/login" />,
      children: [
        {
          index: true,
          element: <Manager />,
        },
        {
          path: "/daily_list",
          element: <DailyList />,
          children: [
            {
              index: true,
              element: <Report />,
            },
            {
              path: "/daily_list/stock",
              element: <Stock />,
            },
          ],
        },
        {
          path: "/daily_sale",
          element: <DailySale />,
        },
        {
          path: "/device",
          element: <DeviceControl />,
        },
        {
          path: "/fuel_balance",
          element: <FuelBalance />,
        },
        {
          path: "/fuel_in",
          element: <FuelIn />,
        },
        {
          path: "/sale_summary",
          element: <SaleSummary />,
        },
        {
          path: "/tank_data",
          element: <TankData />,
        },
        {
          path: "/price_chg",
          element: <PriceChg />,
        },
      ],
    },
  ]);

  const installerRouter = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: auth ? <Layout /> : <Navigate to="/login" />,
      children: [
        {
          index: true,
          element: <Device />,
        },
        {
          path: "/cashier",
          element: <Cashier />,
        },
        {
          path: "/manager",
          element: <InstallerManager />,
        },
        {
          path: "/role",
          element: <Role />,
        },
        {
          path: "/tank",
          element: <Tank />,
        },
        {
          path: "/totallizer",
          element: <Totallizer />,
        },
      ],
    },
  ]);

  console.log("hellolllllllllllllllllllllllllllllllll", reFresh);
  return (
    <Re.Provider value={{ reFresh, setReFresh }}>
      <AuthContext.Provider value={{ isAuth, setIsAuth }}>
        <LoadContext.Provider value={{ loading, setLoading }}>
          <RouterProvider
            router={isInstalling ? installerRouter : managerRouter}
          />
        </LoadContext.Provider>
      </AuthContext.Provider>
    </Re.Provider>
  );
};

export default App;
