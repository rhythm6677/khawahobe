import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart, placeOrder, removeProductFromCart } from '../../services/apiService';
import { setCartProductsData, setRestaurantsTables } from '../../redux/homeSlice';
import { FILES_BASE_URL } from '../../utils/constants';
import { toast } from 'react-toastify';

const getCartProducts = state => state.home.cartItems;
const getTables = state => state.home.tables;
const getWifiPass = state => state.home.wifiPass;
const getUserData = state => state.auth;

const CartPage = () => {
    const dispatch = useDispatch();

    const [selectedOption, setSelectedOption] = useState(""); // Set initial selected value

    const handleButtonClick = (tableItem) => {
        if (selectedOption == tableItem) {
            setSelectedOption(""); // Deselect if already selected
        } else {
            setSelectedOption(tableItem); // Select the clicked table
        }
    };

    const wifiPass = useSelector(getWifiPass);
    const products = useSelector(getCartProducts);
    const tables = useSelector(getTables);
    const userData = useSelector(getUserData);

    return (
        <div className='w-full h-full'>
            <dialog id="my_modal_4" className="modal">
                <div className="modal-box w-1/2 max-w-5xl">
                    <h3 className="font-bold text-lg">Click to copy the wifi pass : </h3>
                    <p className="py-4">{wifiPass}</p>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button, it will close the modal */}
                            <button className="btn" onClick={() => {
                                navigator.clipboard.writeText(wifiPass); // Copy wifiPass to clipboard
                            }}>Copy</button>
                        </form>
                    </div>
                </div>
            </dialog>
            <div className="flex flex-row items-center justify-between w-full">
                <h2 className='m-4 text-2xl text-center font-bold'>Products</h2>
                <button className="btn m-4 btn-primary" onClick={async () => {
                    var response = await placeOrder(userData.email, userData.password, userData.restaurantId, "0", selectedOption);
                    if (response) {
                        dispatch(setCartProductsData([]));
                        dispatch(setRestaurantsTables([]));
                        document.getElementById('my_modal_4').showModal()
                        toast.success("Successfully Placed Order");
                    } else {
                        toast.warn("No products found");
                    }
                }}>Order Now</button>
            </div>
            Select Table :
            {tables ? (
                <div className="grid grid-cols-3 gap-4">
                    {tables.map((tableItem, index) => (
                        <button
                            key={index}
                            onClick={() => handleButtonClick(tableItem)}
                            className={`btn ${selectedOption === tableItem ? 'btn-primary' : 'btn-secondary'}`}>
                            {tableItem.name}
                        </button>
                    ))}
                </div>
            ) : null}
            {products.length != 0 ?
                <ul>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                        {products.map((product) => (
                            <div key={product._id} className="card w-auto bg-base-100 shadow-xl m-2">
                                <div className="card-body">
                                    <figure>
                                        <img className='w-full' src={`${FILES_BASE_URL}/${product.imagePath}`} alt="Shoes" /></figure>
                                    <p>{product.shortDescription}</p>
                                    <p>Price: {product.price}</p>
                                    <div className="flex flex-row justify-end">
                                        <button
                                            onClick={async (c_event) => {
                                                c_event.preventDefault();
                                                var resp = await removeProductFromCart(userData.email, userData.password, product._id);
                                                if (resp) {
                                                    dispatch(setCartProductsData(resp.data));
                                                    toast.success("Added To Cart");
                                                } else {
                                                    toast.error("Failed to add to cart");
                                                }
                                            }}
                                            className="m-1 btn btn-sm btn-outline btn-error">Remove From Cart</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ul> :
                <div className="w-full h-1/2 flex items-center justify-center text-center">
                    <div className="max-w-md">
                        <h1 className="text-1xl font-bold">No Products Found</h1>
                    </div>
                </div>
            }
        </div>
    );
};

export default CartPage;
