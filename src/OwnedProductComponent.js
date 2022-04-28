import React, { useState } from "react";
import Carousel from "react-simply-carousel";

export default (props) => {
  console.log(props.owned.length);
  let active = props.owned.length < 5 ? props.owned.length : 5;
  const [activeSlide, setActiveSlide] = useState(active);

  return (
    <div>
      <Carousel
        updateOnItemClick
        containerProps={{
          style: {
            width: "100%",
            justifyContent: "space-between",
          },
        }}
        activeSlideIndex={activeSlide}
        activeSlideProps={{
          style: {
            background: "white",
          },
        }}
        onRequestChange={setActiveSlide}
        forwardBtnProps={{
          children: ">",
          style: {
            width: 30,
            minWidth: 30,
            alignSelf: "center",
          },
        }}
        backwardBtnProps={{
          children: "<",
          style: {
            width: 30,
            minWidth: 30,
            alignSelf: "center",
          },
        }}
        itemsToShow={4}
        speed={400}
      >
        {props.owned.map((product) => (
          <div key={product[0]} className="owned-product-card">
            <b>UIN: </b>
            {product[0]}
            <br></br>
            <b>Product Name:</b>
            <br></br>
            {product[1]}
          </div>
        ))}
      </Carousel>
    </div>
  );
};
