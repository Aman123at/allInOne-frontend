import React from "react";
import { useNavigate } from "react-router-dom";
import { truncate } from "../../utils/utils";
import "./ProductCard.css";
const ProductCards = ({ data }: any) => {
  console.log("Data", data);
  const navigate = useNavigate();
  return (
    <div className="flex justify-center m-3 ">
      <div className="rounded-lg shadow-lg bg-white max-w-sm fixedWidth flex flex-col">
        <a href="#!" className="flex flex-1 justify-center">
          <img
            className="rounded-t-lg  myimg"
            src={data.images[0].secure_url}
            alt=""
          />
        </a>
        <div className="lg:p-6 md:p-4 p-3">
          <span className="text-gray-900 text-xl font-bold mb-2">
            Rs. {data.price}
          </span>
          <h5 className="text-gray-900 text-xl font-medium mb-2">
            {truncate(data.name, 50)}
          </h5>
          <p className="text-gray-700 text-base lg:mb-4 md:mb-4 hidden md:block lg:block xl:block 2xl:block mb-2">
            {truncate(data.description, 100)}
          </p>
          <button
            type="button"
            onClick={() => navigate(`/product/${data._id}`)}
            className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCards;
