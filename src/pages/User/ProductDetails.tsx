import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAreaByPinCode,
  getOneProductById,
} from "../../ApiCalls/productApis";
import { setLoader } from "../../slices/commonSlice";
import Header from "./Header";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import {
  addCartItem,
  getAllCartItems,
  removeItemsFromCart,
} from "../../ApiCalls/cartApis";
import { getCartItems } from "../../slices/cartSlice";
import { getLoggedInUser, setUser } from "../../slices/userSlice";
import { fetchUser } from "../../ApiCalls/userApis";

function ProductDetails() {
  const params = useParams();
  const dispatch = useDispatch();
  const [productInfo, setProductInfo] = useState<any>(null);
  const [showImage, setShowImage] = useState<any>("");
  const { status, data } = useSelector(getCartItems);
  useLayoutEffect(() => {
    dispatch(setLoader(true));
    getOneProductById(params.id)
      .then((result: any) => {
        dispatch(setLoader(false));
        console.log(result);
        setProductInfo(result.product);
        setShowImage(
          result && result.product && result.product.images[0].secure_url
        );
      })
      .catch((e: any) => {
        console.log(e);
        dispatch(setLoader(false));
        toast.error(
          e.response && e.response.data
            ? e.response.data.message
            : "Unable to fetch product information. Please try again.",
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
  }, []);

  const [pinCode, setPinCode] = useState();
  const [location, setLocation] = useState("");
  const [loaderLoc, setLoaderLoc] = useState(false);
  const handleSearchByPinCode = () => {
    setLoaderLoc(true);
    getAreaByPinCode(pinCode)
      .then((result: any) => {
        if (result[0].Status === "Success") {
          let postOffice: any = result[0].PostOffice[0];
          setLocation(
            `${postOffice.Name} , ${postOffice.State} , ${postOffice.Country}`
          );
        } else {
          setLocation("Area not found or wrong pin entered.");
        }
        setLoaderLoc(false);
      })
      .catch((e: any) => {
        setLocation("Area not found or wrong pin entered.");
        setLoaderLoc(false);
      });
  };

  const [quantity, setQuantity] = useState(1);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [cartType, setCartType] = useState("");
  const navigate = useNavigate();
  const loggedInUser = useSelector(getLoggedInUser);
  useEffect(() => {
    if (loggedInUser.status === "idle") {
      dispatch(fetchUser());
    }
    // if (loggedInUser.status === "error") {
    //   navigate("/");
    // }
  }, [loggedInUser.status]);
  const isProductInCart = (prod: any, data: any) => {
    let filtered: any = data.filter(
      (item: any) => item.product.name === prod.name
    );
    if (filtered.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    if (status === "finished" && productInfo) {
      let alreadyInCart = isProductInCart(productInfo, data.cart);
      if (alreadyInCart) {
        setCartType("remove");
      } else {
        setCartType("add");
      }
    }
  }, [status, productInfo]);
  const handleAddItemsToCart = async () => {
    setButtonLoader(true);
    console.log("ProductInfo",productInfo)
    let payloadData: any = {
      quantity,
      product: {
        name: productInfo.name,
        prodId:productInfo._id,
        category: productInfo.category,
        subCategory: productInfo.subCategory,
        price: productInfo.price,
        images: productInfo.images,
      },
    };
    addCartItem(payloadData)
      .then((result: any) => {
        console.log("Resposne of add Cart", result);
        if (result.success) {
          dispatch(getAllCartItems());
          toast.success("Added To Cart.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error("Error while adding to Cart.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        setButtonLoader(false);
      })
      .catch((e: any) => {
        setButtonLoader(false);
        toast.error("Error while adding to Cart.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  const handleRemoveItem = async () => {
    let filtered: any = data.cart.filter(
      (item: any) => item.product.name === productInfo.name
    );
    let cartId = filtered[0]._id;
    dispatch(setLoader(true));
    removeItemsFromCart(cartId)
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
      <div className="container px-5 py-14 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <div>
            <img
              alt="ecommerce"
              className="lg:w-full w-full lg:h-auto h-64 max-w-sm max-h-sm object-contain object-center rounded"
              src={showImage}
            />
            <div className="flex flex-wrap items-center my-4 ">
              {productInfo &&
                productInfo.images.map((imgs: any, i: number) => (
                  <img
                    alt="ecommerce"
                    key={i}
                    onClick={() => setShowImage(imgs.secure_url)}
                    className={`${
                      showImage === imgs.secure_url &&
                      " border-2 border-blue-700"
                    } h-20 w-20 object-contain mx-1 hover:scale-110 cursor-pointer`}
                    src={imgs.secure_url}
                  />
                ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              {productInfo?.subCategory}
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              {productInfo?.name}
            </h1>
            <div className="flex mb-4">
              <span className="flex items-center">
                <svg
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-4 h-4 text-indigo-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-4 h-4 text-indigo-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-4 h-4 text-indigo-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-4 h-4 text-indigo-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-4 h-4 text-indigo-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <span className="text-gray-600 ml-3">4 Reviews</span>
              </span>
              <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
                <a className="text-gray-500">
                  <svg
                    fill="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                  </svg>
                </a>
                <a className="text-gray-500">
                  <svg
                    fill="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                  </svg>
                </a>
                <a className="text-gray-500">
                  <svg
                    fill="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                  </svg>
                </a>
              </span>
            </div>
            <p className="font-bold text-lg">Rs. {productInfo?.price}</p>
            <p className="leading-relaxed">{productInfo?.description}</p>
            <div className="flex mt-6 items-center flex-wrap pb-5 border-b-2 border-gray-100 mb-5">
              <div className="flex">
                <span className="mr-3">Color</span>
                <button className="border-2 border-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>
                <button className="border-2 border-gray-300 ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none"></button>
                <button className="border-2 border-gray-300 ml-1 bg-indigo-500 rounded-full w-6 h-6 focus:outline-none"></button>
              </div>
              <div className="flex ml-6 my-1 items-center">
                <span className="mr-3">Size</span>
                <div className="relative">
                  <select className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10">
                    <option>SM</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                  </select>
                  <span className="mr-3 ml-3">Qty</span>
                  <select
                    onChange={(e: any) => setQuantity(e.target.value)}
                    className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val: number) => (
                      <option value={val} key={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="form-floating mb-3 xl:w-96">
                <input
                  type="number"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="floatingInput"
                  placeholder="Enter Pin Code"
                  value={pinCode}
                  onChange={(e: any) => setPinCode(e.target.value)}
                />
                <label htmlFor="floatingInput" className="text-gray-700">
                  Pin Code
                </label>
              </div>
              <button
                type="button"
                // onClick={() => {
                //   let latlng: any = {};
                //   navigator.geolocation.getCurrentPosition((pos: any) => {
                //     console.log("Postion", pos);
                //     latlng["lat"] = pos.coords.latitude;
                //     latlng["lng"] = pos.coords.longitude;
                //   });
                //   const geocoder = new google.maps.Geocoder();
                //   geocoder.geocode({ location: latlng }, (response: any) => {
                //     console.log("Resposne", response);
                //   });
                // }}
                onClick={handleSearchByPinCode}
                className="ml-3  inline-block px-6 py-4 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
              >
                Search
              </button>
            </div>
            <div className="mt-2 mb-4">
              {loaderLoc ? (
                <div className="flex justify-center">
                  <div
                    className=" spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-500 "
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div>
                  <p>{location}</p>
                  {location !== "Area not found or wrong pin entered." && (
                    <>
                      {location !== "" && (
                        <p>
                          Estimated Delivey Time :{" "}
                          <span className="font-bold">5 Days </span>
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex">
              <button
                type="button"
                onClick={
                  cartType === "remove"
                    ? handleRemoveItem
                    : handleAddItemsToCart
                }
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                {buttonLoader
                  ? "Loading...."
                  : cartType === "remove"
                  ? "Remove from cart"
                  : " + Add To Cart"}
              </button>
              {cartType !== "remove" && (
                <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                  Buy Now
                </button>
              )}
              {/* <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                <svg
                  fill="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                </svg>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
