import React, { useState } from "react";
import ProductCarausol from "./ProductCarausol";
interface IProps {
  data: any;
  handleShowAll: Function;
}
const ProductWithCategory = (props: IProps) => {
  return (
    <div className="xl:p-4 lg:p-4 md:p-3 p-2 xl:my-3 lg:my-3 md:my-3 my-2">
      <div className="flex items-center justify-between">
        <p className="lg:text-3xl xl:text-3xl md:text-2xl text-xl font-semibold ml-12 ">
          {props.data.category}
        </p>
        <a
          href="#top"
          onClick={() => props.handleShowAll(props.data.category)}
          className="text-white bg-blue-400 p-2 rounded text-sm hover:cursor-pointer mr-11 "
        >
          Show All
        </a>
      </div>
      <ProductCarausol data={props.data} />
    </div>
  );
};

export default ProductWithCategory;
