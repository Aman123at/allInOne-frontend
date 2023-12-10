import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllOrders } from "../../ApiCalls/orderApis";
import { fetchProducts } from "../../ApiCalls/productApis";
import { fetchUser } from "../../ApiCalls/userApis";
import { setLoader } from "../../slices/commonSlice";
import { getOrdersFromState } from "../../slices/orderSlice";
import { getAllProducts } from "../../slices/productSlice";
// import { getAllOrders } from "../../ApiCalls/orderApis";
import { getLoggedInUser } from "../../slices/userSlice";
import Header from "./Header";

const OrderPage=() =>{
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const loggedInUser: any = useSelector(getLoggedInUser);
  const { status, data } = useSelector(getOrdersFromState);
  const allProducts = useSelector(getAllProducts)
  console.log("Orders Data>>",data)
  console.log("Products Data>>",allProducts.data)
  setTimeout(() => {
    if (loggedInUser === null) {
      navigate("/login");
    }
  }, 200);
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
  }, [allProducts.status]);
  useEffect(() => {
    if (loggedInUser.status === "idle") {
      dispatch(fetchUser());
    }
    if (loggedInUser.status === "error") {
      navigate("/");
    }
  }, [loggedInUser.status]);
  useEffect(() => {
    let loggedIndata = loggedInUser.data;

    
      let loggedUserId = loggedIndata.user ? loggedIndata.user._id : "";
    if (status === "idle") {
      dispatch(setLoader(true));
      dispatch(getAllOrders());
    }
    if (status === "error") {
      dispatch(setLoader(false));
      toast.error(
        "Something Gone Wrong While Fetching Orders, Please reload the page.",
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
  const getImageUrlFromProductId=(productId:String)=>{
    let allProdData:any = allProducts.data
    let productfound = allProdData.products.filter((val:any)=>val._id===productId)
    if(productfound){
      return productfound[0].images[0].secure_url
    }
    else{
      return " "
    }
  }

  const getFormattedDate=(date:any)=>{
    let datearr = date.split(" ")
    let newarr = []
    newarr.push(datearr[1])
    newarr.push(datearr[0])
    newarr.push(datearr[2])

    return newarr.join(" ")

  }
  return (<div>
    <Header />
    <div className="  mx-2 w-full">
      {/* individual card start */}
      <div className="m-4 flex items-center justify-center flex-wrap overflow-y-scroll scrollbar-hide">
          {data && data.orders && data.orders.length > 0 ? (
            data.orders.map((items: any, i: number) => (
              <div key={i} className=" mx-4 -my-2">
  <div className="block rounded-lg shadow-lg bg-white max-w-sm text-center">
    <div className="py-3 px-6 border-b border-gray-300">
      Order ID - <b>{items.order_id}</b>
    </div>
    <div className="p-6">
      <h5 className="text-gray-900 text-xl font-medium mb-2">{items.products?.length} Products</h5>
      <div className="flex items-center mx-4 flex-wrap my-2">
        {items.products && items.products.map((value:any,i:number)=>
        
        <img key={i} className="w-20 h-20 rounded" src={getImageUrlFromProductId(value.productId)} />
        )}
       
      </div>
      <p className="text-gray-700 text-base mb-4">
        Order Status - <b>{items.status && items.status[0].state}</b>
      </p>
      <button type="button"
      onClick={()=>navigate(`/order/${items._id}`)}
      className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Check Details</button>
    </div>
    <div className="py-3 px-6 border-t border-gray-300 text-gray-600">
      Order Placed - {getFormattedDate(items.createdAt)}
    </div>
    <div className="py-3 px-6 border-t border-gray-300 text-gray-600">
      Expected Delivery - <b>{getFormattedDate(items.expectedDelivery)}</b> 
    </div>
  </div>
</div>
            ))
          ) : (
            <p className="text-center font-bold text-lg">No Orders</p>
          )}
        </div>
      {/* individual card end */}
    </div>
  </div>);
}

export default OrderPage;
