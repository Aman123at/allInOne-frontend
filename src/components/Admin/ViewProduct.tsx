import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllProducts } from "../../slices/productSlice";

import ReactPaginate from "react-paginate";
import DropdownButton from "../../utils/DropdownButton";
import { getAllCategories } from "../../slices/categorySlice";
import { getCategoryList, getSubCategoryList } from "../../utils/utils";

interface IFilterBy {
  category: String;
  subcategory: String;
}

const ViewProduct = () => {
  const { status, data } = useSelector(getAllProducts);
  const allCategories: any = useSelector(getAllCategories);

  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [filterBy, setFilterBy] = useState<IFilterBy>({
    category: "",
    subcategory: "",
  });

  const [filterProductName, setFilterProductName] = useState<string>("");

  const [itemOffset, setItemOffset] = useState(0);
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
  return (
    <div>
      <div className="my-4 flex justify-end mr-4">
        {filterBy.category === "" && filterBy.subcategory === "" && (
          <div className="xl:w-96">
            <input
              type="search"
              disabled={filterBy.category !== "" || filterBy.subcategory !== ""}
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
          className="flex items-center  px-6 py-2.5 mx-2 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
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
          text="Filter By Category"
          data={
            allCategories.status === "finished"
              ? getCategoryList(allCategories.data.category)
              : []
          }
          onMenuClick={handleClickCategory}
        />
        <DropdownButton
          text="Filter By Sub-Category"
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
            <div
              key={key}
              className="accordion-item bg-white border border-gray-200"
            >
              <h2 className="accordion-header mb-0" id={`heading-5${key}`}>
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
                  <p className="font-semibold my-1 text-xl">{prod.name}</p>
                  <div className="flex flex-wrap items-center">
                    {prod.description}
                  </div>
                  <div className="mt-2 flex items-center flex-wrap">
                    {prod.images &&
                      prod.images.map((val: any, index: number) => (
                        <img
                          src={val.secure_url}
                          alt=""
                          key={index}
                          className="h-80 w-80 m-2 object-contain"
                        />
                      ))}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-evenly">
                    <p className="font-bold">
                      Category -{" "}
                      <span className="font-medium">{prod.category}</span>
                    </p>
                    <p className="font-bold">
                      Sub-Category -{" "}
                      <span className="font-medium">{prod.subCategory}</span>
                    </p>
                    <p className="font-bold">
                      Price - <span className="font-medium">{prod.price}</span>
                    </p>
                    <p className="font-bold">
                      Units - <span className="font-medium">{prod.units}</span>
                    </p>
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
  );
};

export default ViewProduct;