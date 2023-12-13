import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FILES_BASE_URL } from '../utils/constants';
import { addProductToCart, addProductToWishist, deleteProduct } from '../services/apiService';
import { setCartProductsData, setProductsData, setWishlistProductsData } from '../redux/homeSlice';
import { toast } from 'react-toastify';

const getProducts = state => state.home.products;
const getIsConsumer = state => state.auth.isCustomer;
const getUserData = state => state.auth;

const ProductList = () => {
    const dispatch = useDispatch();

    const products = useSelector(getProducts);
    const isConsumer = useSelector(getIsConsumer);
    const userData = useSelector(getUserData);

    return (
        <div className='w-full h-full'>
            <h2 className='m-4 text-2xl text-center font-bold'>Products</h2>
            {products.length != 0 ?
                <ul>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                        {products.map((product) => (
                            <div key={product._id} className="card w-auto bg-base-100 shadow-xl m-2">
                                <div className="card-body">
                                    <figure>
                                        <img className='w-full' src={`${FILES_BASE_URL}/${product.imagePath}`} alt="Shoes" /></figure>
                                    <h2 className="card-title">
                                        {product.name}
                                        <div className="badge badge-secondary">NEW</div>
                                    </h2>
                                    <p>{product.shortDescription}</p>
                                    <p>Price: {product.price}</p>
                                    {isConsumer ?
                                        <div className="flex flex-row justify-end">
                                            <button
                                                onClick={async (c_event) => {
                                                    c_event.preventDefault();
                                                    var resp = await addProductToCart(userData.email, userData.password, product._id.toString());
                                                    if (resp) {
                                                        dispatch(setCartProductsData(resp.data));
                                                        toast.success("Added To Cart");
                                                    } else {
                                                        toast.error("Failed to add to cart");
                                                    }
                                                }}
                                                className="m-1 btn btn-sm btn-outline btn-error">Add To Cart</button>
                                            <button 
                                                onClick={async (c_event) => {
                                                    c_event.preventDefault();
                                                    var resp = await addProductToWishist(userData.email, userData.password, product._id.toString());
                                                    if (resp) {
                                                        dispatch(setWishlistProductsData(resp.data));
                                                        toast.success("Added To Wishlist");
                                                    } else {
                                                        toast.error("Failed to add to Wishlist");
                                                    }
                                                }} className="m-1 btn btn-sm btn-outline btn-info"> Add To Wishlist</button>
                                        </div> :
                                        <div className="flex flex-row justify-end">
                                            <button
                                                onClick={async (c_event) => {
                                                    c_event.preventDefault();
                                                    var resp = await deleteProduct(product._id);
                                                    if (resp) {
                                                        dispatch(setProductsData(products.filter(value => value != product)));
                                                        toast.success("Deleted product");
                                                    } else {
                                                        toast.error("Failed to delete");
                                                    }
                                                }}
                                                className="m-1 btn btn-sm btn-outline btn-error">Delete</button>
                                            {/* <button className="m-1 btn btn-sm btn-outline btn-info">Edit</button> */}
                                        </div>
                                    }
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

export default ProductList;
