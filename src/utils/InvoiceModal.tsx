import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getInvoiceDetails } from "../slices/checkoutSlice";

import { setLoader } from "../slices/commonSlice";
import './InvoiceModal.css';
import jsPDF from 'jspdf';
import { useNavigate } from "react-router-dom";

const InvoiceModal = () => {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const reportTemplateRef:any = useRef(null);
  const invoice:any = useSelector(getInvoiceDetails)
  console.log("Invoice",invoice)

  const handleGeneratePdf = () => {
		
    const doc = new jsPDF('portrait', 'pt', 'a4')

		

		doc.html(reportTemplateRef.current, {
			async callback(doc) {
				await doc.save('Invoice');
			},
		});
	};
  
const getSubTotal=()=>{
    let total:number = 0

    if(invoice && invoice.products){
        invoice.products.map((val:any)=>{
            total += Number(val.productPrice)* Number(val.quantity)
        })
    }
    return total
}



  
  
  
  return (
    <div
      className="flex flex-col justify-center m-10"
      
    >
      <div className="flex space-x-2 justify-center">
  <button
  onClick={handleGeneratePdf}
    type="button"
    data-mdb-ripple="true"
    data-mdb-ripple-color="light"
    className="inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
  >Download Invoice</button>
  <button
  onClick={()=>{
    navigate("/order")
  }}
    type="button"
    data-mdb-ripple="true"
    data-mdb-ripple-color="light"
    className="inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out"
  >Back To Orders</button>
</div>

<div ref={reportTemplateRef}>
<div>
    <header className="clearfix">
      
      <h1>INVOICE </h1>
      <div id="project" className="clearfix" style={{marginLeft:'10px'}} >
        <div>All In One</div>
        <div>Bengaluru,<br /> India</div>
        
        <div><a href="#">allinone@gmail.com</a></div>
      </div>
      
    </header>
    <main style={{width:'600px'}}>
      <table>
        <thead>
          <tr>
       
            <th className="desc">PRODUCT</th>
            <th>PRICE</th>
            <th>QTY</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
            {invoice && invoice.products && invoice.products.map((items:any,key:number)=>

          <tr>
            
            <td className="desc">{items.productName}</td>
            <td className="unit">Rs.{items.productPrice}</td>
            <td className="qty">{items.quantity}</td>
            <td className="total">Rs.{Number(items.productPrice)* Number(items.quantity)}</td>
          </tr>
            )}
          
         
          
          <tr>
            <td colSpan={3}>SUBTOTAL</td>
            <td className="total">Rs.{getSubTotal()}</td>
          </tr>
          <tr>
            <td colSpan={3}>SHIPPING</td>
            <td className="total">Rs.{invoice&&invoice.shippingCharge ? invoice.shippingCharge : 0}</td>
          </tr>
          <tr>
            <td colSpan={3} className="grand total">GRAND TOTAL</td>
            <td className="grand total">Rs.{invoice&&invoice.shippingCharge ? getSubTotal()+invoice.shippingCharge:0}</td>
          </tr>
        </tbody>
      </table>
      
    </main>
    
  </div>
</div>
    </div>
  );
};

export default InvoiceModal;
