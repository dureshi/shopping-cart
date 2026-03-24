import { use, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Root() {
    const [itemsInCart, setItemsInCart] = useState([]);

    console.log(itemsInCart);
    return (
        <div className="cotainer">
            <div className="navigation">
                <NavLink to={"/"}>Home</NavLink>
                <NavLink to={"shop"}>Shop</NavLink>
                <div className="cart">
                <NavLink to={"cart"}>Cart</NavLink>
                <p>{itemsInCart.length}</p>
                </div>
            </div>
            <div className="content">
                <Outlet context={{ itemsInCart, setItemsInCart} }/>
            </div>
        </div>
    )
}