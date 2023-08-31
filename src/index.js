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
import ItemForm from "./components/forms/ItemForm.js";
import Orders from "./components/Orders.js";

const App = () => {
    const [user, setUser] = useState({});
    const [userToken, setUserToken] = useState(window.localStorage.getItem("token"));
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(window.localStorage.getItem("token")));
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [sizes, setSizes] = useState([]);

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
            const response = await axios.get("/api/items", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`
                }
            });
            if (response.data.success) setItems(response.data.items);
        } catch (error) {
            console.error(error);
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

    const getSizes = async () => {
        try {
            const response = await axios.get("/api/sizes");
            if (response.data.success) setSizes(response.data.sizes);
        } catch (error) {
            console.error(error);
        };
    };

    useEffect(() => {
        getItems();
        getCategories();
        getSizes();
    }, []);

    useEffect(() => {
        getUserData();
    }, [userToken]);

    return (
        <>
            <Header
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                setUserToken={setUserToken}
            />
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
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                        setUserToken={setUserToken}
                    />}
                />
                <Route path="/shirts" element={
                    <Products
                        items={items}
                        setItems={setItems}
                        getItems={getItems}
                        categories={categories}
                        user={user}
                        userToken={userToken}
                    />}
                />
                <Route path="/cart" element={
                    <Cart
                        userToken={userToken}
                        user={user}
                    />}
                />
                <Route path="/shirts/:itemName" element={
                    <ItemDetails
                        userToken={userToken}
                        user={user}
                        isLoggedIn={isLoggedIn}
                        sizes={sizes}
                    />}
                />
                <Route path="/shirts/new" element={
                    <ItemForm
                        userToken={userToken}
                        categories={categories}
                        getCategories={getCategories}
                        user={user}
                        sizes={sizes}
                    />}
                />
                <Route path="/shirts/edit/:itemId" element={
                    <ItemForm
                        userToken={userToken}
                        categories={categories}
                        getCategories={getCategories}
                        user={user}
                        sizes={sizes}
                    />}
                />
                <Route path="/previous_orders" element={
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