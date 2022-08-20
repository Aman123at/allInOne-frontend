import React from "react";
import { useSelector } from "react-redux";
import AddProduct from "../components/Admin/AddProduct";
import AddProductInBulk from "../components/Admin/AddProductInBulk";
import DeleteProduct from "../components/Admin/DeleteProduct";
import UpdateProduct from "../components/Admin/UpdateProduct";
import { getDeleteModalState } from "../slices/commonSlice";
interface ICommonModalPProps {
  type: String;
  title: String;
  action: String;
  setShow: Function;
}
const CommonModalP = ({ type, title, action, setShow }: ICommonModalPProps) => {
  let deleteModalOpen: any = useSelector(getDeleteModalState);
  return (
    <div
      className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
      id="myModalP"
      aria-labelledby="exampleModalLgLabel"
      aria-modal="true"
      role="dialog"
      data-bs-backdrop="static"
    >
      <div
        className={`modal-dialog modal-${type} relative w-auto pointer-events-none`}
      >
        <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
          <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
            <h5
              className="text-xl font-medium leading-normal text-gray-800"
              id="exampleModalLgLabel"
            >
              {title}
            </h5>
            {!deleteModalOpen && (
              <button
                onClick={() => {
                  setTimeout(() => {
                    setShow(false);
                  }, 100);
                }}
                type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            )}
          </div>
          <div className="modal-body relative p-4">
            {action === "add" && <AddProduct />}
            {action === "addBulk" && <AddProductInBulk />}
            {action === "update" && <UpdateProduct />}
            {action === "delete" && <DeleteProduct />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonModalP;
