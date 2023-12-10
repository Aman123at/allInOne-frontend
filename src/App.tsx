import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminHome from "./pages/Admin/AdminHome";
import AdminLogin from "./pages/Admin/AdminLogin";
import HomePage from "./pages/User/HomePage";
import Login from "./pages/User/Login";
import Signup from "./pages/User/Signup";
import { getLoader, setLoader } from "./slices/commonSlice";
import Loader from "./utils/Loader";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUser } from "./ApiCalls/userApis";
import { setUser } from "./slices/userSlice";
import CartPage from "./pages/User/CartPage";
import OrderPage from "./pages/User/OrderPage";
import ProductDetails from "./pages/User/ProductDetails";
import Checkout from "./pages/User/Checkout";
import OrderDetails from "./pages/User/OrderDetails";
function App() {
  const loaderState = useSelector(getLoader);
  const dispatch = useDispatch();
  // const [darkMode, setDarkMode] = useState<Boolean>(false)
  // const handleDarkMode = () => {
  //   if (localStorage.theme === 'dark') {
  //     document.documentElement.classList.remove('dark')
  //     localStorage.removeItem('theme')

  //   } else {
  //     document.documentElement.classList.add('dark')
  //     localStorage.theme = 'dark'

  //   }

  //   console.log(document.documentElement.classList.length)
  // }

  // if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  //   document.documentElement.classList.add('dark')

  // } else {
  //   document.documentElement.classList.remove('dark')

  // }
  // console.log(document.documentElement.classList.length)

  useEffect(() => {
    let doc: any = document;
    if (loaderState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
    if (loaderState) {
      window.addEventListener("wheel", () => disableBodyScroll(doc));
    } else {
      window.addEventListener("wheel", () => enableBodyScroll(doc));
    }
  }, [loaderState]);

  return (
    <div>
      {loaderState && <Loader />}
      <div className="relative">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          // toastClassName="toast-notification-wrap"
        />
      </div>
    </div>
  );
}

export default App;
