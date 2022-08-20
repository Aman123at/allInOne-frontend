import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addProduct, fetchProducts } from "../../ApiCalls/productApis";
import { setLoader } from "../../slices/commonSlice";
import {
  getAllBulkAddData,
  removeImages,
  setBulkAddData,
  updateBulkAddData,
} from "../../slices/productSlice";
import BulkCard from "./BulkCard";

const BulkList = () => {
  const dispatch = useDispatch();
  const allBulkData = useSelector(getAllBulkAddData);

  const handleImagesAdd = (file: any, productName: any, preview: any) => {
    dispatch(
      updateBulkAddData({
        file,
        productName,
        preview,
      })
    );
  };
  const handleRemoveImages = (index: number, productName: any) => {
    dispatch(
      removeImages({
        index,
        productName,
      })
    );
  };

  const disableSaveButton = () => {
    let blanckImages = allBulkData.filter(
      (val: any) => val.images.length === 0
    );
    console.log("BlanckImages", blanckImages);
    if (blanckImages.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const createPayloadData = (allProd: any) => {
    let datatoret: any = [];
    allProd.map((values: any) => {
      let formData = new FormData();

      formData.append("name", values.Name);
      formData.append("description", values.Description);
      formData.append("category", values.Category);
      formData.append("subCategory", values["Sub-Category"]);
      formData.append("units", values.Units);
      formData.append("price", values.Price);
      values.images.map((val: any) => formData.append("images", val));

      datatoret.push(formData);
    });

    return datatoret;
  };

  const handleBulkAdd = async () => {
    let promiseArray: any = [];
    dispatch(setLoader(true));
    let payloadData: any = createPayloadData(allBulkData);
    payloadData.map((val: any) => {
      let dta: any = addProduct(val);
      promiseArray.push(dta);
    });
    console.log(payloadData);
    Promise.all(promiseArray)
      .then((result: any) => {
        dispatch(setLoader(false));
        dispatch(fetchProducts());
        toast.success("Products added successfully.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error: any) => {
        console.log("errors", error);
        dispatch(setLoader(false));
        toast.error("Something went wrong. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
    <div>
      <div className="flex items-center justify-between m-2">
        <p className="font-semibold text-md italic">
          Atleast one picture is required for individual product.
        </p>
        <button
          type="button"
          data-bs-dismiss="modal"
          data-bs-toggle="modal"
          disabled={disableSaveButton()}
          onClick={handleBulkAdd}
          className={` ${
            disableSaveButton() && "opacity-30 cursor-not-allowed"
          } inline-block px-6 py-2.5 bg-purple-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-lg hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out`}
        >
          Save
        </button>
      </div>
      {allBulkData && allBulkData.length > 0 ? (
        allBulkData.map((values: any) => (
          <BulkCard
            data={values}
            handleImagesAdd={handleImagesAdd}
            handleRemoveImages={handleRemoveImages}
          />
        ))
      ) : (
        <p>No data in file.</p>
      )}
    </div>
  );
};

export default BulkList;
