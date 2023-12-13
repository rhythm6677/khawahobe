import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrderItem from './OrderItem';

const getOrders = state => state.home.orderItems;
const getIsConsumer = state => state.auth.isCustomer;
const getUserData = state => state.auth;

const OrdersAdmin = () => {
    const dispatch = useDispatch();

    const orders = useSelector(getOrders);
    const isConsumer = useSelector(getIsConsumer);
    const userData = useSelector(getUserData);

    return (
        <div className='w-full h-full'>
            <h2 className='m-4 text-2xl text-center font-bold'>Orders</h2>
            {orders.length !== 0 ? (
                <ul className='flex flex-col'>
                    {orders.map(order => (
                        <OrderItem order={order} key={order._id} />
                    ))}
                </ul>
            ) : (
                <div className="w-full h-1/2 flex items-center justify-center text-center">
                    <div className="max-w-md">
                        <h1 className="text-1xl font-bold">No Orders Found</h1>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersAdmin;
