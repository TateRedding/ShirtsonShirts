import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./components/Home.js";
import Header from "./components/Header.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import Products from "./components/Products.js";
import Cart from "./components/Cart.js";
import ItemDetails from "./components/ItemDetails.js";
import NewItemForm from "./components/forms/NewItemForm.js";
import EditItemForm from "./components/forms/EditItemForm.js";
import Orders from "./components/Orders.js";

const App = () => {
    const [user, setUser] = useState({});
    const [userToken, setUserToken] = useState(window.localStorage.getItem("token"));
    const [isLoggedIn, setIsLoggedIn] = useState(window.localStorage.getItem("token"));
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);

    const getUserData = async () => {
        if (userToken) {
            try {
                const response = await axios.get(`/api/users/me`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`
                    }
                });
                setUser(response.data.user);
            } catch (error) {
                console.error(error);
            };
        } else {
            setUser({});
        };
    };

    const getItems = async () => {
        try {
            const response = await axios.get("/api/items");
            if (response.data.success) setItems(response.data.items);
        } catch (err) {
            console.error(err)
        };
    };

    const getCategories = async () => {
        try {
            const response = await axios.get("/api/categories");
            if (response.data.success) setCategories(response.data.categories);
        } catch (error) {
            console.error(error);
        };
    };

    useEffect(() => {
        getItems();
        getCategories();
    }, []);

    useEffect(() => {
        getUserData();
    }, [userToken])

    return (
        <>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUserToken={setUserToken} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={
                    <Login
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                        setUserToken={setUserToken}
                    />}
                />
                <Route path="/register" element={
                    <Register
                        setUserToken={setUserToken}
                        setIsLoggedIn={setIsLoggedIn}
                    />}
                />
                <Route path="/products" element={
                    <Products items={items}
                        setItems={setItems}
                        getItems={getItems}
                        categories={categories}
                        user={user}
                        userToken={userToken}
                    />}
                />
                <Route path="/cart" element={
                    <Cart userToken={userToken}
                        user={user}
                    />}
                />
                <Route path="/products/:itemname" element={
                    <ItemDetails
                        userToken={userToken}
                        user={user}
                        isLoggedIn={isLoggedIn}
                    />}
                />
                <Route path="/products/new" element={
                    <NewItemForm
                        userToken={userToken}
                        categories={categories}
                        getCategories={getCategories}
                        user={user} />}
                />
                <Route path="/products/edit/:itemId" element={
                    <EditItemForm
                        userToken={userToken}
                        categories={categories}
                        getCategories={getCategories}
                        user={user} />}
                />
                <Route path="/previousorders" element={
                    <Orders
                        userToken={userToken}
                        user={user}
                    />}
                />
            </Routes >
        </>
    )
}

const root = createRoot(document.getElementById("root"));

root.render(
    <HashRouter>
        <App />
    </HashRouter>
)