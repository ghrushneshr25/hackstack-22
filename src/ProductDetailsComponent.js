import React, { useState } from "react";
import web3 from "web3";
import "./css/main.css";

const ProductComponent = (props) => {
  let detail = props.details;
  let date = timeConverter(detail.productDate);

  return (
    <>
      <div>
        <p>
          <b>UIN: </b>
          {detail.uin}
        </p>
        <p>
          <b>Product Name:</b> {detail.productName}
        </p>
        <p>
          <b>Product Description:</b> <br></br> {detail.productDescription}
        </p>
        <p>
          <b>Product Type:</b> {detail.productType}
        </p>
        <p>
          <b>Weight:</b> {detail.weight}
        </p>
        <p>
          <b>Date of Production:</b> <br></br>
          {date}
        </p>
        <p>
          <b>Owner:</b> <br></br>
          {detail.CurrentOwner}
        </p>
      </div>
    </>
  );
};

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  if (date < 10) {
    date = "0" + date;
  }
  var hour = a.getHours();
  if (hour < 10) {
    hour = "0" + hour;
  }
  var min = a.getMinutes();
  if (min < 10) {
    min = "0" + min;
  }
  var sec = a.getSeconds();
  if (sec < 10) {
    sec = "0" + sec;
  }
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}

const Event = (props) => {
  let x = props.event;
  let data = [];
  let eventName = x.event
    .substring(1)
    .match(/[A-Z][a-z]+|[0-9]+/g)
    .join(" ");
  data.push(["Transaction Hash", x.transactionHash]);
  let ele2 = ["Time Stamp", timeConverter(x.returnValues.timeStamp)];
  data.push(ele2);
  let ele3 = ["From", x.returnValues.caller];
  data.push(ele3);
  if (x.returnValues.hasOwnProperty("receiver")) {
    data.push(["To", x.returnValues.receiver]);
  }

  if (x.returnValues.hasOwnProperty("price")) {
    data.push([
      "Price",
      web3.utils.fromWei(x.returnValues.price, "ether") + " eth",
    ]);
  }

  const [show, setShow] = useState(false);
  console.log(data);
  return (
    <div className="events">
      <h3
        style={{ marginBottom: 5 }}
        onClick={() => (show ? setShow(false) : setShow(true))}
      >
        {eventName}
      </h3>
      {show
        ? data.map((e) => (
            <div key={e[0]}>
              <b>{e[0]}:</b> {e[1]}
            </div>
          ))
        : ""}
    </div>
  );
};

const EventsComponent = (props) => {
  let events = props.details;
  console.log(events);
  return (
    <>
      <div>
        {events.map((e) => (
          <Event event={e} key={e.event} />
        ))}
      </div>
    </>
  );
};

export default (props) => {
  return (
    <div className="product-display">
      <div className="product-info">
        <ProductComponent details={props.details[0]} />
      </div>
      <div className="product-events">
        <EventsComponent details={props.details[1]} key={1} />
      </div>
    </div>
  );
};
