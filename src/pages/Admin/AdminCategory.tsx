import React, { useState } from "react";
import ViewCategory from "../../components/Admin/ViewCategory";
import CommonModal from "../../utils/CommonModal";

const AdminCategory = () => {
  const [showAddModal, setShowAddModal] = useState<Boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<Boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<Boolean>(false);

  return (
    <div>
      <CommonModal
        type={showAddModal ? "lg" : showUpdateModal ? "xl" : "lg"}
        setShow={
          showAddModal
            ? setShowAddModal
            : showUpdateModal
            ? setShowUpdateModal
            : setShowDeleteModal
        }
        title={
          showAddModal
            ? "Add Category"
            : showUpdateModal
            ? "Update Category"
            : "Delete Category"
        }
        action={showAddModal ? "add" : showUpdateModal ? "update" : "delete"}
      />

      <div className="flex items-center justify-center mt-2">
        <button
          onClick={() => setShowAddModal(true)}
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          data-bs-toggle="modal"
          data-bs-target="#myModal"
          className="inline-block px-6 py-2.5 mx-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Add
        </button>
        <button
          onClick={() => setShowUpdateModal(true)}
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          data-bs-toggle="modal"
          data-bs-target="#myModal"
          className="inline-block px-6 py-2.5 mx-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Update
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          data-bs-toggle="modal"
          data-bs-target="#myModal"
          className="inline-block px-6 py-2.5 mx-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Delete
        </button>
      </div>
      <ViewCategory />
    </div>
  );
};

export default AdminCategory;
