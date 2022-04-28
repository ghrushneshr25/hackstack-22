import React, { useEffect, useRef } from "react";
import "./App.css";
import ProductDetailsComponent from "./ProductDetailsComponent";
import Web3 from "web3";
import SupplyChain from "./contractBuilds/SupplyChain.json";
import { CONTRACTADDRESS } from "./constants";
import { useState } from "react";
import Header from "./Header";
import "./css/main.css";
import Footer from "./Footer";

export default () => {
  const [accountAddress, setAccountAddress] = useState();
  const [supplyChainContract, setContract] = useState();
  const [displayDetails, setDisplayDetails] = useState(false);
  const [productDetails, setProductDetails] = useState();

  let web3;

  const init = async () => {
    let provider = window.ethereum;
    if (typeof provider !== "undefined") {
      provider
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAccountAddress(accounts[0]);
        })
        .catch((error) => {});

      window.ethereum.on("accountsChanged", function(accounts) {
        setAccountAddress(accounts[0]);
      });
    }
    web3 = new Web3(provider);
    setContract(new web3.eth.Contract(SupplyChain.abi, CONTRACTADDRESS));
  };

  const AddManufacturerComponent = () => {
    const [address, setAddress] = useState("");

    const submitValue = async () => {
      let output = await supplyChainContract.methods
        .addManufacturer(address)
        .send({ from: accountAddress })
        .catch((error) => {
          console.log(error);
        });
      if (output !== undefined) {
        alert("Manufacturer Added");
      } else {
        alert("Manufacturer Not Added");
      }
    };

    return (
      <div className="owner-columm1">
        <h4>Add Manufacturer</h4>
        <input
          type="text"
          placeholder="Manufacturer Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={submitValue}>Submit</button>
      </div>
    );
  };

  const AddDistributorComponent = () => {
    const [address, setAddress] = useState("");

    const submitValue = async () => {
      let output = await supplyChainContract.methods
        .addDistributor(address)
        .send({ from: accountAddress })
        .catch((error) => {
          console.log(error);
        });
      if (output !== undefined) {
        alert("Distributor Added");
      } else {
        alert("Distributor Not Added");
      }
    };

    return (
      <div className="owner-columm1">
        <h4>Add Distributor</h4>
        <input
          type="text"
          placeholder="Distributor Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={submitValue}>Submit</button>
      </div>
    );
  };

  const AddRetailerComponent = () => {
    const [address, setAddress] = useState("");

    const submitValue = async () => {
      let output = await supplyChainContract.methods
        .addRetailer(address)
        .send({ from: accountAddress })
        .catch((error) => {
          console.log(error);
        });
      if (output !== undefined) {
        alert("Retailer Added");
      } else {
        alert("Retailer Not Added");
      }
    };

    return (
      <div className="owner-columm1">
        <h4>Add Retailer</h4>
        <input
          type="text"
          placeholder="Retailer Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={submitValue}>Submit</button>
      </div>
    );
  };

  const AddConsumerComponent = () => {
    const [address, setAddress] = useState("");

    const submitValue = async () => {
      let output = await supplyChainContract.methods
        .addConsumer(address)
        .send({ from: accountAddress })
        .catch((error) => {
          console.log(error);
        });
      if (output !== undefined) {
        alert("Consumer Added").then(window.location.reload(false));
      } else {
        alert("Consumer Not Added");
      }
    };

    return (
      <div className="owner-columm1">
        <h4>Add Consumer</h4>
        <input
          type="text"
          placeholder="Consumer Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={submitValue}>Submit</button>
      </div>
    );
  };

  const FindProductComponent = () => {
    const [productId, setproductId] = useState("");

    const getProductDetails = async (productId) => {
      let productState = -1;
      let details = await supplyChainContract.methods
        .productDetail(productId)
        .call({ from: accountAddress })
        .catch((error) => {
          console.log(error);
        });
      if (details["uin"] == 0) {
        return undefined;
      }
      productState = details["productState"];

      let events = [];
      const e1 = await supplyChainContract.getPastEvents("allEvents", {
        filter: { uid: productId },
        fromBlock: 0,
        toBlock: "latest",
      });

      for (var j of e1) {
        if (j.returnValues.uin == productId) {
          events.push(j);
        }
        // }
        // i++;
      }

      return [details, events];
    };

    const submitValue = async () => {
      let fetched = await getProductDetails(productId);
      if (fetched === undefined) {
        alert("PRODUCT NOT FOUND");
        return;
      }
      setProductDetails(fetched);
      setDisplayDetails(true);
    };

    return (
      <div className="owner-row2" npm>
        <div className="manufacturer-columm2">
          <h3>Get Product Details</h3>
          <input
            type="text"
            placeholder="Product ID"
            onChange={(e) => setproductId(e.target.value)}
          />
          <button onClick={submitValue}>Submit</button>
        </div>
        {productDetails && displayDetails ? (
          <div className="manufacturer-columm3">
            <ProductDetailsComponent details={productDetails} />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Header accountAddress={accountAddress} role={"Owner"} />
      <div className="owner-row1">
        <AddManufacturerComponent />
        <AddDistributorComponent />
        <AddRetailerComponent />
        <AddConsumerComponent />
      </div>
      <div>
        <FindProductComponent />
      </div>
      <Footer />
    </>
  );
};
