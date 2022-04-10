import React, { useEffect, useRef } from "react";
import "./App.css";
import OwnedProductComponent from "./OwnedProductComponent";
import ShippedProductComponent from "./ShippedProductComponent";
import Web3 from "web3";
import SupplyChain from "./contractBuilds/SupplyChain.json";
import { OWNERADDRESS, CONTRACTADDRESS } from "./constants";
import ProductDetailsComponent from "./ProductDetailsComponent";
import Footer from "./Footer";
import { useState } from "react";
import Header from "./Header";
const web3_utils = require("web3-utils");

export default () => {
  const [accountAddress, setAccountAddress] = useState();
  const [ownedProducts, setOwnedProducts] = useState();
  const [shippedProducts, setShippedProducts] = useState([]);
  const [supplyChainContract, setContract] = useState();
  const [displayDetails, setDisplayDetails] = useState(false);
  const [productDetails, setProductDetails] = useState();
  const [shippedDisplay, setShippedDisplay] = useState(false);
  const [ownedDisplay, setOwnedDisplay] = useState(false);
  const [productId, setproductId] = useState("");
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

  const receiveProductByConsumer = async (productId, productPrice) => {
    let transaction = await supplyChainContract.methods
      .receivedbycustomer(productId)
      .send({
        from: accountAddress,
        value: web3_utils.toWei(productPrice.toString()),
      })
      .catch((error) => {
        console.log(error);
      });

    return transaction;
  };

  const ReceiveProductConsumerComponent = () => {
    const [productId, setproductId] = useState("");
    const [productPrice, setproductPrice] = useState("");

    const submitValue = async () => {
      let output = await receiveProductByConsumer(productId, productPrice);

      if (output !== undefined) {
        alert("transaction successful" + JSON.stringify(output));
      } else {
        alert("transaction unsuccessful");
      }
    };

    return (
      <div className="consumer-columm1">
        <h3>Receive Product from Retailer</h3>
        <input
          type="text"
          placeholder="Product ID"
          onChange={(e) => setproductId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Pay Price"
          onChange={(e) => setproductPrice(e.target.value)}
        />
        <button onClick={submitValue}>Submit</button>
      </div>
    );
  };

  const CollectibleForSaleByCustomerComponent = () => {
    const [productId, setproductId] = useState("");
    const [productPrice, setproductPrice] = useState("");
    const submitValue = async () => {
      let output = await collectibleForSaleByCustomer(productId, productPrice);

      if (output) {
        alert("Product Added for Sale");
      } else {
        alert("Transaction Failed, check authentication once");
      }
    };

    return (
      <div className="consumer-columm1">
        <h3>Collectible for Sale</h3>
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

  const collectibleForSaleByCustomer = async (productId, price) => {
    let transactionStatus = false;
    await supplyChainContract.methods
      .collectibleforsalebycustomer(
        productId,
        web3_utils.toWei(price.toString())
      )
      .send({ from: accountAddress })
      .then((transaction) => {
        transactionStatus = true;
      })
      .catch((error) => {
        console.log(error);
      });

    return transactionStatus;
  };

  const shippedCollectibleByCustomer = async (productId, shippedToAddress) => {
    let transactionStatus = false;
    await supplyChainContract.methods
      .shippedcollectiblebycustomer(productId, shippedToAddress)
      .send({ from: accountAddress })
      .then((transaction) => {
        transactionStatus = true;
      })
      .catch((error) => {
        console.log(error);
      });
    return transactionStatus;
  };

  const ShippedCollectibleByCustomerComponent = () => {
    const [productId, setproductId] = useState("");
    const [shippedToAddress, setshippedToAddress] = useState("");
    const submitValue = async () => {
      let output = await shippedCollectibleByCustomer(
        productId,
        shippedToAddress
      );
      if (output) {
        alert("Product Added for Shipping");
      } else {
        alert("Transaction Failed, check authentication once");
      }
    };

    return (
      <div className="consumer-columm1">
        <h3>Ship Collectible</h3>
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

  const receivedCollectibleByCustomer = async (productId, productPrice) => {
    let transaction = await supplyChainContract.methods
      .receivedcollectiblebycustomer(productId)
      .send({
        from: accountAddress,
        value: web3_utils.toWei(productPrice.toString()),
      })
      .catch((error) => {
        console.log(error);
      });

    return transaction;
  };

  const ReceivedCollectibleByCustomerComponent = () => {
    const [productId, setproductId] = useState("");
    const [productPrice, setproductPrice] = useState("");

    const submitValue = async () => {
      let output = await receivedCollectibleByCustomer(productId, productPrice);

      if (output !== undefined) {
        alert("transaction successful" + JSON.stringify(output));
      } else {
        alert("transaction unsuccessful");
      }
    };

    return (
      <div className="consumer-columm1">
        <h3>Receive Collectible from Consumer</h3>
        <input
          type="text"
          placeholder="Product ID"
          onChange={(e) => setproductId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Pay Price"
          onChange={(e) => setproductPrice(e.target.value)}
        />
        <button onClick={submitValue}>Submit</button>
      </div>
    );
  };

  const handleOwnedClick = () => {
    fetchOwnedProducts();
  };

  const fetchOwnedProducts = async () => {
    let output = await supplyChainContract.methods
      .getOwnedProducts(accountAddress)
      .call({ from: accountAddress, gas: 80000000 });

    if (output.length == 0) alert("No Owned Products");
    else {
      setOwnedProducts(output);
      setOwnedDisplay(true);
    }
  };

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

  const fetchShippedProducts = async () => {
    let output = await supplyChainContract.methods
      .getShippedProducts(accountAddress)
      .call({ from: accountAddress, gas: 80000000 });

    if (output.length == 0) alert("No Shipped Products");
    else {
      setShippedProducts(output);
      shippedDisplay(true);
    }
  };

  const ShippedProductsComponent = () => {
    return (
      <div className="manufacturer-row3">
        <div className="manufacturer-columm4" onClick={handleShippedClick}>
          <h3>Shipped Products</h3>
        </div>
        {shippedProducts && shippedDisplay ? (
          <div className="manufacturer-columm5">
            <OwnedProductComponent owned={shippedProducts} />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  const handleShippedClick = () => {
    fetchShippedProducts();
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
      <Header accountAddress={accountAddress} />
      <div className="consumer-row1">
        <ReceiveProductConsumerComponent />
        <CollectibleForSaleByCustomerComponent />
        <ShippedCollectibleByCustomerComponent />
        <ReceivedCollectibleByCustomerComponent />
      </div>
      <div>
        <OwnedProductsComponent />
      </div>
      <div>
        <ShippedProductsComponent />
      </div>
      <div>
        <FindProductComponent />
      </div>
      <Footer />
    </>
  );
};
