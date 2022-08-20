import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../slices/categorySlice";

import { setDeleteModal } from "../../slices/commonSlice";
import {
  deleteCategory,
  deleteSubCategories,
  getAllCategory,
} from "../../ApiCalls/categoryApis";
import { toast } from "react-toastify";

const DeleteCategory = () => {
  const dispatch = useDispatch();
  const { status, data } = useSelector(getAllCategories);

  const [subCategoriesToDelete, setSubCategoriesToDelete] = useState<string[]>(
    []
  );
  const [showDel, setShowDel] = useState(false);
  const [showCategoryDel, setShowCategoryDel] = useState(false);

  const [categoryDelName, setCategoryDelName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");

  const handleDeleteSubCats = async () => {
    // to be added
    dispatch(setDeleteModal(false));

    deleteSubCategories({
      categoryId: categoryId,
      subCategories: subCategoriesToDelete,
    })
      .then(() => {
        dispatch(getAllCategory());
        toast.success("Sub-Categories deleted successfully.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((e: any) =>
        toast.error("Unable to delete sub-categories. Plese try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      );
    setSubCategoriesToDelete([]);

    setTimeout(() => {
      setShowDel(false);
    }, 100);
  };
  const handleDeleteCategory = async () => {
    // to be added
    dispatch(setDeleteModal(false));

    deleteCategory(categoryId)
      .then(() => {
        dispatch(getAllCategory());
        toast.success("Category deleted successfully.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((e: any) =>
        toast.error("Unable to delete category. Plese try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      );
    setTimeout(() => {
      setShowCategoryDel(false);
    }, 100);
    setSubCategoriesToDelete([]);
  };

  const handleChange = (e: any) => {
    if (e.target.checked) {
      setSubCategoriesToDelete([...subCategoriesToDelete, e.target.value]);
    } else {
      setSubCategoriesToDelete(
        subCategoriesToDelete.filter((val: any) => val !== e.target.value)
      );
    }
  };
  return (
    <div>
      {showDel ? (
        <div>
          <p className="mx-2  text-lg">Are you sure want to delete -</p>
          <span className="font-semibold text-lg mx-2">
            {subCategoriesToDelete.join(", ")}
          </span>
          <div className="flex items-center justify-between mt-5 mx-2">
            <button
              onClick={() => {
                setSubCategoriesToDelete([]);
                dispatch(setDeleteModal(false));
                setTimeout(() => {
                  setShowDel(false);
                }, 100);
              }}
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDeleteSubCats}
              data-bs-dismiss="modal"
              aria-label="Close"
              className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Confirm
            </button>
          </div>
        </div>
      ) : showCategoryDel ? (
        <div>
          <p className="mx-2  text-lg">Are you sure want to delete -</p>
          <span className="font-semibold text-lg mx-2">{categoryDelName}</span>
          <p className="text-lg italic ">
            <span className="text-lg italic text-red-500 font-bold">
              *Note{" "}
            </span>
            -
            {` Product and sub-categories assigned to ${categoryDelName} will be
            removed`}
            .
          </p>
          <div className="flex items-center justify-between mt-5 mx-2">
            <button
              onClick={() => {
                dispatch(setDeleteModal(false));
                setTimeout(() => {
                  setShowCategoryDel(false);
                }, 100);
              }}
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDeleteCategory}
              data-bs-dismiss="modal"
              aria-label="Close"
              className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Confirm
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="accordion mx-4 my-2" id="accordionExample2">
            {data.success &&
              data.category &&
              data.category.map((data: any, key: number) => (
                // <AdminShowCategory data={value} key={index} />
                <div className="flex items-start">
                  <div
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={`Delete - ${data.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-400 mx-2 my-1 hover:scale-110 hover:cursor-pointer transition
                    duration-150
                    ease-in-out"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                      onClick={() => {
                        setCategoryId(data._id);
                        setCategoryDelName(data.name);
                        setShowCategoryDel(true);
                        dispatch(setDeleteModal(true));
                      }}
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                  <div
                    key={key}
                    className="accordion-item bg-white border border-gray-200 flex-1"
                  >
                    <h2
                      className="accordion-header mb-0"
                      id={`heading-2${key}`}
                    >
                      <button
                        className="
  accordion-button
  relative
  flex
  items-center
  w-full
  py-4
  px-5
  text-base text-gray-800 text-left
  bg-white
  border-0
  rounded-none
  transition
  focus:outline-none
"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-2${key}`}
                        aria-expanded="true"
                        aria-controls={`collapse-2${key}`}
                      >
                        {data.name} ({data.subCategories.length} sub-categories)
                      </button>
                    </h2>
                    <div
                      id={`collapse-2${key}`}
                      className="accordion-collapse collapse "
                      aria-labelledby={`heading-2${key}`}
                      data-bs-parent="#accordionExample2"
                    >
                      <div className="accordion-body py-4 px-5">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold my-1 text-xl">
                            Sub-Categories
                          </p>
                          {subCategoriesToDelete.length != 0 && (
                            <button
                              type="button"
                              data-mdb-ripple="true"
                              data-mdb-ripple-color="light"
                              onClick={() => {
                                setCategoryId(data._id);
                                setShowDel(true);
                                dispatch(setDeleteModal(true));
                              }}
                              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          {data.subCategories &&
                            data.subCategories.map(
                              (
                                val: { _id: String; name: string },
                                index: number
                              ) => (
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    value={val.name}
                                    onChange={handleChange}
                                    className="hover:cursor-pointer"
                                  />
                                  <p className="ml-2">{val.name}</p>
                                </div>
                              )
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteCategory;
