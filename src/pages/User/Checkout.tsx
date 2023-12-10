import React, { useEffect, useLayoutEffect, useState,useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import { v4 as uuidv4 } from "uuid";
import {
  clearUsersCart,
  fetchCities,
  fetchCountries,
  fetchPinCodeByCity,
  getAllCartItems,
} from "../../ApiCalls/cartApis";
import {
  deleteAddressById,
  fetchSavedAddresses,
} from "../../ApiCalls/checkoutApis";
import { getRazorpayKey, getRazorpayOrder } from "../../ApiCalls/paymentApis";
import { fetchUser } from "../../ApiCalls/userApis";
import { clearCart, getCartItems } from "../../slices/cartSlice";
import { deleteAddress, getSavedAddresses, setInvoiceDetails } from "../../slices/checkoutSlice";
import { setLoader } from "../../slices/commonSlice";
import { getLoggedInUser } from "../../slices/userSlice";
import AddressModal from "../../utils/AddressModal";
import Header from "./Header";
import { createOrder } from "../../ApiCalls/orderApis";
import InvoiceModal from "../../utils/InvoiceModal";

function Checkout() {
  const Razorpay = useRazorpay();
  const { status, data } = useSelector(getCartItems);
  const loggedInUser = useSelector(getLoggedInUser);
  const savedAddresses = useSelector(getSavedAddresses);
  const [rezorpaykey, setRazorpaykey] = useState("");
  const [delivery, setDelivery] = useState<string>("standard");
  const [countryWithStateData, setCountryWithStateData] = useState<any>([]);
  const [payment, setPayment] = useState<string>("r");
  const [countries, setCountries] = useState<any>([]);
  const [statesList, setStatesList] = useState<any>([]);
  const [citiesList, setCitiesList] = useState<any>([]);
  const [removeAddress, setRemoveAddress] = useState<Boolean>(false);
  const [checkoutDetails, setCheckoutDetails] = useState<any>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    country: "",
    state: "",
    pinCode: "",
    phone: "",
  });

  const [enableInvoice,setEnableInvoice]= useState(false)
  useEffect(() => {
    getRazorpayKey()
      .then((res: any) => {
        if (res.razorpaykey) {
          setRazorpaykey(res.razorpaykey);
        }
      })
      .catch((e: any) => console.log(e));
  }, []);
  const grabCountryName = (lists: any) => {
    let toret: any = lists.map((val: any) => val.name);
    return toret;
  };
  const grabStateByCountry = (lists: any, country: string) => {
    let states: any = [];
    let filteredState: any = lists.filter((val: any) => val.name === country);
    if (filteredState && filteredState.length > 0) {
      let allstates: any = filteredState[0].states;
      states = allstates.map((val: any) => val.name);
    }
    setStatesList(states);
    // return states;
  };
  const grabCitiesByState = (state: any) => {
    fetchCities({
      country: checkoutDetails.country,
      state,
    })
      .then((res: any) => {
        if (res.error === false && res.data && res.data.length > 0) {
          setCitiesList(res.data);
        }
      })
      .catch((e: any) => {
        console.log(e);
      });
  };
  const grabPinCodeByCity = (city: any) => {
    fetchPinCodeByCity(city)
      .then((res: any) => {
        if (
          res[0].Status === "Success" &&
          res[0].PostOffice &&
          res[0].PostOffice.length > 0
        ) {
          let actualPostOffice: any = res[0].PostOffice.filter(
            (val: any) => val.State === checkoutDetails.state
          );
          if (actualPostOffice && actualPostOffice.length > 0) {
            setCheckoutDetails({
              ...checkoutDetails,
              pinCode: actualPostOffice[0].Pincode,
            });
          }
        }
      })
      .catch((e: any) => {
        console.log(e);
      });
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLoader(true));
    fetchCountries()
      .then((res: any) => {
        // console.log(res);
        if (res.error === false && res.data && res.data.length > 0) {
          setCountryWithStateData(res.data);
          let allCountries: any = grabCountryName(res.data);
          setCountries(allCountries);
        }
        dispatch(setLoader(false));
      })
      .catch((e: any) => {
        console.log(e);
        dispatch(setLoader(false));
      });
  }, []);

  useEffect(() => {
    if (loggedInUser.status === "idle") {
      dispatch(fetchUser());
    }
    if (loggedInUser.status === "finished") {
      let loggedIndata = loggedInUser.data;

      let loggedEmail = loggedIndata.user ? loggedIndata.user.email : "";
      let loggedUserId = loggedIndata.user ? loggedIndata.user._id : "";

      setCheckoutDetails({
        ...checkoutDetails,
        email: loggedEmail,
      });
    }
  }, [loggedInUser.status]);

  useLayoutEffect(() => {
    if (status === "idle") {
      dispatch(setLoader(true));
      dispatch(getAllCartItems());
    }
  }, [status]);
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
    if (
      savedAddresses.status === "idle" &&
      loggedInUser.status === "finished"
    ) {
      let loggedIndata = loggedInUser.data;

      let loggedUserId = loggedIndata.user ? loggedIndata.user._id : "";
      if (loggedUserId !== "") {
        dispatch(fetchSavedAddresses(loggedUserId));
      }
    }
  }, [savedAddresses.status, loggedInUser.status]);
  const handleAddAddress = async () => {
    // calling add api
  };
  const [addIndex, setAddIndex] = useState(0);
  const handleDeleteAddress = (deleteValue: any) => {
    // delete address
    if (deleteValue.temp) {
      dispatch(deleteAddress(deleteValue._id));
    } else {
      dispatch(setLoader(true));
      // callapi
      deleteAddressById(deleteValue._id)
        .then((res: any) => {
          dispatch(setLoader(false));
          console.log("resposen", res);
          if (res.success) {
            dispatch(deleteAddress(deleteValue._id));
          }
        })
        .catch((e: any) => {
          dispatch(setLoader(false));
          toast.error("Something went wrong while deleting.", {
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

  // payment functions
  // const handlePaymentRazor=async()=>{
  //   dispatch(setLoader(true))
  //   let shippingCharge = delivery==="quick"?100:50
  //   let neworder = await getRazorpayOrder(getOverallPrice()+shippingCharge)
  //   dispatch(setLoader(true))
  //   console.log("MyNewOrderFromServer",neworder)

  // }
  const extractInvoiceFromCart=(cartData:any)=>{
      let toret:any = []
      cartData.map((item:any)=>{
        let obj:any = {}
        obj["productName"] = item.product.name
        obj["productId"] = item.product.prodId
        obj["productPrice"] = item.product.price
        obj["quantity"] = item.quantity

        toret.push(obj)
      })

      return toret

  }
  const handleCreateOrder=(razorpay_order_id:any,razorpay_payment_id:any)=>{
    // create order
    let payload:any = {
      products: extractInvoiceFromCart(data.cart),
      order_id:razorpay_order_id,
      payment_id:razorpay_payment_id
    }
    createOrder(payload)
    .then((response:any)=>{
      let loggedIndata = loggedInUser.data;

      
      let loggedUserId = loggedIndata.user ? loggedIndata.user._id : "";
      if(response.success){
        handleCreateInvoice()
        setTimeout(() => {
          clearUsersCart(loggedUserId)
          .then((res:any)=>{
            dispatch(clearCart())
          })
          .catch((e:any)=>console.log(e))
          setEnableInvoice(true)
          console.log("Order created successfully.",response)
        }, 200);
      }
    })
    .catch((e:any)=>console.log("error while creating order",e))
  }
  const handleCreateInvoice=()=>{
    // create invoice
    let myInvoice = extractInvoiceFromCart(data.cart)
    dispatch(setInvoiceDetails({
      products:myInvoice,
      shippingCharge:delivery==="quick"?100:50

    }))
  }
  const handlePaymentRazorClient = useCallback(async ()=>{
    let shippingCharge = delivery==="quick"?100:50
    let neworder = await getRazorpayOrder((getOverallPrice()+shippingCharge)*100)
    const options: RazorpayOptions = {
      key: rezorpaykey,
      amount: neworder && neworder.order? neworder.amount :`${getOverallPrice()+shippingCharge}`,
      currency: "INR",
      name: "All In One Org",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: neworder && neworder.order ? neworder.order.id : `${uuidv4()}`,
      handler: (res) => {
        console.log("Payment Response>>",res);
        if(res){
          
          console.log("Inside success payment")
          handleCreateOrder(res.razorpay_order_id,res.razorpay_payment_id)


        }
        else{
          console.log("Inside failure payment");
        }
      },
      prefill: {
        name: `${checkoutDetails.firstName+' '+checkoutDetails.lastName }`,
        email: `${checkoutDetails.email}`,
        contact: `${checkoutDetails.phone}`,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzpay = new Razorpay(options);
    rzpay.open();

  },[Razorpay])

  return (
    <div>
      <Header />
      <AddressModal
        checkoutDetails={checkoutDetails}
        setCheckoutDetails={setCheckoutDetails}
        grabPinCodeByCity={grabPinCodeByCity}
        citiesList={citiesList}
        grabStateByCountry={grabStateByCountry}
        grabCitiesByState={grabCitiesByState}
        countryWithStateData={countryWithStateData}
        countries={countries}
        statesList={statesList}
        loggedInUser={loggedInUser}
      />
      {enableInvoice ? <div><InvoiceModal /></div> :
      
      <div className="flex  ">
        <div className="m-6 ">
          <p className="font-semibold text-xl">Contact information</p>
          <div className="mb-3 mt-3 xl:w-96  ">
            <label
              htmlFor="exampleFormControlInput1"
              className="form-label inline-block mb-1  text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  "
              id="exampleFormControlInput1"
              placeholder="Enter Email"
              value={checkoutDetails.email}
              onChange={(e: any) =>
                setCheckoutDetails({
                  ...checkoutDetails,
                  email: e.target.value,
                })
              }
            />
          </div>
          <hr className="my-8 border-gray-300" />
          <p className="font-semibold text-xl">Shipping information</p>
          <div className="flex items-center flex-wrap my-2">
            {savedAddresses.data &&
              savedAddresses.data.address &&
              savedAddresses.data.address.length > 0 &&
              savedAddresses.data.address.map((value: any, i: number) => (
                <div
                  key={i}
                  className={
                    removeAddress
                      ? "p-3 m-2 w-72 border-2 border-t-4 border-red-500 shadow-lg rounded-lg cursor-pointer hover:animate-bounce"
                      : `p-3 m-2 w-72 border ${
                          addIndex === i
                            ? "border-2 border-t-4 border-green-500"
                            : "border-gray-300"
                        }  shadow-lg rounded-lg cursor-pointer`
                  }
                  onClick={() => {
                    if (removeAddress) {
                      handleDeleteAddress(value);
                    } else {
                      setAddIndex(i);
                    }
                  }}
                >
                  <div className="flex my-1 items-center justify-between">
                    <p className="text-md font-bold">
                      {value.firstName} {value.lastName}
                    </p>
                    {removeAddress ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-red-700"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <>
                        {addIndex === i && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 text-green-700"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        )}
                      </>
                    )}
                  </div>
                  <p className="font-thin text-sm">
                    {value.landmark}, {value.address}{" "}
                  </p>
                  <p className="font-thin mt-1 text-sm">
                    PIN : {value.postalCode}
                  </p>
                  <p className="font-thin text-md mb-2 mt-5">
                    {value.city} , {value.state} , {value.country}
                  </p>
                </div>
              ))}
          </div>
          <div className="my-2 flex items-center">
            <p
              data-bs-target="#myModalAdd"
              data-bs-toggle="modal"
              className="font-bold text-md text-blue-400  cursor-pointer hover:font-thin w-max"
            >
              + Add new address
            </p>
            {savedAddresses.data &&
              savedAddresses.data.address &&
              savedAddresses.data.address.length > 0 && (
                <>
                  {removeAddress ? (
                    <p
                      onClick={() => setRemoveAddress(false)}
                      className="font-bold text-md text-blue-600 mx-4 cursor-pointer hover:font-thin w-max"
                    >
                      Cancle
                    </p>
                  ) : (
                    <p
                      onClick={() => setRemoveAddress(true)}
                      className="font-bold text-md text-red-600 mx-4 cursor-pointer hover:font-thin w-max"
                    >
                      x Remove address
                    </p>
                  )}
                </>
              )}
          </div>
          {/* <div className="flex items-center">
            <div className="mb-3 mt-3 xl:w-96">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label inline-block mb-1 text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  "
                id="exampleFormControlInput1"
              />
            </div>
            <div className="mb-3 mt-3 ml-2 xl:w-96">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label inline-block mb-1 text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  "
                id="exampleFormControlInput1"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div className="mb-3 mt-3 xl:w-96">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label inline-block mb-1 text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  "
                id="exampleFormControlInput1"
              />
            </div>
            <div className="mb-3 mt-3 ml-2 xl:w-96">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label inline-block mb-1 text-gray-700"
              >
                Apartment, suite , etc.
              </label>
              <input
                type="text"
                className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  "
                id="exampleFormControlInput1"
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="mb-3 mt-3 xl:w-96">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label inline-block mb-1 text-gray-700"
              >
                City
              </label>
              <select
                disabled={
                  checkoutDetails.state === "" || checkoutDetails.country === ""
                }
                className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                aria-label="Default select example"
                id="exampleFormControlInput1"
                onChange={(e: any) => {
                  setCheckoutDetails({
                    ...checkoutDetails,
                    city: e.target.value,
                  });
                  grabPinCodeByCity(e.target.value);
                }}
              >
                <option value="" selected>
                  Select City
                </option>
                {citiesList &&
                  citiesList.length > 0 &&
                  citiesList.map((val: any) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-3 mt-3 ml-2 xl:w-96">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label inline-block mb-1 text-gray-700"
              >
                Country
              </label>

              <select
                className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                aria-label="Default select example"
                id="exampleFormControlInput1"
                onChange={(e: any) => {
                  setCheckoutDetails({
                    ...checkoutDetails,
                    country: e.target.value,
                  });
                  grabStateByCountry(countryWithStateData, e.target.value);
                }}
              >
                <option value="" selected>
                  Select Country
                </option>
                {countries &&
                  countries.length > 0 &&
                  countries.map((val: any) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mb-3 mt-3 xl:w-96">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label inline-block mb-1 text-gray-700"
              >
                State / Province
              </label>
              <select
                disabled={checkoutDetails.country === ""}
                className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                aria-label="Default select example"
                id="exampleFormControlInput1"
                onChange={(e: any) => {
                  setCheckoutDetails({
                    ...checkoutDetails,
                    state: e.target.value,
                  });
                  grabCitiesByState(e.target.value);
                  // grabStateByCountry(countryWithStateData,e.target.value)
                }}
              >
                <option value="" selected>
                  Select State
                </option>
                {statesList &&
                  statesList.length > 0 &&
                  statesList.map((val: any) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-3 mt-3 ml-2 xl:w-96">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label inline-block mb-1 text-gray-700"
              >
                Postal code
              </label>
              <input
                value={checkoutDetails.pinCode}
                type="text"
                className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  "
                id="exampleFormControlInput1"
                onChange={(e: any) =>
                  setCheckoutDetails({
                    ...checkoutDetails,
                    pinCode: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mb-3 mt-3 xl:w-96">
            <label
              htmlFor="exampleFormControlInput1"
              className="form-label inline-block mb-1 text-gray-700"
            >
              Phone
            </label>
            <input
              type="phone"
              className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  "
              id="exampleFormControlInput1"
            />
          </div> */}
          <hr className="my-8 border-gray-300" />
          <p className="font-semibold text-xl">Delivery method</p>
          <div className="my-3 flex items-center flex-wrap">
            {/* method card start */}

            <div
              className={`p-3 m-2 w-72 border ${
                delivery === "standard"
                  ? "border-2 border-blue-500"
                  : "border-gray-300"
              }  shadow-lg rounded-lg cursor-pointer`}
              onClick={() => setDelivery("standard")}
            >
              <div className="flex my-1 items-center justify-between">
                <p className="text-md font-bold">Standard</p>
                {delivery === "standard" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-blue-600"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clip-rule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="font-thin text-sm">within 5 days</p>
              <p className="font-bold text-md mb-2 mt-5">Rs. 50</p>
            </div>
            {/* method card end */}
            {/* method card start */}
            <div
              className={`p-3 m-2 w-72 border ${
                delivery === "quick"
                  ? "border-2 border-blue-500"
                  : "border-gray-300"
              }  shadow-lg rounded-lg cursor-pointer`}
              onClick={() => setDelivery("quick")}
            >
              <div className="flex my-1 items-center justify-between">
                <p className="text-md font-bold">Quick</p>
                {delivery === "quick" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-blue-600"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clip-rule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="font-thin text-sm">within 2 days</p>
              <p className="font-bold text-md mb-2 mt-5">Rs. 100</p>
            </div>
            {/* method card end */}
          </div>
          <hr className="my-8 border-gray-300" />
          <p className="font-semibold text-xl">Payment</p>
          <div className="my-4 flex items-center">
            <div className="form-check form-check-inline">
              <input
                className=" form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio1"
                value="r"
                checked={payment === "r"}
                onChange={(e: any) => setPayment(e.target.value)}
              />
              <label
                className="form-check-label inline-block text-gray-800"
                htmlFor="inlineRadio10"
              >
                Razorpay
              </label>
            </div>
            <div className="form-check form-check-inline ml-2">
              <input
                className=" form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio2"
                value="s"
                checked={payment === "s"}
                onChange={(e: any) => setPayment(e.target.value)}
              />
              <label
                className="form-check-label inline-block text-gray-800"
                htmlFor="inlineRadio20"
              >
                Stripe
              </label>
            </div>
          </div>
        </div>
        <div className="m-6 ml-auto">
          <p className="font-semibold text-xl">Order summary</p>
          {/* product list */}
          <div className="m-1 overflow-scroll h-80 scrollbar-hide">
            {data && data.cart && data.cart.length > 0 ? (
              <>
                {data.cart.map((items: any, i: number) => (
                  <div
                    key={i}
                    className="flex bg-white p-3 border border-gray-300 rounded w-96 mt-1"
                  >
                    <img
                      src={items.product.images[0].secure_url}
                      alt="a"
                      className="h-20 w-20"
                    />
                    <div className="ml-2 mr-2">
                      <p className="text-lg font-thin"> {items.product.name}</p>
                      <p className="text-sm font-normal mt-3">
                        Rs. {items.product.price}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <p className="text-md font-semibold">
                        Qty:{items.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p>No Data available</p>
            )}
          </div>

          {/* subtotal card */}
          <div className=" bg-white p-2">
            <div className="flex items-center justify-between p-3">
              <p className="text-sm font-semibold">Subtotal</p>
              <p>Rs.{getOverallPrice()}</p>
            </div>
            <div className="flex items-center justify-between p-3">
              <p className="text-sm font-semibold">Shipping</p>
              <p>Rs.{delivery === "quick" ? "100" : "50"}</p>
            </div>

            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              onClick={()=>{
                if(payment=='r'){
                  handlePaymentRazorClient()
                  // handlePaymentRazor()
                }else{
                  // stripe payment handle
                }
              }}
              className="inline-block px-6 w-full my-3 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      }
    </div>
  );
}
export default Checkout;

