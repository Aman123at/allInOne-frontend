import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getAllBulkAddData } from "../../slices/productSlice";

function BulkCard({ data, handleImagesAdd, handleRemoveImages }: any) {
  return (
    <div
      key={data.Name}
      className="m-2 p-2 border border-solid border-gray-300 shadow-lg rounded-lg"
    >
      <div className="m-1 flex items-center justify-center flex-wrap">
        {data.imagesForPreview.length > 0 &&
          data.imagesForPreview.map((image: any, i: number) => (
            // <img src={image} alt={i.toString()} key={i} />
            <div
              key={i}
              className="group relative m-2 overflow-hidden bg-no-repeat bg-cover max-w-xs"
              style={{ backgroundPosition: "50%" }}
            >
              <img src={image} className="max-w-xs" />
              <div
                className="hidden group-hover:block absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"
                style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
              >
                <div className="flex justify-center items-center h-full">
                  <button
                    type="button"
                    onClick={() => handleRemoveImages(i, data.Name)}
                    className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        <input
          type="file"
          hidden
          id={`uploadImage-${data.Name}`}
          onChange={(e: any) =>
            handleImagesAdd(
              e.target.files[0],
              data.Name,
              URL.createObjectURL(e.target.files[0])
            )
          }
        />
        <label
          htmlFor={`uploadImage-${data.Name}`}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Add Images"
          className="inline-block hover:cursor-pointer hover:opacity-80 rounded-full mx-2 my-2 bg-blue-600 text-white leading-normal uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-9 h-9"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mx-auto mt-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
        </label>
      </div>

      <div className="mx-1 my-4 ">
        <p className="text-center">
          <span className="text-md font-semibold ">Product Name </span>-{" "}
          {data.Name}
        </p>
        <p className="text-center">
          <span className="text-md font-semibold">Product Description </span>-{" "}
          {data.Description}
        </p>
        <br />
        <div className="flex items-center justify-around">
          <p>
            <span className="text-md font-semibold">Product Category </span>-{" "}
            {data.Category}
          </p>
          <p>
            <span className="text-md font-semibold">Product Sub-Category </span>
            - {data["Sub-Category"]}
          </p>
          <p>
            <span className="text-md font-semibold">Product Price </span>-{" "}
            {data.Price}
          </p>
          <p>
            <span className="text-md font-semibold">Product Units </span>-{" "}
            {data.Units}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BulkCard;
