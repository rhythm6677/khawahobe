import { useDispatch, useSelector } from "react-redux";
import { setUserIsLoggedIn, updateAdminLoginState, updateLoginState } from "../../redux/authSlice";
import { useEffect, useRef, useState } from "react";
import { getAllOrders, getOrders, getProducts, getRestaurants, loginAdmin, loginUser } from "../../services/apiService";
import { setOrdersData, setProductsData, setRestaurantsData } from "../../redux/homeSlice";
import { toast } from "react-toastify";
import ProgressPage from "../Progress";
import LoginPage from "../Login";
import AddRestaurant from "./AddRestaurant";
import Restaurants from "./Restaurants";
import SellingReport from "./SellingReport";
import OrdersAdmin from "./OrdersAdmin";

const getUserData = state => state.auth;

function HomeAdmin() {
    const dispatch = useDispatch();

    const userData = useSelector(getUserData);

    const [currentPage, setCurrentPage] = useState(0);

    const drawerToggleRef = useRef(null);

    const hideDrawer = () => {
        drawerToggleRef.current.checked = false;
    }

    const fetchOrdersList = async (resId) => {
        var response = await getAllOrders();
        if (response) {
            dispatch(setOrdersData(response.data));
        } else {
            // toast.warn("No oders found");
        }
    }


    const fetchRestaurantsList = async (resId) => {
        var response = await getRestaurants();
        if (response) {
            dispatch(setRestaurantsData(response.data));
        } else {
            // toast.warn("No oders found");
        }
    }

    useEffect(() => {
        if (localStorage.getItem("emailAdmin")) {
            loginTry();
        } else {
            dispatch(setUserIsLoggedIn(false));
        }
        async function loginTry() {
            try {
                const response = await loginAdmin(
                    localStorage.getItem("emailAdmin"),
                    localStorage.getItem("passwordAdmin"),
                );
                if (response) {
                    localStorage.setItem("emailAdmin", response.data.email);
                    localStorage.setItem("passwordAdmin", response.data.password);
                    localStorage.setItem("nameAdmin", response.data.name);
                    dispatch(updateAdminLoginState({
                        loggedIn: true,
                        email: response.data.email,
                        password: response.data.password,
                        name: response.data.name,
                    }));
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
                                    <AddRestaurant /> :
                                    currentPage == 1 ?
                                        <Restaurants /> :
                                        currentPage == 2 ?
                                            <SellingReport /> :
                                            <OrdersAdmin />
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
                                }}>Add Restaurants</a>
                            </li>
                            <li>
                                <a className={`p-2 ${currentPage === 1 ? 'bg-primary text-white' : ''}`} onClick={() => {
                                    setCurrentPage(1);
                                    hideDrawer();
                                    fetchRestaurantsList();
                                }}>View Restaurants</a>
                            </li>
                            <li>
                                <a className={`p-2 ${currentPage === 2 ? 'bg-primary text-white' : ''}`} onClick={() => {
                                    setCurrentPage(2);
                                    hideDrawer();
                                    fetchRestaurantsList();
                                    fetchOrdersList();
                                }}>Selling Report</a>
                            </li>
                            <li>
                                <a className={`p-2 ${currentPage === 3 ? 'bg-primary text-white' : ''}`} onClick={() => {
                                    setCurrentPage(3);
                                    hideDrawer();
                                    fetchOrdersList();
                                }}>Order Management</a>
                            </li>
                        </ul>
                    </div>
                </div>
    );
}

export default HomeAdmin