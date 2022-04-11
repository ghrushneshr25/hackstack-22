import React, { useEffect, useRef } from "react";
import "./App.css";
import OwnedProductComponent from "./OwnedProductComponent";
import ProductDetailsComponent from "./ProductDetailsComponent";
import Web3 from "web3";
import SupplyChain from "./contractBuilds/SupplyChain.json";
import Header from "./Header";
import { OWNERADDRESS, CONTRACTADDRESS } from "./constants";
import { useState } from "react";
import { Button } from "react-bootstrap";
import Footer from "./Footer";
const web3_utils = require("web3-utils");

export default () => {
  const [accountAddress, setAccountAddress] = useState();
  const [ownedProducts, setOwnedProducts] = useState();
  const [supplyChainContract, setContract] = useState();
  const [displayDetails, setDisplayDetails] = useState(false);
  const [productDetails, setProductDetails] = useState();
  const [ownedDisplay, setOwnedDisplay] = useState(false);

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

  const fetchOwnedProducts = async () => {
    let output = await supplyChainContract.methods
      .getOwnedProducts(accountAddress)
      .call({ from: accountAddress, gas: 80000000 });
    console.log(output);
    if (output.length == 0) alert("No Products Owned");
    else setOwnedProducts(output);
  };

  const produceByManufacturer = async (
    productName,
    productDesc,
    productType,
    collectible,
    weight
  ) => {
    let transaction = await supplyChainContract.methods
      .producebymanufacturer(
        productName,
        productDesc,
        productType,
        collectible,
        weight
      )
      .send({ from: accountAddress })
      .catch((error) => {
        console.log(error);
      });

    console.log(transaction.events.EProducedByManufacturer.returnValues[0]);
    fetchOwnedProducts(accountAddress);
    return transaction;
  };

  const AddProductComponent = () => {
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productType, setProductType] = useState("");
    const [collectible, setCollectible] = useState("");
    const [weight, setWeight] = useState("");

    const submitValue = async () => {
      let output = await produceByManufacturer(
        productName,
        productDescription,
        productType,
        collectible,
        weight
      );

      if (output !== undefined) {
        console.log(output);
        alert(
          "transaction successful \n Product Id: " +
            output.events.EProducedByManufacturer.returnValues.uin
        );
      } else {
        alert("transaction unsuccessful");
      }
    };

    return (
      <div className="manufacturer-columm1">
        <h3>Add Product</h3>
        <input
          type="text"
          placeholder="Product Name"
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Product Description"
          onChange={(e) => setProductDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Product Type"
          onChange={(e) => setProductType(e.target.value)}
        />
        <div className="addProduct">
          <input
            className="add-product-collectible"
            type="text"
            placeholder="Collectible True/False"
            onChange={(e) => setCollectible(e.target.value)}
          />
          <input
            className="add-product-weight"
            type="text"
            placeholder="Weight"
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <button onClick={submitValue}>Submit</button>
      </div>
    );
  };

  const ForSaleByManufacturerComponent = () => {
    const [productId, setproductId] = useState("");
    const [productPrice, setproductPrice] = useState("");
    const submitValue = async () => {
      let output = await saleByManufacturer(productId, productPrice);

      if (output) {
        alert("Product Added for Sale");
      } else {
        alert("Transaction Failed, check authentication once");
      }
    };

    return (
      <div className="manufacturer-columm1">
        <h3>Add Product to Sale</h3>
        <input
          type="text"
          placeholder="Product ID"
          onChange={(e) => setproductId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Product Price"
          onChange={(e) => setproductPrice(e.target.value)}
        />
        <button onClick={submitValue}>Submit</button>
      </div>
    );
  };

  const saleByManufacturer = async (productId, price) => {
    let transactionStatus = false;
    await supplyChainContract.methods
      .forsalebymanufacturer(productId, web3_utils.toWei(price.toString()))
      .send({ from: accountAddress })
      .then((transaction) => {
        transactionStatus = true;
      })
      .catch((error) => {
        console.log(error);
      });

    return transactionStatus;
  };

  const shippedByManufacturer = async (productId, shippedToAddress) => {
    let transactionStatus = false;
    await supplyChainContract.methods
      .shippedbymanufacturer(productId, shippedToAddress)
      .send({ from: accountAddress })
      .then((transaction) => {
        transactionStatus = true;
      })
      .catch((error) => {
        console.log(error);
      });
    return transactionStatus;
  };

  const ShippedByManufacturerComponent = () => {
    const [productId, setproductId] = useState("");
    const [shippedToAddress, setshippedToAddress] = useState("");
    const submitValue = async () => {
      let output = await shippedByManufacturer(productId, shippedToAddress);
      if (output) {
        alert("Product Added for Sale");
      } else {
        alert("Transaction Failed, check authentication once");
      }
    };

    return (
      <div className="manufacturer-columm1">
        <h3>Ship Product</h3>
        <input
          type="text"
          placeholder="Product ID"
          onChange={(e) => setproductId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          onChange={(e) => setshippedToAddress(e.target.value)}
        />
        <button onClick={submitValue}>Submit</button>
      </div>
    );
  };

  const FindProductComponent = () => {
    const [productId, setproductId] = useState("");
    const getProductDetails = async (productid) => {
      let productState = -1;
      let details = await supplyChainContract.methods
        .productDetail(productid)
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
        filter: { uid: productid },
        fromBlock: 0,
        toBlock: "latest",
      });

      for (var j of e1) {
        if (j.returnValues.uin == productid) {
          events.push(j);
        }
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
      <div className="manufacturer-row2">
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

  const handleOwnedClick = () => {
    fetchOwnedProducts();
    setOwnedDisplay(true);
  };

  useEffect(() => {
    init();
  }, []);

  const OwnedProductsComponent = () => {
    return (
      <div className="manufacturer-row3">
        <div className="manufacturer-columm4" onClick={handleOwnedClick}>
          <h3>Owned Products</h3>
        </div>
        {ownedProducts && ownedDisplay ? (
          <div className="manufacturer-columm5">
            <OwnedProductComponent owned={ownedProducts} />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  return (
    <>
      <Header accountAddress={accountAddress} role={"Manufacturer"} />
      <div className="manufacturer-row1">
        <AddProductComponent />
        <ForSaleByManufacturerComponent />
        <ShippedByManufacturerComponent />
      </div>
      <div>
        <OwnedProductsComponent />
      </div>
      <div>
        <FindProductComponent />
      </div>
      <Footer />
    </>
  );
};
