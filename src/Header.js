import React from "react";
import "./css/Header.css";
import logo from "./images/logo.png";
import DateTime from "./DateTime";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/`;
    navigate(path);
  };
  return (
    <nav className="header">
      <img className="logo" src={logo} />
      <div className="header-title">
        <p onClick={routeChange}>
          SUPPLYCHAIN & LOGISTICS MANAGEMENT BASED ON ETHEREUM
        </p>
      </div>
      <div className="header-end">
        <p>{props.accountAddress}</p>
        <DateTime />
      </div>
    </nav>
  );
};

export default Header;
