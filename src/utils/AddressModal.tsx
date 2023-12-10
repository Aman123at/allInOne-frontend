import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addNewAddress, fetchSavedAddresses } from "../ApiCalls/checkoutApis";
import { setAddress } from "../slices/checkoutSlice";
import { setLoader } from "../slices/commonSlice";

const AddressModal = ({
  checkoutDetails,
  setCheckoutDetails,
  grabPinCodeByCity,
  citiesList,
  grabStateByCountry,
  grabCitiesByState,
  countryWithStateData,
  countries,
  statesList,
  loggedInUser,
}: any) => {
  const dispatch = useDispatch();
  const [error, setError] = useState<any>({
    firstName: false,
    lastName: false,
    address: false,
    landmark: false,
    city: false,
    country: false,
    state: false,
    postalCode: false,
    phone: false,
  });

  const [saveAd, setSaveAd] = useState<Boolean>(false);
  
  const handleSubmit = () => {
    
    if (
      !checkoutDetails.firstName ||
      !checkoutDetails.lastName ||
      !checkoutDetails.address ||
      !checkoutDetails.landmark ||
      !checkoutDetails.city ||
      !checkoutDetails.country ||
      !checkoutDetails.state ||
      !checkoutDetails.postalCode ||
      !checkoutDetails.phone
    ) {
      toast.error("All fields are required.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      let obj: any = {};
      if (!checkoutDetails.firstName) {
        obj.firstName = true;
        // setError({
        //   ...error,
        //   firstName: true,
        // });
      }
      if (!checkoutDetails.lastName) {
        obj.lastName = true;
        // setError({
        //   ...error,
        //   lastName: true,
        // });
      }
      if (!checkoutDetails.address) {
        obj.address = true;
        // setError({
        //   ...error,
        //   address: true,
        // });
      }
      if (!checkoutDetails.landmark) {
        obj.landmark = true;
        // setError({
        //   ...error,
        //   landmark: true,
        // });
      }
      if (!checkoutDetails.city) {
        obj.city = true;
        // setError({
        //   ...error,
        //   city: true,
        // });
      }
      if (!checkoutDetails.country) {
        obj.country = true;
        // setError({
        //   ...error,
        //   country: true,
        // });
      }
      if (!checkoutDetails.state) {
        obj.state = true;
        // setError({
        //   ...error,
        //   state: true,
        // });
      }
      if (!checkoutDetails.postalCode) {
        obj.postalCode = true;
        // setError({
        //   ...error,
        //   postalCode: true,
        // });
      }
      if (!checkoutDetails.phone) {
        obj.phone = true;
        // setError({
        //   ...error,
        //   phone: true,
        // });
      }
      setError({
        ...error,
        ...obj,
      });
      obj = {};
    } else {
      console.log("Inside ELSE");
      // actual submit info
      if (saveAd) {
        dispatch(setLoader(true));
        // call Add APi
        let payload: any = {
          firstName: checkoutDetails.firstName,
          lastName: checkoutDetails.lastName,
          address: checkoutDetails.address,
          landmark: checkoutDetails.landmark,
          city: checkoutDetails.city,
          country: checkoutDetails.country,
          state: checkoutDetails.state,
          postalCode: checkoutDetails.postalCode,
          phone: checkoutDetails.phone,
        };
        addNewAddress(payload)
          .then((res: any) => {
            dispatch(setLoader(false));
            let loggedIndata = loggedInUser.data;

            let loggedUserId = loggedIndata.user ? loggedIndata.user._id : "";
            if (loggedUserId !== "") {
              dispatch(fetchSavedAddresses(loggedUserId));
            }

            if (res.status === 200) {
              toast.success("New address added successfully.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          })
          .catch((e: any) => {
            dispatch(setLoader(false));
            toast.error("Something went wrong while adding new address.", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
      } else {
        dispatch(
          setAddress({
            ...checkoutDetails,
            temp: true,
            _id: Math.ceil(Math.random() * 10000),
          })
        );
      }
    }
  };

  return (
    <div
      className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
      id="myModalAdd"
      aria-labelledby="exampleModalLgLabel"
      aria-modal="true"
      role="dialog"
      data-bs-backdrop="static"
    >
      <div
        className={`modal-dialog modal-xl relative w-auto pointer-events-none`}
      >
        <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
          <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
            <h5
              className="text-xl font-medium leading-normal text-gray-800"
              id="exampleModalLgLabel"
            >
              Shipping Address
            </h5>
            <button
              onClick={() => {
                setTimeout(() => {
                  setError({
                    firstName: false,
                    lastName: false,
                    address: false,
                    landmark: false,
                    city: false,
                    country: false,
                    state: false,
                    postalCode: false,
                    phone: false,
                  });
                  setCheckoutDetails({
                    ...checkoutDetails,

                    firstName: "",
                    lastName: "",
                    address: "",
                    landmark: "",
                    city: "",
                    country: "",
                    state: "",
                    postalCode: "",
                    phone: "",
                  });
                }, 100);
              }}
              type="button"
              className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body relative  p-4">
            <div className="flex items-center justify-center">
              <div className="mb-3 mt-3 xl:w-96">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label inline-block mb-1 text-gray-700"
                >
                  First Name*
                </label>
                <input
                  type="text"
                  className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  "
                  id="exampleFormControlInput1"
                  value={checkoutDetails.firstName}
                  onChange={(e: any) =>
                    setCheckoutDetails({
                      ...checkoutDetails,
                      firstName: e.target.value,
                    })
                  }
                />
                {error.firstName && (
                  <p className="text-sm text-red-700">Required</p>
                )}
              </div>
              <div className="mb-3 mt-3 ml-2 xl:w-96">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label inline-block mb-1 text-gray-700"
                >
                  Last Name*
                </label>
                <input
                  type="text"
                  className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  "
                  id="exampleFormControlInput1"
                  value={checkoutDetails.lastName}
                  onChange={(e: any) =>
                    setCheckoutDetails({
                      ...checkoutDetails,
                      lastName: e.target.value,
                    })
                  }
                />
                {error.lastName && (
                  <p className="text-sm text-red-700">Required</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="mb-3 mt-3 xl:w-96">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label inline-block mb-1 text-gray-700"
                >
                  Address*
                </label>
                <input
                  type="text"
                  className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  "
                  id="exampleFormControlInput1"
                  value={checkoutDetails.address}
                  onChange={(e: any) =>
                    setCheckoutDetails({
                      ...checkoutDetails,
                      address: e.target.value,
                    })
                  }
                />
                {error.address && (
                  <p className="text-sm text-red-700">Required</p>
                )}
              </div>
              <div className="mb-3 mt-3 ml-2 xl:w-96">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label inline-block mb-1 text-gray-700"
                >
                  Apartment, suite ,landmark , etc.*
                </label>
                <input
                  type="text"
                  className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  "
                  id="exampleFormControlInput1"
                  value={checkoutDetails.landmark}
                  onChange={(e: any) =>
                    setCheckoutDetails({
                      ...checkoutDetails,
                      landmark: e.target.value,
                    })
                  }
                />
                {error.landmark && (
                  <p className="text-sm text-red-700">Required</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="mb-3 mt-3 xl:w-96">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label inline-block mb-1 text-gray-700"
                >
                  City*
                </label>
                <select
                  disabled={
                    checkoutDetails.state === "" ||
                    checkoutDetails.country === ""
                  }
                  className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  aria-label="Default select example"
                  id="exampleFormControlInput1"
                  onChange={(e: any) => {
                    console.log("Inside CITY", e.target.value);
                    setCheckoutDetails({
                      ...checkoutDetails,
                      city: e.target.value,
                    });
                    // setTimeout(() => {
                    //   grabPinCodeByCity(e.target.value);
                    // }, 500);
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
                {error.city && <p className="text-sm text-red-700">Required</p>}
              </div>
              <div className="mb-3 mt-3 ml-2 xl:w-96">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label inline-block mb-1 text-gray-700"
                >
                  Country*
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
                {error.country && (
                  <p className="text-sm text-red-700">Required</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="mb-3 mt-3 xl:w-96">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label inline-block mb-1 text-gray-700"
                >
                  State / Province*
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
                {error.state && (
                  <p className="text-sm text-red-700">Required</p>
                )}
              </div>
              <div className="mb-3 mt-3 ml-2 xl:w-96">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label inline-block mb-1 text-gray-700"
                >
                  Postal code*
                </label>
                <input
                  value={checkoutDetails.postalCode}
                  type="text"
                  className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  "
                  id="exampleFormControlInput1"
                  onChange={(e: any) =>
                    setCheckoutDetails({
                      ...checkoutDetails,
                      postalCode: e.target.value,
                    })
                  }
                />
                {error.postalCode && (
                  <p className="text-sm text-red-700">Required</p>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="mb-3 mt-3 xl:w-96 ">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label inline-block mb-1 text-gray-700"
                >
                  Phone*
                </label>
                <input
                  type="phone"
                  className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  "
                  id="exampleFormControlInput1"
                  value={checkoutDetails.phone}
                  onChange={(e: any) =>
                    setCheckoutDetails({
                      ...checkoutDetails,
                      phone: e.target.value,
                    })
                  }
                />
                {error.phone && (
                  <p className="text-sm text-red-700">Required</p>
                )}
              </div>
            </div>
            <div className="flex justify-center my-2">
              <div className="form-check">
                <input
                  className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                  onChange={(e: any) => setSaveAd(e.target.checked)}
                />
                <label
                  className="form-check-label inline-block text-gray-800"
                  htmlFor="flexCheckDefault"
                >
                  Save this address for next time.
                </label>
              </div>
            </div>
            <div className="flex justify-center my-2">
              <button
                onClick={handleSubmit}
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                data-bs-dismiss="modal"
                className={`inline-block px-6 py-2.5 
                  bg-blue-600
                  text-white font-medium text-xs leading-tight uppercase rounded shadow-md 
                hover:bg-blue-700
                
                 
                 hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
