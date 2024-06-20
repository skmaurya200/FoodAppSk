import React, { useContext, useEffect, useState } from 'react'
import "./MyOrders.css"
import {StoreContext} from "../../Contest/StoreContext"
import axios from 'axios'
import {assets} from "../../assets/assets";
import {toast } from 'react-toastify';
const MyOrders = () => {

    const {url,token} = useContext(StoreContext)
    const [data,setData] = useState([]);

    const fatchOrders = async () => {
        const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}})
        setData(response.data.data);

    }

    useEffect(()=>{
        if(token){
            fatchOrders();
            toast.success("Order PLaced");
        }
    },[token])



  return (
    <div className='my-orders'>
        <h2>My Orders</h2>
        <div className="container">
            {data.map((order,index)=>{
                return (
                    <div key={index} className='my-orders-order' >
                        <img src={assets.parcel_icon} alt="" />
                        <p>{order.items.map((item,index)=>{
                            if(index === order.items.length-1){
                                return item.name+" x "+item.quantity
                            }else{
                                return item.name+" x "+item.quantity+", "
                            }
                        })}</p>
                        <p>${order.amount}.00</p>
                        <p>items: {order.items.length}</p>
                        <p><span>&#x25cf;</span> <b>{order.stetus}</b></p>
                        <button onClick={fatchOrders}>Track Order</button>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default MyOrders
