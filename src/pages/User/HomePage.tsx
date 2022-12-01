import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllCartItems } from "../../ApiCalls/cartApis";
import { getAllCategory } from "../../ApiCalls/categoryApis";
import { fetchProducts } from "../../ApiCalls/productApis";
import { fetchUser } from "../../ApiCalls/userApis";
import ProductWithCategory from "../../components/User/ProductWithCategory";
import ShowAllProducts from "../../components/User/ShowAllProducts";
import { getCartItems } from "../../slices/cartSlice";
import { getAllCategories } from "../../slices/categorySlice";
import { setLoader } from "../../slices/commonSlice";
import { getAllProducts } from "../../slices/productSlice";
import { getLoggedInUser, setUser } from "../../slices/userSlice";

import Header from "./Header";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, data } = useSelector(getAllProducts);
  const allCategories = useSelector(getAllCategories);
  const loggedInUser = useSelector(getLoggedInUser);
  const cartItems = useSelector(getCartItems);
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
      dispatch(fetchProducts());
      dispatch(setLoader(true));
    } else if (status === "error") {
      dispatch(setLoader(false));
      toast.error(
        "Something Gone Wrong While Fetching Product, Please reload the page.",
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
    } else if (status === "finished") {
      dispatch(setLoader(false));
    }
  }, [status]);
  useEffect(() => {
    if (allCategories.status === "idle") {
      dispatch(getAllCategory());
      dispatch(setLoader(true));
    } else if (allCategories.status === "error") {
      dispatch(setLoader(false));
      toast.error(
        "Something Gone Wrong While Fetching Categories, Please reload the page.",
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
    } else if (allCategories.status === "finished") {
      dispatch(setLoader(false));
    }
  }, [allCategories.status]);

  const createDataToShow = (allCats: any, allProds: any) => {
    let dataToRet: any = [];
    let allCatgeoryLists: any = allCats.map((cat: any) => cat.name);
    allCatgeoryLists.map((category: string) => {
      let obj: any = {};
      obj["category"] = category;
      obj["product"] = allProds.filter(
        (prod: any) => prod.category === category
      );
      dataToRet.push(obj);
    });

    return dataToRet;
  };
  const [completeData, setCompleteData] = useState<any>([]);
  console.log("CompleteData", completeData);
  useEffect(() => {
    if (status === "idle") {
      dispatch(setLoader(true));
    } else if (status == "error") {
      dispatch(setLoader(false));
    }

    if (status === "finished" && allCategories.status === "finished") {
      let finalData: any = createDataToShow(
        allCategories.data.category,
        data.products
      );
      if (finalData.length > 0) {
        setCompleteData(finalData);
      } else {
        setCompleteData([]);
      }
      dispatch(setLoader(false));
    }
  }, [status, allCategories.status]);

  useEffect(() => {
    if (cartItems.status === "idle") {
      dispatch(setLoader(true));
      dispatch(getAllCartItems());
    }
    if (cartItems.status === "error") {
      dispatch(setLoader(false));
      // toast.error(
      //   "Something Gone Wrong While Fetching Cart Items, Please reload the page.",
      //   {
      //     position: "top-right",
      //     autoClose: 5000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //   }
      // );
    }
    if (cartItems.status === "finished") {
      dispatch(setLoader(false));
    }
  }, [cartItems.status]);

  const [showAll, setShowAll] = useState<Boolean>(false);
  const [showAllCategory, setShowAllCategory] = useState<string>("");
  const handleShowAll = (category: string) => {
    setShowAllCategory(category);
    setShowAll(true);
    console.log(category);
  };
  const removeShowAll = () => {
    setShowAll(false);
  };
  return (
    <div>
      <Header />
      {showAll ? (
        <ShowAllProducts
          completeData={completeData.filter(
            (val: any) => val.category === showAllCategory
          )}
          categoryName={showAllCategory}
          removeShowAll={removeShowAll}
        />
      ) : (
        <>
          {completeData.map((val: any) => (
            <ProductWithCategory data={val} handleShowAll={handleShowAll} />
          ))}
        </>
      )}
    </div>
  );
};

export default HomePage;
