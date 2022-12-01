import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { read, utils } from "xlsx";
import { getAllCategories } from "../../slices/categorySlice";

import {
  exportAsExcelFile,
  transform,
} from "../../utils/downloadExcelTemplate.js";
import {
  getCategoryList,
  getSubCategoryList,
  getSubCategoryListByPassingCategory,
} from "../../utils/utils";

import BulkList from "./BulkList";

import { getAllProducts, setBulkAddData } from "../../slices/productSlice";

const AddProductInBulk = () => {
  const [hideUpload, setHideUpload] = useState<Boolean>(false);
  const dispatch = useDispatch();
  const { status, data } = useSelector(getAllCategories);
  const allProducts: any = useSelector(getAllProducts);
  const [excelData, setExcelData] = useState<any>([]);
  const dataInCorrectFormat = (lists: any) => {
    let toret: any = [];
    lists.map((val: any) => {
      toret.push({
        name: val,
      });
    });

    return toret;
  };
  useEffect(() => {
    if (status === "finished") {
      setExcelData([
        {
          name: "products",
          values: [
            {
              header: "Name",
              value: "",
            },
            {
              header: "Description",
              value: "",
            },
            {
              header: "Category",
              value: dataInCorrectFormat(getCategoryList(data.category)),
            },

            {
              header: "Sub-Category",
              value: dataInCorrectFormat(getSubCategoryList(data.category)),
            },
            {
              header: "Price",
              value: "",
            },
            {
              header: "Units",
              value: "",
            },
          ],
        },
      ]);
    }
  }, [status]);

  const [error, setError] = useState<any>({
    errorName: "",
    notAllowedCategories: [],
    notMatches: [],
    duplicateNames: [],
  });

  const isSubCategoryMatches = (newdata: any) => {
    let notmatchesList: any = [];
    let categoryNotAllowed: any = [];
    let allCategoryList: any = getCategoryList(data.category);
    newdata.map((values: any) => {
      // if catgory is other than db
      if (!allCategoryList.includes(values["Category"])) {
        categoryNotAllowed.push(values);
      }

      // checking if category and subcategory are relavent or not
      let foundCat: any = data.category.filter(
        (val: any) => val.name === values["Category"]
      );
      if (foundCat && foundCat.length) {
        let subcats: any = getSubCategoryListByPassingCategory(
          foundCat[0].name,
          data.category
        );
        if (!subcats.includes(values["Sub-Category"])) {
          notmatchesList.push(values);
        }
      }
    });

    if (notmatchesList.length === 0 && categoryNotAllowed.length === 0) {
      return true;
    } else {
      if (notmatchesList.length > 0) {
        setError({
          ...error,
          errorName: "match",
          notMatches: notmatchesList,
        });
        toast.error("Category and sub-category not matches.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      if (categoryNotAllowed.length > 0) {
        setError({
          ...error,
          errorName: "allow",
          notAllowedCategories: categoryNotAllowed,
        });
        toast.error("Category name is not allowed.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      return false;
    }
  };

  const [showErrorPage, setShowErrorPage] = useState<Boolean>(false);

  const [loopComplete, setLoopComplete] = useState<Boolean>(false);
  const [afterFilter, setAfterFilter] = useState<any>([]);
  const handleMatch = (data: any) => {
    if (!showErrorPage && loopComplete) {
      let matches: any = isSubCategoryMatches(data);
      if (!matches) {
        setShowErrorPage(true);
      }
    }
  };
  const isContainDuplicate = (items: any) => {
    let duplist = items.filter(
      (item: any, index: any) => items.indexOf(item) !== index
    );
    return duplist;
  };
  useEffect(() => {
    // if category not allowed or subcatgory not matches
    if (afterFilter.length) {
      handleMatch(afterFilter);
    }
  }, [loopComplete, showErrorPage]);
  const handleUploadFile = (eve: any) => {
    eve.preventDefault();

    if (eve.target.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const dataFile = e.target.result;
        const workbook = read(dataFile, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any = utils.sheet_to_json(worksheet);
        let actualkeysarr: any = [
          "Name",
          "Description",
          "Category",
          "Sub-Category",
          "Price",
          "Units",
        ];

        if (
          JSON.stringify(Object.keys(json[0])) === JSON.stringify(actualkeysarr)
        ) {
          let newdata = json.filter(
            (val: any) =>
              val.Name !== "" &&
              val.Description !== "" &&
              val.Category !== "" &&
              val["Sub-Category"] !== "" &&
              val.Price !== "" &&
              val.Units !== ""
          );
          let actualData: any = newdata.map((val: any) => {
            return {
              ...val,
              images: [],
              imagesForPreview: [],
            };
          });
          dispatch(setBulkAddData(actualData));

          setAfterFilter(newdata);

          // showing error for missing fields
          for (let index = 0; index < newdata.length; index++) {
            if (index === newdata.length - 1) {
              setLoopComplete(true);
            }
            if (
              !newdata[index]["Name"] ||
              !newdata[index]["Description"] ||
              !newdata[index]["Category"] ||
              !newdata[index]["Sub-Category"] ||
              !newdata[index]["Price"] ||
              !newdata[index]["Units"]
            ) {
              setShowErrorPage(true);
              setError({
                ...error,
                errorName: "All Fields required.",
              });
              toast.error("All Fields required.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });

              setLoopComplete(true);
              break;
            }
          }

          // handle duplicate names from excel
          let allNames: any = newdata.map((val: any) => val.Name);
          if (isContainDuplicate(allNames).length > 0) {
            setShowErrorPage(true);
            setError({
              ...error,
              errorName: "dup",
              duplicateNames: isContainDuplicate(allNames),
            });
            toast.error("Duplicate product name found in file.", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }

          // handle duplicate names from db's
          let allProductsList: any =
            allProducts.data.products &&
            allProducts.data.products.map((val: any) => val.name);
          let duplicatesFromDB: any = [];
          newdata.map((value: any) => {
            if (allProductsList.includes(value.Name)) {
              // product name is alredy exists in db
              duplicatesFromDB.push(value.Name);
            }
          });
          if (duplicatesFromDB.length > 0) {
            setError({
              ...error,
              errorName: "dup-db",
              duplicateNames: duplicatesFromDB,
            });
            setShowErrorPage(true);
            toast.error("Product name already exits in database.", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        } else {
          setShowErrorPage(true);
          setError({
            ...error,
            errorName: "Data is not in correct format.",
          });
          toast.error("Data is not in correct format.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          return;
        }
      };
      reader.readAsArrayBuffer(eve.target.files[0]);
    }
    setHideUpload(true);
  };

  const afterFilterInCorrectFormat = (dta: any) => {
    let retdata: any = [];
    dta.map((val: any) => {
      retdata.push({
        ...val,
        images: [],
      });
    });

    return retdata;
  };

  return (
    <div>
      {hideUpload ? (
        <div>
          {showErrorPage ? (
            <div>
              {error.errorName === "allow" ? (
                <div>
                  {error.notAllowedCategories &&
                    error.notAllowedCategories.map((cat: any) => (
                      <div>
                        <p>
                          Category{" "}
                          <span className="text-lg font-semibold italic">
                            {cat.Category}{" "}
                          </span>{" "}
                          is not present in database.{" "}
                        </p>
                        <p className="text-lg font-bold">
                          Choose a valid Category from dropdown list in sheet.
                        </p>
                      </div>
                    ))}
                </div>
              ) : error.errorName === "match" ? (
                <div>
                  {error.notMatches &&
                    error.notMatches.map((cat: any) => (
                      <div>
                        <p>
                          Category{" "}
                          <span className="text-lg font-semibold italic">
                            {cat.Category}
                          </span>{" "}
                          and Sub-Category
                          <span className="text-lg font-semibold italic">
                            {cat["Sub-Category"]}{" "}
                          </span>{" "}
                          is not matches.
                        </p>
                        <p>
                          For category{" "}
                          <span className="text-lg font-semibold italic">
                            {cat.Category}
                          </span>{" "}
                          you need to choose one sub-category from below list -{" "}
                        </p>

                        {getSubCategoryListByPassingCategory(
                          cat.Category,
                          data.category
                        ) &&
                          getSubCategoryListByPassingCategory(
                            cat.Category,
                            data.category
                          ).map((val: any) => (
                            <p className="text-lg font-semibold">- {val}</p>
                          ))}
                      </div>
                    ))}
                </div>
              ) : error.errorName === "dup" ? (
                <div>
                  <p>
                    Duplicate product names found in file. Product names should
                    be unique.
                  </p>
                  {error.duplicateNames &&
                    error.duplicateNames.map((val: any) => (
                      <p className="text-lg font-semibold">- {val}</p>
                    ))}
                </div>
              ) : error.errorName === "dup-db" ? (
                <div>
                  <p>
                    Duplicate product names found in existing database. Product
                    names should be unique.
                  </p>
                  {error.duplicateNames &&
                    error.duplicateNames.map((val: any) => (
                      <p className="text-lg font-semibold">- {val}</p>
                    ))}
                </div>
              ) : (
                <p>{error.errorName}</p>
              )}
            </div>
          ) : (
            <BulkList />
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center my-2">
          <input type="file" hidden id="upload" onChange={handleUploadFile} />
          <label
            htmlFor="upload"
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            className="inline-block mx-1 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Upload File
          </label>

          <button
            type="button"
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            data-bs-dismiss="modal"
            data-bs-toogle="modal"
            onClick={() => {
              toast.warning("Wait for few seconds to download.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              setTimeout(() => {
                exportAsExcelFile([...transform(excelData)], "BulkProductAdd");
              }, 200);
            }}
            className="inline-block mx-1 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Download Template
          </button>
        </div>
      )}
    </div>
  );
};

export default AddProductInBulk;
