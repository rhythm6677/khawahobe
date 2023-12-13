import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddTable from './AddTable';
import { deleteTables } from '../../services/apiService';
import { setRestaurantsTables } from '../../redux/homeSlice';
import { toast } from 'react-toastify';

const getOrders = state => state.home.orderItems;
const getTables = state => state.home.tables;
const getUserData = state => state.auth;

const TableList = () => {
    const dispatch = useDispatch();

    const orders = useSelector(getOrders);
    const tables = useSelector(getTables);
    const userData = useSelector(getUserData);

    return (
        <div className='w-full h-full'>
            <h2 className='m-4 text-2xl text-center font-bold'>Tables</h2>
            <AddTable />
            {tables.length != 0 ?
                <ul>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                        {
                            tables.map((product) => (
                                <button
                                    key={product.name}
                                    className={orders.some(item => item.tableName == product.name
                                        && item.restaurantId == userData.restaurantId
                                        && item.orderStatus != "COMPLETE") ?
                                        "btn btn-error" :
                                        "btn btn-outline btn-error"
                                    }
                                    onClick={async () => {
                                        const confirmed = window.confirm('Are you sure you want to delete this item?');
                                        if (confirmed) {
                                            var resp = await deleteTables(userData.restaurantId, product.name, product.num);
                                            if (resp.data) {
                                                toast.success("Deleted");
                                                dispatch(setRestaurantsTables(resp.data));
                                            } else {
                                                toast.error("Failed to delete");
                                            }
                                        }
                                    }}
                                >{product.name}
                                </button>
                            ))
                        }
                    </div>
                </ul>
                :
                <div className="w-full h-1/2 flex items-center justify-center text-center">
                    <div className="max-w-md">
                        <h1 className="text-1xl font-bold">No Tables Found</h1>
                    </div>
                </div>
            }
        </div>
    );
};

export default TableList;
