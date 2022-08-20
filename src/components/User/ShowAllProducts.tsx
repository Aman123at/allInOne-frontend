import React from "react";
import ProductCards from "./ProductCards";
interface Props {
  removeShowAll: Function;
  completeData: any;
  categoryName: string;
}
const ShowAllProducts = ({
  removeShowAll,
  completeData,
  categoryName,
}: Props) => {
  console.log("CompleteData", completeData);
  return (
    <div>
      <div className="flex items-center justify-start mt-2 ml-2">
        <div
          onClick={() => removeShowAll()}
          className="m-1 rounded-full shadow-md hover:cursor-pointer hover:scale-150 bg-gray-100 p-1 ml-12"
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
        <p className="lg:text-2xl xl:text-3xl md:text-2xl text-xl font-semibold ml-2">
          {categoryName}
        </p>
      </div>

      <div className="flex flex-row items-center flex-wrap justify-center">
        {completeData[0].product &&
          completeData[0].product.map((val: any) => (
            <ProductCards data={val} />
          ))}
      </div>
    </div>
  );
};

export default ShowAllProducts;
