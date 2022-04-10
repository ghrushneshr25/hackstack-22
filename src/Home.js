import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header.js";
import "./css/main.css";
import Footer from "./Footer.js";

const Home = () => {
  return (
    <>
      <Header />
      <div className="home-section">
        <div className="home-row1">
          <Link to="/owner">
            <div className="home-buttons">Owner</div>
          </Link>
          <Link to="/manufacturer">
            <div className="home-buttons">Manufacturer</div>
          </Link>
          <Link to="/distributor">
            <div className="home-buttons">Distributor</div>
          </Link>
        </div>
        <div className="home-row1">
          <Link to="/retailer">
            <div className="home-buttons">Retailer</div>
          </Link>
          <Link to="/consumer">
            <div className="home-buttons">Consumer</div>
          </Link>
        </div>
      </div>
      <div class="home-footer">
        <Footer />
      </div>
    </>
  );
};

export default Home;
