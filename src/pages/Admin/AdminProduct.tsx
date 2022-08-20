import React, { useState } from "react";
import { useSelector } from "react-redux";
import ViewProduct from "../../components/Admin/ViewProduct";
import { getAllProducts } from "../../slices/productSlice";

import CommonModalP from "../../utils/CommonModalP";

const AdminProduct = () => {
  const [showAddModalP, setShowAddModalP] = useState<Boolean>(false);
  const [showAddBulkModalP, setShowAddBulkModalP] = useState<Boolean>(false);
  const [showUpdateModalP, setShowUpdateModalP] = useState<Boolean>(false);
  const [showDeleteModalP, setShowDeleteModalP] = useState<Boolean>(false);
  const { status, data } = useSelector(getAllProducts);
  return (
    <div>
      <CommonModalP
        type={
          showAddModalP
            ? "lg"
            : showAddBulkModalP
            ? "xl"
            : showUpdateModalP
            ? "xl"
            : "xl"
        }
        setShow={
          showAddModalP
            ? setShowAddModalP
            : showAddBulkModalP
            ? setShowAddBulkModalP
            : showUpdateModalP
            ? setShowUpdateModalP
            : setShowDeleteModalP
        }
        title={
          showAddModalP
            ? "Add Product"
            : showAddBulkModalP
            ? "Add Product In Bulk"
            : showUpdateModalP
            ? "Update Product"
            : "Delete Product"
        }
        action={
          showAddModalP
            ? "add"
            : showAddBulkModalP
            ? "addBulk"
            : showUpdateModalP
            ? "update"
            : "delete"
        }
      />

      <div className="flex items-center justify-center mt-2">
        <button
          onClick={() => setShowAddModalP(true)}
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          data-bs-toggle="modal"
          data-bs-target="#myModalP"
          className="inline-block px-6 py-2.5 mx-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Add
        </button>
        <button
          onClick={() => setShowAddBulkModalP(true)}
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          data-bs-toggle="modal"
          data-bs-target="#myModalP"
          className="inline-block px-6 py-2.5 mx-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Add In Bulk
        </button>
        <button
          onClick={() => setShowUpdateModalP(true)}
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          data-bs-toggle="modal"
          data-bs-target="#myModalP"
          className="inline-block px-6 py-2.5 mx-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Update
        </button>
        <button
          onClick={() => setShowDeleteModalP(true)}
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          data-bs-toggle="modal"
          data-bs-target="#myModalP"
          className="inline-block px-6 py-2.5 mx-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Delete
        </button>
      </div>
      <ViewProduct />
    </div>
  );
};

export default AdminProduct;
