import React, { useState } from "react";
import Chips from "../../utils/Chips";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { addCategory, getAllCategory } from "../../ApiCalls/categoryApis";
import { useDispatch } from "react-redux";

const AddCategory = () => {
  const [category, setCategory] = useState("");
  const [subCategories, setSubCategories] = useState<any>([]);
  const [subcat, setSubcat] = useState("");
  const dispatch = useDispatch();
  const convertToRealFormat = (data: any) => {
    let ret: any = [];
    data.map((val: any) => {
      ret.push({
        name: val.val,
      });
    });
    return ret;
  };

  const handleAdd = () => {
    let actualSubcats: any = convertToRealFormat(subCategories);
    if (!category || subCategories.length === 0) {
      toast.error("All fields are required.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      let dataBody: any = {
        name: category,
        subCategories: actualSubcats,
      };
      addCategory(dataBody)
        .then((result: any) => {
          console.log(result);
          setCategory("");
          setSubCategories([]);

          toast.success("Category added successfully.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          dispatch(getAllCategory());
        })
        .catch((e: any) => {
          console.log(e);
          toast.error("Unable to add category. Plese try again.", {
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

  const handleClose = (id: number) => {
    setSubCategories(subCategories.filter((values: any) => values.id !== id));
  };
  return (
    <div>
      <div className="flex justify-center">
        <div className="mb-3 xl:w-96">
          <input
            type="text"
            value={category}
            onChange={(e: any) => setCategory(e.target.value)}
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
            placeholder="Enter Category"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="mb-3 xl:w-96">
          <input
            type="text"
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
            placeholder="Enter Sub-Categories"
            value={subcat}
            onChange={(e: any) => {
              setSubcat(e.target.value);
              window.addEventListener("keypress", (eve) => {
                if (eve.key == "Enter") {
                  setSubCategories([
                    ...subCategories,
                    { val: e.target.value, id: uuidv4() },
                  ]);
                  setTimeout(() => {
                    setSubcat("");
                  }, 200);
                }
              });
            }}
          />
          <div className="text-sm text-gray-500 mt-1">
            *Press Enter To Add Multiple Sub-Categories
          </div>
        </div>
      </div>

      <div className="flex mt-2 items-center flex-wrap justify-center space-x-2">
        {subCategories.map((val: any, i: number) => (
          <Chips text={val} onClose={handleClose} />
        ))}
      </div>
      <div className="flex space-x-2 mt-2 justify-center">
        <button
          onClick={handleAdd}
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Add Category
        </button>
      </div>
    </div>
  );
};

export default AddCategory;
