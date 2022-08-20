import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getAllCategory,
  updateCategory,
  updateSubCategory,
} from "../../ApiCalls/categoryApis";
import { getAllCategories } from "../../slices/categorySlice";
import Chips from "../../utils/Chips";

function UpdateCategory() {
  const dispatch = useDispatch();
  const { status, data } = useSelector(getAllCategories);
  const [categoryEdit, setCategoryEdit] = useState<any>({
    catId: "",
    catName: "",
  });
  const [subCategoryEdit, setSubCategoryEdit] = useState<any>({
    subcatId: "",
    subcatName: "",
  });
  const [showEdit, setShowEdit] = useState<Boolean>(false);
  const [showSubEdit, setShowSubEdit] = useState<Boolean>(false);
  const handleEditSubCat = (subcat: any) => {
    console.log(subcat);
    setSubCategoryEdit({
      subcatId: subcat.id,
      subcatName: subcat.val,
    });
    setShowSubEdit(true);
  };
  const handleAddCategoryId = (id: any) => {
    setCategoryEdit({
      ...categoryEdit,
      catId: id,
    });
  };

  const updateMainCategory = () => {
    if (categoryEdit.catName) {
      updateCategory(categoryEdit.catId, { name: categoryEdit.catName })
        .then((r: any) => {
          dispatch(getAllCategory());
          toast.success("Category updated successfully.", {
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
          toast.error("Unable to update category. Plese try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } else {
      toast.error("Field is required.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setShowEdit(false);
    setCategoryEdit({ catId: "", catName: "" });
  };

  const updateSubCategories = () => {
    if (subCategoryEdit.subcatName) {
      updateSubCategory(categoryEdit.catId, {
        subcatId: subCategoryEdit.subcatId,
        name: subCategoryEdit.subcatName,
      })
        .then((r: any) => {
          dispatch(getAllCategory());
          toast.success("Sub-Category updated successfully.", {
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
          toast.error("Unable to delete sub-category. Plese try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } else {
      toast.error("Field is required.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    setShowSubEdit(false);
    setSubCategoryEdit({ subcatId: "", subcatName: "" });
  };

  return (
    <div>
      {showEdit ? (
        <div>
          <div className="flex items-center justify-center mx-2">
            <input
              type="text"
              value={categoryEdit.catName}
              onChange={(e: any) =>
                setCategoryEdit({
                  ...categoryEdit,
                  catName: e.target.value,
                })
              }
              className="form-control block w-1/2 px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder="Enter Category"
            />
          </div>
          <div className="flex items-center justify-between mx-20 mt-4">
            <button
              onClick={() => {
                setShowEdit(false);
                setCategoryEdit({ catId: "", catName: "" });
              }}
              type="button"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Close
            </button>
            <button
              onClick={updateMainCategory}
              type="button"
              className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Save
            </button>
          </div>
        </div>
      ) : showSubEdit ? (
        <div>
          <div className="flex items-center justify-center mx-2">
            <input
              type="text"
              value={subCategoryEdit.subcatName}
              onChange={(e: any) =>
                setSubCategoryEdit({
                  ...subCategoryEdit,
                  subcatName: e.target.value,
                })
              }
              className="form-control block w-1/2 px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder="Enter Sub-Category"
            />
          </div>
          <div className="flex items-center justify-between mx-20 mt-4">
            <button
              onClick={() => {
                setShowSubEdit(false);
                setSubCategoryEdit({ subcatId: "", subcatName: "" });
              }}
              type="button"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Close
            </button>
            <button
              onClick={updateSubCategories}
              type="button"
              className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Save
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
                    title={`Edit - ${data.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mt-4 text-black mx-2 my-1 hover:scale-110 hover:cursor-pointer transition
                  duration-150
                  ease-in-out"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      onClick={() => {
                        setCategoryEdit({
                          ...categoryEdit,
                          catId: data._id,
                          catName: data.name,
                        });
                        setShowEdit(true);
                      }}
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                  <div
                    key={key}
                    className="accordion-item bg-white border border-gray-200 flex-1"
                  >
                    <h2
                      className="accordion-header mb-0"
                      id={`heading-3${key}`}
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
                        data-bs-target={`#collapse-3${key}`}
                        aria-expanded="true"
                        aria-controls={`collapse-3${key}`}
                      >
                        {data.name} ({data.subCategories.length} sub-categories)
                      </button>
                    </h2>
                    <div
                      id={`collapse-3${key}`}
                      className="accordion-collapse collapse "
                      aria-labelledby={`heading-3${key}`}
                      data-bs-parent="#accordionExample2"
                    >
                      <div className="accordion-body py-4 px-5">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold my-1 text-xl">
                            Sub-Categories
                          </p>
                          {/* {subCategoriesToDelete.length != 0 && (
                            <button
                              type="button"
                              data-mdb-ripple="true"
                              data-mdb-ripple-color="light"
                              // onClick={() => {
                              //   setCategoryId(data._id);
                              //   setShowDel(true);
                              //   dispatch(setDeleteModal(true));
                              // }}
                              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                            >
                              Delete
                            </button>
                          )} */}
                        </div>
                        <div className="flex items-center flex-wrap">
                          {data.subCategories &&
                            data.subCategories.map(
                              (
                                val: { _id: String; name: string },
                                index: number
                              ) => (
                                <div className="mt-2 mx-2">
                                  <Chips
                                    text={{ val: val.name, id: val._id }}
                                    onClose={handleEditSubCat}
                                    forEdit={true}
                                    handleAddCategoryId={handleAddCategoryId}
                                    categoryId={data._id}
                                  />
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
}

export default UpdateCategory;
