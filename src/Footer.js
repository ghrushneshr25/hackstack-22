import React from "react";
import DYPLogo from "./images/DYPLogo.png";

export default () => {
  return (
    <div class="footer">
      <div>
        <img
          className="mulogo"
          src="https://media.9curry.com/uploads/organization/image/541/mumbai-university.png"
        />
      </div>
      <div>
        <p>
          Made By: Ghrushnesh Rathod, Shubham More & Amit Patil<br></br>
          Under Guidance: Mrs. Sheetal Ahir<br></br>
          DEPARTMENT OF COMPUTER ENGINEERING <br></br>RAMRAO ADIK INSTITUTE OF
          TECHNOLOGY, NERUL<br></br>MUMBAI UNIVERSITY
        </p>
      </div>
      <div>
        <img className="dyplogo" src={DYPLogo} />
      </div>
    </div>
  );
};
