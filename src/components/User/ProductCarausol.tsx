import React, { useEffect, useState } from "react";
import ProductCards from "./ProductCards";

const ProductCarausol = (props: any) => {
  function slide(direction: String, category: String) {
    var container: any = document.getElementById(`container--${category}`);
    let scrollCompleted = 0;
    var slideVar = setInterval(function () {
      if (direction == "left") {
        container.scrollLeft -= 10;
      } else {
        container.scrollLeft += 10;
      }
      scrollCompleted += 10;
      if (scrollCompleted >= 100) {
        window.clearInterval(slideVar);
      }
    }, 50);
  }
  // let data = ["aaa1", "aaa2", "aaa3", "aaa4", "aaa5", "aaa6", "aaa7", "aaa8", "aaa9", "aaa10", "aaa11", "aaa12", "aaa13", "aaa14", "aaa15"]
  return (
    <div className="flex items-center justify-center mt-2">
      <div
        onClick={() => slide("left", props.data.category)}
        className="m-1 rounded-full shadow-md hover:cursor-pointer hover:scale-150 bg-gray-100 p-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </div>

      <div
        id={`container--${props.data.category}`}
        className="flex w-full flex-row overflow-hidden"
      >
        {props.data.product.map((val: any) => (
          <ProductCards data={val} />
        ))}
      </div>

      <div
        onClick={() => slide("right", props.data.category)}
        className="ml-3 rounded-full shadow-md hover:cursor-pointer hover:scale-150 bg-gray-100 p-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
    </div>
  );
};

export default ProductCarausol;
