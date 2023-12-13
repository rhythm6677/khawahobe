import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProductList from "../ProductList";
import { getCartProducts, getOrders, getProducts, getRestaurant, getTables, getWishistProducts, loginConsumer } from "../../services/apiService";
import { setCartProductsData, setOrdersData, setProductsData, setRestaurantWifiPass, setRestaurantsTables, setWishlistProductsData } from "../../redux/homeSlice";
import { toast } from "react-toastify";
import WishlistPage from "./WishListPage";
import CartPage from "./CartPage";
import { setUserIsLoggedIn, updateConsumerLoginState } from "../../redux/authSlice";
import ProgressPage from "../Progress";
import LoginPage from "../Login";
import OrderList from "../OrderList";

const getUserData = state => state.auth;

function HomeConsumer() {

    const dispatch = useDispatch();
    const userData = useSelector(getUserData);

    const params = new URLSearchParams(window.location.search);

    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        if (localStorage.getItem("emailConsumer")) {
            loginTry();
        } else {
            dispatch(setUserIsLoggedIn(false));
        }
        async function loginTry() {
            try {
                const response = await loginConsumer(
                    localStorage.getItem("emailConsumer"),
                    localStorage.getItem("passwordConsumer"),
                );
                if (response) {
                    localStorage.setItem("emailConsumer", response.data.email);
                    localStorage.setItem("passwordConsumer", response.data.password);
                    localStorage.setItem("nameConsumer", response.data.name);
                    dispatch(updateConsumerLoginState({
                        loggedIn: true,
                        email: response.data.email,
                        password: response.data.password,
                        name: response.data.name
                    }));
                } else {
                    dispatch(setUserIsLoggedIn(false));
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchProductsList(params.get("restaurantId"));
    }, []);

    const fetchProductsList = async (resId) => {
        var response = await getProducts(resId ?? userData.restaurantId);
        if (response) {
            dispatch(setProductsData(response.data));
        } else {
            toast.warn("No products found");
        }
    }

    const fetchCartsList = async () => {
        var response = await getCartProducts(userData.email, userData.password);
        if (response) {
            dispatch(setCartProductsData(response.data));
        } else {
            toast.warn("No products found");
        }
    }

    const fetchWishListsList = async () => {
        var response = await getWishistProducts(userData.email, userData.password);
        if (response) {
            dispatch(setWishlistProductsData(response.data));
        } else {
            toast.warn("No products found");
        }
    }

    const fetchOrdersList = async (resId) => {
        var response = await getOrders(resId ?? userData.restaurantId);
        if (response) {
            dispatch(setOrdersData(response.data.filter(it=>it.email == userData.email)));
        } else {
            // toast.warn("No oders found");
        }
    }


    const fetchTablesList = async (resId) => {
        var response = await getTables(resId ?? userData.restaurantId);
        if (response) {
            console.log(response.data);
            dispatch(setRestaurantsTables(response.data));
        } else {
            // toast.warn("No oders found");
        }
    }

    const fetchRestaurantData = async (resId) => {
        var response = await getRestaurant(resId ?? userData.restaurantId);
        if (response) {
            console.log(response.data);
            dispatch(setRestaurantWifiPass(response.data.wifiPass));
        } else {
            // toast.warn("No oders found");
        }
    }

    return (
        userData.loggedIn == null ?
            <ProgressPage /> :
            userData.loggedIn === false ?
                <LoginPage /> :
                <div data-theme="light" className="w-full h-full">
                    <div className="flex flex-row items-center justify-between w-full">
                        <h1 className="flex-grow text-center text-3xl">Hi, {userData.name}</h1>
                        <button className="btn m-4 btn-primary" onClick={() => {
                            localStorage.clear();
                            dispatch(setUserIsLoggedIn(false));
                        }}>Logout</button>
                    </div>
                    <div className="navbar bg-base-100 flex justify-center" >
                        <div className="navbar-center">
                            <ul className="menu menu-horizontal px-1">
                                <li>
                                    <a className={`p-2 ${currentPage === 0 ? 'bg-primary text-white' : ''}`} onClick={() => {
                                        setCurrentPage(0);
                                        fetchProductsList();
                                    }}>All Products</a>
                                </li>
                                <li>
                                    <a className={`p-2 ${currentPage === 1 ? 'bg-primary text-white' : ''}`} onClick={() => {
                                        setCurrentPage(1);
                                        fetchTablesList();
                                        fetchCartsList();
                                        fetchRestaurantData();
                                    }}>Cart</a>
                                </li>
                                <li>
                                    <a className={`p-2 ${currentPage === 2 ? 'bg-primary text-white' : ''}`} onClick={() => {
                                        setCurrentPage(2);
                                        fetchWishListsList();
                                    }}>Wishlist</a>
                                </li>
                                <li>
                                    <a className={`p-2 ${currentPage === 3 ? 'bg-primary text-white' : ''}`} onClick={() => {
                                        setCurrentPage(3);
                                        fetchOrdersList();
                                    }}>Orders</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {
                        currentPage == 0 ?
                            <ProductList /> :
                            currentPage == 1 ?
                                <CartPage /> :
                                currentPage == 2 ?
                                    <WishlistPage /> :
                                    <OrderList />
                    }
                </div>
    );
}

export default HomeConsumer