import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllCartItems, removeItemsFromCart } from "../../ApiCalls/cartApis";
import { fetchUser } from "../../ApiCalls/userApis";
import { getCartItems } from "../../slices/cartSlice";
import { setLoader } from "../../slices/commonSlice";

import { getLoggedInUser, setUser } from "../../slices/userSlice";
import { truncate } from "../../utils/utils";
import Header from "./Header";

function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedInUser: any = useSelector(getLoggedInUser);
  const { status, data } = useSelector(getCartItems);
  // setTimeout(() => {
  //   if (loggedInUser === null) {
  //     navigate("/login");
  //   }
  // }, 1000);

  const getOverallPrice = () => {
    let totalPrice: number = 0;
    if (data && data.cart && data.cart.length > 0) {
      data.cart.map((item: any) => {
        let itemPrice: any = item.quantity * item.product.price;
        totalPrice += itemPrice;
      });
    }
    return totalPrice;
  };
  useEffect(() => {
    if (loggedInUser.status === "idle") {
      dispatch(fetchUser());
    }
    if (loggedInUser.status === "error") {
      navigate("/");
    }
  }, [loggedInUser.status]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(setLoader(true));
      dispatch(getAllCartItems());
    }
    if (status === "error") {
      dispatch(setLoader(false));
      toast.error(
        "Something Gone Wrong While Fetching Cart Items, Please reload the page.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
    if (status === "finished") {
      dispatch(setLoader(false));
    }
  }, [status]);

  const handleRemoveFromCart = async (id: any) => {
    dispatch(setLoader(true));
    removeItemsFromCart(id)
      .then((resp: any) => {
        if (resp.success) {
          dispatch(setLoader(false));
          dispatch(getAllCartItems());
        } else {
          dispatch(setLoader(false));
          toast.error(
            "Something wrong while removing from cart. Please try again.",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
        }
      })
      .catch((e: any) => {
        dispatch(setLoader(false));
        toast.error(
          "Something wrong while removing from cart. Please try again.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      });
  };
  return (
    <div>
      <Header />
      <div className="flex flex-wrap flex-col lg:flex-row  ">
        <div className="my-4 flex-1 overflow-y-scroll lg:h-screen scrollbar-hide">
          {data && data.cart && data.cart.length > 0 ? (
            data.cart.map((items: any, i: number) => (
              <div key={i} className="flex justify-center my-2">
                <div className="flex flex-col md:flex-row md:max-w-xl lg:w-full rounded-lg bg-white shadow-lg">
                  <img
                    className=" w-full h-96 lg:h-60 lg:w-60 md:h-auto object-contain md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
                    src={items.product.images[0].secure_url}
                    alt=""
                  />
                  <div className="p-6 flex flex-col justify-start">
                    <h5 className="text-gray-900 text-xl lg:w-80 font-medium mb-2">
                      {items.product.name}
                    </h5>
                    <p className="text-gray-700 text-base mb-2">
                      Category : {items.product.category}
                    </p>
                    <p className="text-gray-700 text-base mb-2">
                      Sub-Category : {items.product.subCategory}
                    </p>
                    <p className="text-gray-700 text-base mb-2">
                      Price : {items.product.price}
                    </p>
                    <p className="text-gray-700 text-base font-bold">
                      Quantity : {items.quantity}
                    </p>
                    <p className="text-gray-700 text-base font-bold">
                      Total : Rs. {items.quantity * items.product.price}
                    </p>
                    <button
                      type="button"
                      data-mdb-ripple="true"
                      data-mdb-ripple-color="light"
                      onClick={() => handleRemoveFromCart(items._id)}
                      className="inline-block w-1/2 px-6 mt-1 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center font-bold text-lg">No items in cart</p>
          )}
        </div>

        {data && data.cart && data.cart.length > 0 && (
          <div className="lg:mt-4 lg:ml-4 lg:mr-8 lg:p-4 mt-3 ml-2 mr-4 p-4 border h-min border-gray-300 rounded-lg shadow-lg bg-white lg:w-96">
            <div className="border-b-2 border-black">
              <h2 className="font-semibold leading-tight text-2xl mt-0 mb-2 text-blue-600">
                Cart Details
              </h2>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-lg font-semibold text-gray-700">
                Total Price :
              </p>
              <p className="mr-2 text-lg font-bold">Rs. {getOverallPrice()}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-lg font-semibold text-gray-700">
                Total Products :
              </p>
              <p className="mr-2 text-lg font-bold">
                {data && data.cart && data.cart.length ? data.cart.length : 0}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-lg font-semibold text-gray-700">Details :</p>
            </div>
            <div className="flex  justify-end mt-1 flex-col">
              {data &&
                data.cart &&
                data.cart.length > 0 &&
                data.cart.map((items: any, i: number) => (
                  <p key={i} className="text-sm mx-auto text-gray-700">
                    {items.quantity}{" "}
                    <span className="font-bold text-md">x</span>{" "}
                    {truncate(items.product.name, 30)} ={" "}
                    <span className="font-semibold text-black">
                      Rs. {items.quantity * items.product.price}
                    </span>
                  </p>
                ))}
            </div>

            <div className="mt-5">
              <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                onClick={() => navigate("/checkout")}
                className="inline-block px-6 py-2.5 w-full bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
