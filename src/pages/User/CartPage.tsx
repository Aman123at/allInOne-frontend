import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getLoggedInUser } from "../../slices/userSlice";

function CartPage() {
  const navigate = useNavigate();
  const loggedInUser = useSelector(getLoggedInUser);
  setTimeout(() => {
    if (loggedInUser === null) {
      navigate("/login");
    }
  }, 200);
  return <div>CartPage</div>;
}

export default CartPage;
