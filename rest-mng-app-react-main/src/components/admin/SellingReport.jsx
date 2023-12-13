import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FILES_BASE_URL } from '../../utils/constants';
import { deleteRestaurant } from '../../services/apiService';
import { setRestaurantsData } from '../../redux/homeSlice';

const getOrders = state => state.home.orderItems;
const getRestaurants = state => state.home.restaurants;
const getIsConsumer = state => state.auth.isCustomer;
const getUserData = state => state.auth;

const SellingReport = () => {
    const dispatch = useDispatch();

    const orders = useSelector(getOrders);
    const restaurants = useSelector(getRestaurants);
    const isConsumer = useSelector(getIsConsumer);
    const userData = useSelector(getUserData);

    console.log(orders)

    return (
        <div className='w-full h-full'>
            <h2 className='m-4 text-2xl text-center font-bold'>Selling Report</h2>
            {restaurants.length != 0 ?
                <ul className='space-y-4'>
                    {restaurants.map((product) => (
                        <li key={product._id} className="bg-base-100 shadow-xl p-4">
                            <div className="card-body flex flex-row items-center">
                                <figure>
                                    <img className='w-32 h-32' src={`${FILES_BASE_URL}/${product.imagePath}`} alt="Shoes" />
                                </figure>
                                <div className='flex flex-col m-4'>
                                    <h2 className="card-title">
                                        {product.name}
                                    </h2>
                                    <p>{product.shortDescription}</p>
                                </div>
                                <div className='flex flex-col m-4 justify-center items-center'>
                                    <h2 className="card-title text-6xl m-4">
                                        {orders ? orders.filter(item => item.restaurantId == product.restaurantId).length : 0}
                                    </h2>
                                    <h2 className="card-title">
                                        Total Orders
                                    </h2>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                :
                <div className="w-full h-1/2 flex items-center justify-center text-center">
                    <div className="max-w-md">
                        <h1 className="text-1xl font-bold">No Products Found</h1>
                    </div>
                </div>
            }
        </div>
    );
};

export default SellingReport;
