import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../Components/Pages/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

const Main = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer />
    </div>
  );
};

export default Main;
