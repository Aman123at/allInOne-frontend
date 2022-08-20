import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../slices/categorySlice";
import { FileDrop } from "react-file-drop";

import "../../styles/FileDrop.css";
import { addProduct, fetchProducts } from "../../ApiCalls/productApis";
import { toast } from "react-toastify";
import { setLoader } from "../../slices/commonSlice";

function AddProduct() {
  const dispatch = useDispatch();
  const fileInputRef: any = useRef(null);
  const [radioStatus, setRadioStatus] = useState({
    showFile: true,
    showDnd: false,
  });

  const [uploadFiles, setUploadFiles] = useState<any>([]);

  const onFileDrop = (files: any, event: any) => {
    if (files.length === 1) {
      setUploadFiles([files[0]]);
    }
    if (files.length > 1) {
      let filearr: any = [];
      for (let index = 0; index < files.length; index++) {
        filearr.push(files[index]);
      }
      setUploadFiles(filearr);
    }
  };

  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    units: 0,
    price: 0,
    category: "",
    subCategory: "",
  });
  const { status, data } = useSelector(getAllCategories);
  const handleAdd = async () => {
    dispatch(setLoader(true));
    let formData: any = new FormData();
    if (
      !productDetails.name ||
      !productDetails.description ||
      !productDetails.units ||
      !productDetails.price ||
      !productDetails.category ||
      !productDetails.subCategory ||
      uploadFiles.length === 0
    ) {
      dispatch(setLoader(false));
      toast.error("All Fields are required.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      formData.append("name", productDetails.name);
      formData.append("description", productDetails.description);
      formData.append("units", productDetails.units);
      formData.append("price", productDetails.price);
      formData.append("category", productDetails.category);
      formData.append("subCategory", productDetails.subCategory);
      uploadFiles.map((file: any) => formData.append("images", file));

      addProduct(formData)
        .then((response: any) => {
          dispatch(fetchProducts());
          dispatch(setLoader(false));
          setProductDetails({
            name: "",
            description: "",
            units: 0,
            price: 0,
            category: "",
            subCategory: "",
          });
          setUploadFiles([]);
          toast.success("Product added successfully.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch((e: any) => {
          dispatch(setLoader(false));
          toast.error("Error while adding product. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  };
  return (
    <div>
      <div className="flex justify-center">
        <div className="mb-3 xl:w-96">
          <input
            type="text"
            value={productDetails.name}
            onChange={(e: any) =>
              setProductDetails({
                ...productDetails,
                name: e.target.value,
              })
            }
            className="
      form-control
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
    "
            placeholder="Enter Product Name"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="mb-3 xl:w-96">
          <textarea
            value={productDetails.description}
            onChange={(e: any) =>
              setProductDetails({
                ...productDetails,
                description: e.target.value,
              })
            }
            className="
      form-control
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
    "
            placeholder="Enter Product Description"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="mb-3 xl:w-96">
          <select
            onChange={(e: any) =>
              setProductDetails({
                ...productDetails,
                category: e.target.value,
              })
            }
            className="
      form-control
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
    "
          >
            <option disabled selected className="text-gray-700">
              Select Category
            </option>
            {data.category &&
              data.category.map((val: any, i: number) => (
                <option value={val.name} key={i} className="text-gray-700">
                  {val.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="mb-3 xl:w-96">
          <select
            onChange={(e: any) =>
              setProductDetails({
                ...productDetails,
                subCategory: e.target.value,
              })
            }
            disabled={!productDetails.category}
            className="
      form-control
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
    "
          >
            <option disabled selected className="text-gray-700">
              Select Sub-Category
            </option>
            {data.category &&
              data.category
                .filter((item: any) => item.name === productDetails.category)[0]
                ?.subCategories.map((values: any, ind: number) => (
                  <option
                    value={values.name}
                    key={ind}
                    className="text-gray-700"
                  >
                    {values.name}
                  </option>
                ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="mb-3 xl:w-96">
          <input
            type="number"
            value={productDetails.price}
            onChange={(e: any) =>
              setProductDetails({
                ...productDetails,
                price: e.target.value,
              })
            }
            className="
      form-control
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
    "
            placeholder="Enter Price"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="mb-3 xl:w-96">
          <input
            type="number"
            value={productDetails.units}
            onChange={(e: any) =>
              setProductDetails({
                ...productDetails,
                units: e.target.value,
              })
            }
            className="
      form-control
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
    "
            placeholder="Enter Units"
          />
        </div>
      </div>

      <div className="flex justify-center mb-3">
        <div className="form-check form-check-inline">
          <input
            className=" form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio1"
            value="file"
            checked={radioStatus.showFile}
            onChange={(e: any) =>
              setRadioStatus({
                showDnd: false,
                showFile: true,
              })
            }
          />
          <label
            className="form-check-label inline-block text-gray-800"
            htmlFor="inlineRadio10"
          >
            Choose Files
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className=" form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio2"
            value="dnd"
            checked={radioStatus.showDnd}
            onChange={(e: any) =>
              setRadioStatus({
                showDnd: true,
                showFile: false,
              })
            }
          />
          <label
            className="form-check-label inline-block text-gray-800"
            htmlFor="inlineRadio20"
          >
            Drag and Drop
          </label>
        </div>
      </div>

      {radioStatus.showFile && (
        <div className="flex justify-center">
          <input
            type="file"
            multiple
            className="mb-3"
            onChange={(e: any) => {
              let filearr: any = [];
              if (e.target.files.length === 1) {
                setUploadFiles([e.target.files[0]]);
              }
              if (e.target.files.length > 1) {
                for (let index = 0; index < e.target.files.length; index++) {
                  filearr.push(e.target.files[index]);
                }

                setUploadFiles(filearr);
              }
            }}
          />
        </div>
      )}

      {radioStatus.showDnd && (
        <div className="flex justify-center ">
          <input ref={fileInputRef} type="file" className="hidden" />
          <FileDrop
            onDrop={onFileDrop}
            onDragOver={(e: any) => e.target.classList.add("bg-red-500")}
            className="p-5 w-96 bg-gray-300 border border-dashed border-black text-center"
          >
            Drop here
          </FileDrop>
        </div>
      )}
      <div className="flex space-x-2 mt-2 justify-center">
        <button
          onClick={handleAdd}
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          data-bs-dismiss="modal"
          aria-label="Close"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Add Product
        </button>
      </div>
    </div>
  );
}

export default AddProduct;
