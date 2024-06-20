import axios from "axios";
import { createContext, useEffect, useState } from "react";
export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItem] = useState({})
    const url = "http://localhost:4000"

    const [token,setToken] = useState("")

    const [food_list,setFoodList] = useState([])


    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItem((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }
    const removeFromCart = async (itemId) => {
        setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))

        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }

    // useEffect(()=>{
    //     console.log(cartItems)
    // },[cartItems])
    const getTotalCartAmount = () => {
        let TotalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item)
                TotalAmount += itemInfo.price * cartItems[item];
            }
        }
        return TotalAmount;
    }

    const fetchfoofList = async () =>{
        const response = await axios.get(url+"/api/food/list")
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) =>{
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItem(response.data.cartData)
    }



    useEffect(()=>{
       
        async function loadData(){
            await fetchfoofList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])



    const contextValue = {
        food_list,
        cartItems,
        setCartItem,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider