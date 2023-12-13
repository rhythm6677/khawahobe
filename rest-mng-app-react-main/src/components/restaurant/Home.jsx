import { useDispatch, useSelector } from "react-redux";
import { setUserIsLoggedIn, updateLoginState } from "../../redux/authSlice";
import { useEffect, useRef, useState } from "react";
import ProductList from "../ProductList";
import AddProduct from "./AddProduct";
import QRCodePage from "./QRCodePage";
import { getOrders, getProducts, loginUser } from "../../services/apiService";
import { setOrdersData, setProductsData, setRestaurantsTables } from "../../redux/homeSlice";
import { toast } from "react-toastify";
import EditProfile from "./EditProfile";
import ProgressPage from "../Progress";
import LoginPage from "../Login";
import OrderList from "../OrderList";
import TableList from "./TableList";

const getUserData = state => state.auth;

function Home() {
    const dispatch = useDispatch();

    const userData = useSelector(getUserData);

    const [currentPage, setCurrentPage] = useState(0);

    const drawerToggleRef = useRef(null);

    const hideDrawer = () => {
        drawerToggleRef.current.checked = false;
    }

    const fetchProductsList = async (resId) => {
        var response = await getProducts(resId ?? userData.restaurantId);
        if (response) {
            dispatch(setProductsData(response.data));
        } else {
            toast.warn("No products found");
        }
    }

    const fetchOrdersList = async (resId) => {
        var response = await getOrders(resId ?? userData.restaurantId);
        if (response) {
            dispatch(setOrdersData(response.data));
        } else {
            // toast.warn("No oders found");
        }
    }

    useEffect(() => {
        if (localStorage.getItem("email")) {
            loginTry();
        } else {
            dispatch(setUserIsLoggedIn(false));
        }
        async function loginTry() {
            try {
                const response = await loginUser(
                    localStorage.getItem("email"),
                    localStorage.getItem("password"),
                );
                if (response) {
                    localStorage.setItem("email", response.data.email);
                    localStorage.setItem("password", response.data.password);
                    localStorage.setItem("name", response.data.name);
                    localStorage.setItem("restaurantId", response.data.restaurantId);
                    dispatch(updateLoginState({
                        loggedIn: true,
                        email: response.data.email,
                        password: response.data.password,
                        name: response.data.name,
                        restaurantId: response.data.restaurantId,
                        wifiPass: response.data.wifiPass,
                    }));
                    fetchProductsList(response.data.restaurantId);
                    dispatch(setRestaurantsTables(response.data.tables));
                } else {
                    dispatch(setUserIsLoggedIn(false));
                }
            } catch (error) {
                console.error(error);
            }
        }
    }, []);

    return (
        userData.loggedIn == null ?
            <ProgressPage /> :
            userData.loggedIn !== true ?
                <LoginPage /> :
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" ref={drawerToggleRef} />
                    <div className="drawer-content flex flex-col items-center justify-center">
                        <div className="flex flex-row items-center justify-between w-full">
                            <label htmlFor="my-drawer-2" className="drawer-button m-4 lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                                </svg>
                            </label>
                            <h1 className="flex-grow text-center text-3xl">Hi, {userData.name}</h1>
                            <button className="btn m-4 btn-primary" onClick={() => {
                                localStorage.clear();
                                dispatch(setUserIsLoggedIn(false));
                            }}>Logout</button>
                        </div>
                        <div className="w-full h-full">
                            {
                                currentPage == 0 ?
                                    <ProductList /> :
                                    currentPage == 1 ?
                                        <AddProduct /> :
                                        currentPage == 2 ?
                                            <QRCodePage /> :
                                            currentPage == 3 ?
                                                <EditProfile /> :
                                                currentPage == 3 ?
                                                    <EditProfile /> :
                                                    currentPage == 4 ?
                                                        <OrderList /> :
                                                        <TableList />
                            }
                        </div>
                    </div>
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                            <li>
                                <a className={`p-2 ${currentPage === 0 ? 'bg-primary text-white' : ''}`} onClick={() => {
                                    setCurrentPage(0);
                                    hideDrawer();
                                    fetchProductsList();
                                }}>All Products</a>
                            </li>
                            <li>
                                <a className={`p-2 ${currentPage === 1 ? 'bg-primary text-white' : ''}`} onClick={() => {
                                    setCurrentPage(1);
                                    hideDrawer();
                                }}>Add Product</a>
                            </li>
                            <li>
                                <a className={`p-2 ${currentPage === 2 ? 'bg-primary text-white' : ''}`} onClick={() => {
                                    setCurrentPage(2);
                                    hideDrawer();
                                }}>Shop QR Code</a>
                            </li>
                            <li>
                                <a className={`p-2 ${currentPage === 3 ? 'bg-primary text-white' : ''}`} onClick={() => {
                                    setCurrentPage(3);
                                    hideDrawer();
                                }}>Edit Profile</a>
                            </li>
                            <li>
                                <a className={`p-2 ${currentPage === 4 ? 'bg-primary text-white' : ''}`} onClick={() => {
                                    setCurrentPage(4);
                                    fetchOrdersList();
                                    hideDrawer();
                                }}>Orders</a>
                            </li>
                            <li>
                                <a className={`p-2 ${currentPage === 5 ? 'bg-primary text-white' : ''}`} onClick={() => {
                                    setCurrentPage(5);
                                    fetchOrdersList();
                                    hideDrawer();
                                }}>Tables</a>
                            </li>
                        </ul>
                    </div>
                </div>
    );
}

export default Home