import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllCategory } from "../../ApiCalls/categoryApis";
import { fetchProducts } from "../../ApiCalls/productApis";
import { logout } from "../../ApiCalls/userApis";
import { getAllCategories } from "../../slices/categorySlice";
import { setLoader } from "../../slices/commonSlice";
import { getAllProducts } from "../../slices/productSlice";
import AdminCategory from "./AdminCategory";
import AdminOrder from "./AdminOrder";
import AdminProduct from "./AdminProduct";
import AdminStats from "./AdminStats";

const AdminHome = () => {
  const { status, data } = useSelector(getAllCategories);
  const products = useSelector(getAllProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  useEffect(() => {
    if (!localStorage.getItem("allinone_token")) {
      navigate("/admin");
    }
    if (status === "idle") {
      dispatch(setLoader(true));
      dispatch(getAllCategory());
    } else if (status === "error") {
      toast.error("Something Gone Wrong While Fetching Category", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      dispatch(setLoader(false));
    }
  }, [status]);

  useEffect(() => {
    if (!localStorage.getItem("allinone_token")) {
      navigate("/admin");
    }
    if (products.status === "idle") {
      dispatch(setLoader(true));
      dispatch(fetchProducts());
    } else if (products.status === "error") {
      toast.error("Something Gone Wrong While Fetching Products", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      dispatch(setLoader(false));
    }
  }, [products.status]);
  const handleLogout = () => {
    logout()
      .then((res: any) => {
        localStorage.removeItem("token");
        navigate("/admin");
      })
      .catch((e: any) => alert("something went wrong"));
  };
  return (
    <div>
      <div className="flex justify-end ">
        <button
          onClick={() => handleLogout()}
          className="py-2 rounded bg-red-500 text-white px-2 mr-3 mt-3 hover:cursor-pointer hover:opacity-60"
        >
          Logout
        </button>
      </div>
      <p className="text-center font-semibold text-xl my-4">
        Welcome To Admin Dashboard
      </p>
      <div className="flex items-start">
        <ul
          className="nav nav-tabs flex flex-col flex-wrap list-none border-b-0 pl-0 mr-4"
          id="tabs-tabVertical"
          role="tablist"
        >
          <li className="nav-item flex-grow text-center" role="presentation">
            <a
              href="#tabs-statsVertical"
              className="
                            nav-link
                            block
                            font-medium
                            text-xs
                            leading-tight
                            uppercase
                            border-x-0 border-t-0 border-b-2 border-transparent
                            px-6
                            py-3
                            my-2
                            hover:border-transparent hover:bg-gray-100
                            focus:border-transparent
                            active
                            "
              id="tabs-stats-tabVertical"
              data-bs-toggle="pill"
              data-bs-target="#tabs-statsVertical"
              role="tab"
              aria-controls="tabs-statsVertical"
              aria-selected="true"
            >
              Stats
            </a>
          </li>
          <li className="nav-item flex-grow text-center" role="presentation">
            <a
              href="#tabs-categoryVertical"
              className="
                            nav-link
                            block
                            font-medium
                            text-xs
                            leading-tight
                            uppercase
                            border-x-0 border-t-0 border-b-2 border-transparent
                            px-6
                            py-3
                            my-2
                            hover:border-transparent hover:bg-gray-100
                            focus:border-transparent
                            "
              id="tabs-category-tabVertical"
              data-bs-toggle="pill"
              data-bs-target="#tabs-categoryVertical"
              role="tab"
              aria-controls="tabs-categoryVertical"
              aria-selected="false"
            >
              Category
            </a>
          </li>
          <li className="nav-item flex-grow text-center" role="presentation">
            <a
              href="#tabs-productVertical"
              className="
                            nav-link
                            block
                            font-medium
                            text-xs
                            leading-tight
                            uppercase
                            border-x-0 border-t-0 border-b-2 border-transparent
                            px-6
                            py-3
                            my-2
                            hover:border-transparent hover:bg-gray-100
                            focus:border-transparent
                            "
              id="tabs-product-tabVertical"
              data-bs-toggle="pill"
              data-bs-target="#tabs-productVertical"
              role="tab"
              aria-controls="tabs-productVertical"
              aria-selected="false"
            >
              Product
            </a>
          </li>
          <li className="nav-item flex-grow text-center" role="presentation">
            <a
              href="#tabs-ordersVertical"
              className="
                            nav-link
                            block
                            font-medium
                            text-xs
                            leading-tight
                            uppercase
                            border-x-0 border-t-0 border-b-2 border-transparent
                            px-6
                            py-3
                            my-2
                            hover:border-transparent hover:bg-gray-100
                            focus:border-transparent
                            "
              id="tabs-orders-tabVertical"
              data-bs-toggle="pill"
              data-bs-target="#tabs-ordersVertical"
              role="tab"
              aria-controls="tabs-ordersVertical"
              aria-selected="false"
            >
              Orders
            </a>
          </li>
          <li className="nav-item flex-grow text-center" role="presentation">
            <a
              href="#tabs-analyticsVertical"
              className="
                            nav-link
                            block
                            font-medium
                            text-xs
                            leading-tight
                            uppercase
                            border-x-0 border-t-0 border-b-2 border-transparent
                            px-6
                            py-3
                            my-2
                            hover:border-transparent hover:bg-gray-100
                            focus:border-transparent
                            "
              id="tabs-analytics-tabVertical"
              data-bs-toggle="pill"
              data-bs-target="#tabs-analyticsVertical"
              role="tab"
              aria-controls="tabs-analyticsVertical"
              aria-selected="false"
            >
              Analytics
            </a>
          </li>
        </ul>
        <div
          className="tab-content items-center mx-auto w-full"
          id="tabs-tabContentVertical"
        >
          <div
            className="tab-pane fade show active"
            id="tabs-statsVertical"
            role="tabpanel"
            aria-labelledby="tabs-stats-tabVertical"
          >
            <AdminStats />
          </div>
          <div
            className="tab-pane fade"
            id="tabs-categoryVertical"
            role="tabpanel"
            aria-labelledby="tabs-category-tabVertical"
          >
            <AdminCategory />
          </div>
          <div
            className="tab-pane fade "
            id="tabs-productVertical"
            role="tabpanel"
            aria-labelledby="tabs-product-tabVertical"
          >
            <AdminProduct />
          </div>
          <div
            className="tab-pane fade"
            id="tabs-ordersVertical"
            role="tabpanel"
            aria-labelledby="tabs-orders-tabVertical"
          >
            <AdminOrder />
          </div>
          <div
            className="tab-pane fade"
            id="tabs-analyticsVertical"
            role="tabpanel"
            aria-labelledby="tabs-analytics-tabVertical"
          >
            Coming soon.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
