import React from "react";
import { useSelector } from "react-redux";
import { getAllCategories } from "../../slices/categorySlice";

const ViewCategory = () => {
  const { status, data } = useSelector(getAllCategories);
  return (
    <div>
      <div className="accordion mx-4 my-2" id="accordionExample">
        {data.success &&
          data.category &&
          data.category.map((data: any, key: number) => (
            // <AdminShowCategory data={value} key={index} />
            <div
              key={key}
              className="accordion-item bg-white border border-gray-200"
            >
              <h2 className="accordion-header mb-0" id={`heading-${key}`}>
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
                  data-bs-target={`#collapse-${key}`}
                  aria-expanded="true"
                  aria-controls={`collapse-${key}`}
                >
                  {data.name}
                </button>
              </h2>
              <div
                id={`collapse-${key}`}
                className="accordion-collapse collapse "
                aria-labelledby={`heading-${key}`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body py-4 px-5">
                  <p className="font-semibold my-1 text-xl">Sub-Categories</p>
                  <div className="flex flex-wrap items-center">
                    {data.subCategories &&
                      data.subCategories.map(
                        (val: { _id: String; name: String }, index: number) => (
                          <span
                            key={index}
                            className="px-4 py-2 m-2 rounded-full text-gray-500 bg-gray-200 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease"
                          >
                            {val.name}
                          </span>
                        )
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ViewCategory;
