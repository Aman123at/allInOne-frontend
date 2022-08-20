import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../slices/productSlice";

import ReactPaginate from "react-paginate";
import DropdownButton from "../../utils/DropdownButton";
import { getAllCategories } from "../../slices/categorySlice";
import { setDeleteModal, setLoader } from "../../slices/commonSlice";
import {
  deleteProduct,
  fetchProducts,
  removeProductImage,
  updateProduct,
} from "../../ApiCalls/productApis";
import { toast } from "react-toastify";
import { getCategoryList, getSubCategoryList } from "../../utils/utils";

interface IFilterBy {
  category: String;
  subcategory: String;
}

const UpdateProduct = () => {
  const { status, data } = useSelector(getAllProducts);
  const allCategories: any = useSelector(getAllCategories);

  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [filterBy, setFilterBy] = useState<IFilterBy>({
    category: "",
    subcategory: "",
  });

  const [filterProductName, setFilterProductName] = useState<string>("");
  const [showEdit, setShowEdit] = useState<Boolean>(false);
  const [editInside, setEditInside] = useState<any>({
    cat: false,
    subcat: false,
    price: false,
    unit: false,
  });

  const [itemOffset, setItemOffset] = useState(0);
  const [prodToDel, setProdToDel] = useState<any>(null);
  const [prodToDelMain, setProdToDelMain] = useState<any>(null);
  const [productEdit, setProductEdit] = useState({
    prodId: "",
    prodName: "",
    prodDesc: "",
  });
  const [productEditNext, setProductEditNext] = useState({
    prodCategory: "",
    prodSubCategory: "",
    prodPrice: 0,
    prodUnits: 0,
  });
  let itemsPerPage: any = 5;
  useEffect(() => {
    if (data && data.products) {
      const endOffset = itemOffset + itemsPerPage;

      setCurrentItems(
        filterBy.category && filterBy.subcategory
          ? data.products
              .filter((val: any) => val.category === filterBy.category)
              .filter((val: any) => val.subCategory === filterBy.subcategory)
              .slice(itemOffset, endOffset)
          : filterBy.category
          ? data.products
              .filter((val: any) => val.category === filterBy.category)

              .slice(itemOffset, endOffset)
          : filterBy.subcategory
          ? data.products

              .filter((val: any) => val.subCategory === filterBy.subcategory)
              .slice(itemOffset, endOffset)
          : filterProductName
          ? data.products
              .filter((val: any) =>
                val.name.toLowerCase().includes(filterProductName.toLowerCase())
              )
              .slice(itemOffset, endOffset)
          : data.products.slice(itemOffset, endOffset)
      );
      setPageCount(
        Math.ceil(
          filterBy.category && filterBy.subcategory
            ? data.products
                .filter((val: any) => val.category === filterBy.category)
                .filter((val: any) => val.subCategory === filterBy.subcategory)
                .length / itemsPerPage
            : filterBy.category
            ? data.products.filter(
                (val: any) => val.category === filterBy.category
              ).length / itemsPerPage
            : filterBy.subcategory
            ? data.products.filter(
                (val: any) => val.subCategory === filterBy.subcategory
              ).length / itemsPerPage
            : filterProductName
            ? data.products.filter((val: any) =>
                val.name.toLowerCase().includes(filterProductName.toLowerCase())
              ).length / itemsPerPage
            : data.products.length / itemsPerPage
        )
      );
    }
  }, [itemOffset, itemsPerPage, status, filterBy, filterProductName]);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % data.products.length;

    setItemOffset(newOffset);
  };

  // const getCategoryList = (item: any) => {
  //   let lists: any = item.map((val: any) => val.name);
  //   return lists;
  // };

  // const getSubCategoryList = (item: any) => {
  //   let lists: any = [];
  //   let allsubcats: any = item.map((val: any) => val.subCategories);

  //   allsubcats.map((values: any) => {
  //     values.map((subcat: any) => {
  //       lists.push(subcat.name);
  //     });
  //   });

  //   return lists;
  // };
  const getSubCategoryListNew = (item: any, cats: any) => {
    let lists: any = [];
    let allsubcats: any = item.filter((val: any) => val.name === cats);

    allsubcats[0].subCategories.map((values: any) => {
      lists.push(values.name);
    });

    return lists;
  };

  const handleClickCategory = (name: any) => {
    setFilterBy({
      ...filterBy,
      category: name,
    });
  };
  const handleClickSubCategory = (name: any) => {
    setFilterBy({
      ...filterBy,
      subcategory: name,
    });
  };
  const dispatch = useDispatch();

  const handleDeleteProduct = () => {
    console.log(prodToDelMain);
    dispatch(setLoader(true));
    dispatch(setDeleteModal(false));
    deleteProduct(prodToDelMain._id)
      .then((result: any) => {
        dispatch(setLoader(false));
        setProdToDelMain(null);
        dispatch(fetchProducts());
        toast.success("Product deleted successfully.", {
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
        setProdToDelMain(null);
        toast.error("Unable to deleted successfully.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    setTimeout(() => {
      setShowEdit(false);
      setProdToDel(null);
    }, 100);
  };

  const handleRemoveImages = async (img: any, productId: any) => {
    dispatch(setLoader(true));
    removeProductImage(productId, { images: [img.id] })
      .then(() => {
        dispatch(fetchProducts());
        dispatch(setLoader(false));
        toast.success("Image deleted successfully.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch(() => {
        dispatch(setLoader(false));
        toast.error("Unable to delete image.", {
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

  const handleUpdateMain = async (productId: any) => {
    dispatch(setLoader(true));
    let actualData: any = {};

    if (productEdit.prodName !== "") {
      actualData["name"] = productEdit.prodName;
    }
    if (productEdit.prodDesc !== "") {
      actualData["description"] = productEdit.prodDesc;
    }
    if (productEditNext.prodCategory !== "") {
      actualData["category"] = productEditNext.prodCategory;
    }
    if (productEditNext.prodSubCategory !== "") {
      actualData["subCategory"] = productEditNext.prodSubCategory;
    }
    if (productEditNext.prodPrice > 0) {
      actualData["price"] = productEditNext.prodPrice;
    }
    if (productEditNext.prodUnits > 0) {
      actualData["units"] = productEditNext.prodUnits;
    }
    updateProduct(productId, actualData)
      .then(() => {
        dispatch(fetchProducts());
        dispatch(setLoader(false));
        toast.success("Product updated successfully.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch(() => {
        dispatch(setLoader(false));
        toast.error("Unable to update product.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

    setEditInside({
      unit: false,
      cat: false,
      subcat: false,
      price: false,
    });

    setProductEditNext({
      prodCategory: "",
      prodSubCategory: "",
      prodPrice: 0,
      prodUnits: 0,
    });
  };
  return (
    <div>
      {showEdit ? (
        <div>
          <div className="flex items-center justify-center mx-2">
            <input
              type="text"
              value={productEdit.prodName}
              onChange={(e: any) =>
                setProductEdit({
                  ...productEdit,
                  prodName: e.target.value,
                })
              }
              className="form-control block w-1/2 px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder="Enter Product Name"
            />
          </div>
          <div className="flex items-center justify-center mx-2 mt-4">
            <textarea
              value={productEdit.prodDesc}
              onChange={(e: any) =>
                setProductEdit({
                  ...productEdit,
                  prodDesc: e.target.value,
                })
              }
              className="form-control block w-1/2 px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder="Enter Product Description"
            />
          </div>
          <div className="flex items-center justify-between mx-20 mt-4">
            <button
              onClick={() => {
                setShowEdit(false);
                setProductEdit({ prodId: "", prodName: "", prodDesc: "" });
              }}
              type="button"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleUpdateMain(productEdit.prodId);
                setShowEdit(false);
              }}
              type="button"
              className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="my-4 flex justify-end mr-4">
            {filterBy.category === "" && filterBy.subcategory === "" && (
              <div className="xl:w-80">
                <input
                  type="search"
                  disabled={
                    filterBy.category !== "" || filterBy.subcategory !== ""
                  }
                  className={`form-control ${
                    (filterBy.category || filterBy.subcategory) &&
                    "hover:cursor-not-allowed"
                  } block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none `}
                  id="exampleSearch"
                  placeholder="Search by product name"
                  value={filterProductName}
                  onChange={(e: any) => setFilterProductName(e.target.value)}
                />
              </div>
            )}
            <button
              type="button"
              onClick={() =>
                setFilterBy({
                  category: "",
                  subcategory: "",
                })
              }
              className="flex items-center  px-4 py-2.5 mx-2 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1 mb-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              Remove Filter
            </button>
            <DropdownButton
              text="Category"
              data={
                allCategories.status === "finished"
                  ? getCategoryList(allCategories.data.category)
                  : []
              }
              onMenuClick={handleClickCategory}
            />
            <DropdownButton
              text="Sub-Category"
              data={
                allCategories.status === "finished"
                  ? getSubCategoryList(allCategories.data.category)
                  : []
              }
              onMenuClick={handleClickSubCategory}
            />
          </div>
          <div className="accordion mx-4 my-2" id="accordionExample">
            {data &&
              data.products &&
              currentItems.map((prod: any, key: number) => (
                <div className="flex ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mt-4 text-black mx-2 my-1 hover:scale-110 hover:cursor-pointer transition
                  duration-150
                  ease-in-out"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    onClick={() => {
                      setProductEdit({
                        ...productEdit,
                        prodId: prod._id,
                        prodName: prod.name,
                        prodDesc: prod.description,
                      });
                      setShowEdit(true);
                    }}
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <div
                    key={key}
                    className="accordion-item bg-white border border-gray-200 flex-1"
                  >
                    <h2
                      className="accordion-header mb-0"
                      id={`heading-5${key}`}
                    >
                      <button
                        className="accordion-button  relative  flex  items-center  w-full  py-4  px-5  text-base text-gray-800 text-left  bg-white  border-0  rounded-none  transition  focus:outline-none  "
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-5${key}`}
                        aria-expanded="true"
                        aria-controls={`collapse-5${key}`}
                      >
                        {prod.name}
                      </button>
                    </h2>
                    <div
                      id={`collapse-5${key}`}
                      className="accordion-collapse collapse "
                      aria-labelledby={`heading-5${key}`}
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body py-4 px-5">
                        <p className="font-semibold my-1 text-xl">
                          {prod.name}
                        </p>
                        <div className="flex flex-wrap items-center">
                          {prod.description}
                        </div>

                        <div className="mt-2 flex items-center flex-wrap">
                          {prod.images &&
                            prod.images.map((val: any, index: number) => (
                              <div
                                key={index}
                                className="group relative m-2 overflow-hidden bg-no-repeat bg-cover max-w-xs"
                                style={{ backgroundPosition: "50%" }}
                              >
                                <img
                                  src={val.secure_url}
                                  className="max-w-xs"
                                />
                                <div
                                  className="hidden group-hover:block absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"
                                  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                                >
                                  <div className="flex justify-center items-center h-full">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveImages(val, prod._id)
                                      }
                                      className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          <div>
                            <button
                              type="button"
                              className="inline-block rounded-full bg-blue-600 text-white leading-normal uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-9 h-9"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className=" mx-auto h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center justify-evenly">
                          {editInside.cat ? (
                            <div className="flex items-center w-96 ">
                              <select
                                onChange={(e: any) =>
                                  setProductEditNext({
                                    ...productEditNext,
                                    prodCategory: e.target.value,
                                  })
                                }
                                className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                aria-label="Default select example"
                              >
                                <option
                                  selected
                                  value={productEditNext.prodCategory}
                                >
                                  {productEditNext.prodCategory}
                                </option>
                                {getCategoryList(
                                  allCategories.data.category
                                ).map((val: any, i: number) => (
                                  <option key={i} value={val}>
                                    {val}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <>
                              {!editInside.cat &&
                                !editInside.subcat &&
                                !editInside.price &&
                                !editInside.unit && (
                                  <p className="font-bold flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 mx-1 hover:cursor-pointer hover:scale-110"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      onClick={() => {
                                        setProductEditNext({
                                          ...productEditNext,
                                          prodCategory: prod.category,
                                        });
                                        setEditInside({
                                          ...editInside,
                                          unit: false,
                                          cat: true,
                                          subcat: false,
                                          price: false,
                                        });
                                      }}
                                    >
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Category -{" "}
                                    <span className="font-medium">
                                      {prod.category}
                                    </span>
                                  </p>
                                )}
                            </>
                          )}
                          {editInside.subcat ? (
                            <div className="flex items-center w-96 ">
                              <select
                                onChange={(e: any) =>
                                  setProductEditNext({
                                    ...productEditNext,
                                    prodSubCategory: e.target.value,
                                  })
                                }
                                className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                aria-label="Default select example"
                              >
                                <option
                                  selected
                                  value={productEditNext.prodSubCategory}
                                >
                                  {productEditNext.prodSubCategory}
                                </option>
                                {getSubCategoryListNew(
                                  allCategories.data.category,
                                  prod.category
                                ).map((val: any, i: number) => (
                                  <option key={i} value={val}>
                                    {val}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <>
                              {!editInside.cat &&
                                !editInside.subcat &&
                                !editInside.price &&
                                !editInside.unit && (
                                  <p className="font-bold flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 mx-1 hover:cursor-pointer hover:scale-110"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      onClick={() => {
                                        setProductEditNext({
                                          ...productEditNext,
                                          prodSubCategory: prod.subCategory,
                                        });
                                        setEditInside({
                                          ...editInside,
                                          unit: false,
                                          cat: false,
                                          subcat: true,
                                          price: false,
                                        });
                                      }}
                                    >
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Sub-Category -{" "}
                                    <span className="font-medium">
                                      {prod.subCategory}
                                    </span>
                                  </p>
                                )}
                            </>
                          )}
                          {editInside.price ? (
                            <div className="flex items-center">
                              <input
                                type="number"
                                placeholder="Enter Price"
                                className="w-32 px-3 py-1 border border-gray-400 rounded outline-0"
                                value={productEditNext.prodPrice}
                                onChange={(e: any) =>
                                  setProductEditNext({
                                    ...productEditNext,
                                    prodPrice: e.target.value,
                                  })
                                }
                              />
                            </div>
                          ) : (
                            <>
                              {!editInside.cat &&
                                !editInside.subcat &&
                                !editInside.price &&
                                !editInside.unit && (
                                  <p className="font-bold flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 mx-1 hover:cursor-pointer hover:scale-110"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      onClick={() => {
                                        setProductEditNext({
                                          ...productEditNext,
                                          prodPrice: prod.price,
                                        });
                                        setEditInside({
                                          ...editInside,
                                          unit: false,
                                          cat: false,
                                          subcat: false,
                                          price: true,
                                        });
                                      }}
                                    >
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Price -{" "}
                                    <span className="font-medium">
                                      {prod.price}
                                    </span>
                                  </p>
                                )}
                            </>
                          )}
                          {editInside.unit ? (
                            <div className="flex items-center">
                              <input
                                type="number"
                                placeholder="Enter Units"
                                className="w-32 px-3 py-1 border border-gray-400 rounded outline-0"
                                value={productEditNext.prodUnits}
                                onChange={(e: any) =>
                                  setProductEditNext({
                                    ...productEditNext,
                                    prodUnits: e.target.value,
                                  })
                                }
                              />
                            </div>
                          ) : (
                            <>
                              {!editInside.cat &&
                                !editInside.subcat &&
                                !editInside.price &&
                                !editInside.unit && (
                                  <p className="font-bold flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 mx-1 hover:cursor-pointer hover:scale-110"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      onClick={() => {
                                        setProductEditNext({
                                          ...productEditNext,
                                          prodUnits: prod.units,
                                        });
                                        setEditInside({
                                          ...editInside,
                                          unit: true,
                                          cat: false,
                                          subcat: false,
                                          price: false,
                                        });
                                      }}
                                    >
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Units -{" "}
                                    <span className="font-medium">
                                      {prod.units}
                                    </span>
                                  </p>
                                )}
                            </>
                          )}
                        </div>
                        {(editInside.cat ||
                          editInside.subcat ||
                          editInside.price ||
                          editInside.unit) && (
                          <div className="mt-2 flex items-center justify-center">
                            <button
                              type="button"
                              data-mdb-ripple="true"
                              data-mdb-ripple-color="light"
                              onClick={() => {
                                setEditInside({
                                  unit: false,
                                  cat: false,
                                  subcat: false,
                                  price: false,
                                });
                                setProductEditNext({
                                  prodCategory: "",
                                  prodSubCategory: "",
                                  prodPrice: 0,
                                  prodUnits: 0,
                                });
                              }}
                              className="inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out"
                            >
                              Cancle
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateMain(prod._id)}
                              data-mdb-ripple="true"
                              data-mdb-ripple-color="light"
                              className="inline-block px-6 ml-4 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                            >
                              Save
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <ReactPaginate
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            previousLabel="< previous"
            pageClassName="flex justify-center m-2"
            pageLinkClassName="flex"
            previousClassName="flex m-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-300"
            previousLinkClassName="flex"
            nextClassName="flex m-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-300"
            nextLinkClassName="flex"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="flex justify-center items-center"
            activeClassName="p-2 rounded-full bg-yellow-400"
          />
        </div>
      )}
    </div>
  );
};

export default UpdateProduct;
