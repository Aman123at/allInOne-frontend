import React from "react";

const AdminStats = () => {
  return (
    <div>
      <section className="text-gray-600 body-font ">
        <div className=" px-2 py-4 mx-auto w-screen flex">
          <div className="flex flex-wrap  text-center w-3/4">
            <div className="p-3 sm:w-1/4 w-1/2 ">
              <h2 className="title-font font-medium sm:text-4xl text-3xl text-gray-900">
                2.7K
              </h2>
              <p className="leading-relaxed">Products</p>
            </div>
            <div className="p-3 sm:w-1/4 w-1/2 ">
              <h2 className="title-font font-medium sm:text-4xl text-3xl text-gray-900">
                1.8K
              </h2>
              <p className="leading-relaxed">Categories</p>
            </div>
            <div className="p-3 sm:w-1/4 w-1/2 ">
              <h2 className="title-font font-medium sm:text-4xl text-3xl text-gray-900">
                35
              </h2>
              <p className="leading-relaxed">Sub-Categories</p>
            </div>
            <div className="p-3 sm:w-1/4 w-1/2 ">
              <h2 className="title-font font-medium sm:text-4xl text-3xl text-gray-900">
                4
              </h2>
              <p className="leading-relaxed">Product Delivered</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminStats;
