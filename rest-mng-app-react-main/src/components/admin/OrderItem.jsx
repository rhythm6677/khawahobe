import { useState } from "react";
import { changeOrderStatus } from "../../services/apiService";
import { toast } from "react-toastify";

export default function OrderItem({ order }) {

    const [selectedOption, setSelectedOption] = useState(order.orderStatus ?? 'PLACED'); // Set initial selected value

    // Function to handle radio selection change
    const handleRadioChange = async (event) => {
        var resp = await changeOrderStatus(order._id, event.target.value);
        if (resp) {
            setSelectedOption(event.target.value);
            toast.success("Updated order status to " + event.target.value);
        } else {
            toast.error("Failed to update status");
        }
    };

    return (
        <div key={order._id} className="card w-auto bg-base-100 shadow-xl m-2">
            <div className="card-body">
                <p className='text-bold text-2xl'>Name: {order.name}</p>
                <p>Email: {order.email}</p>
                {/* <p>Restaurant ID: {order.restaurantId}</p> */}
                <p>Total Price: {order.totalPrice}</p>
                <p>Customer ID: {order.customerId}</p>
                <p>Restaurant ID: {order.restaurantId}</p>
                <p>Table Name: {order.tableName}</p>
                <p>Table No: {order.tableId}</p>
                <p>Order Status: {order.orderStatus}</p>
                <h3 className='text-bold text-1xl'>Products:</h3>
                <ul>
                    {order.products.map(product => (
                        <li key={product._id}>
                            <div className="card">
                                <div className="">
                                    <h4 className="">{product.name}</h4>
                                    <p>{product.shortDescription}</p>
                                    <p>Price: {product.price}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className='flex flex-row'>
                    <div className="form-control w-28 me-4">
                        <label className="label cursor-pointer">
                            <span className="label-text">PLACED</span>
                            <input type="radio"
                                name={`status-radio-${order._id}`}
                                value={"PLACED"}
                                className="radio checked:bg-blue-500"
                                checked={selectedOption == 'PLACED'}
                                onChange={handleRadioChange} />
                        </label>
                    </div>
                    <div className="form-control w-28 me-4">
                        <label className="label cursor-pointer">
                            <span className="label-text">PROCESSING</span>
                            <input type="radio"
                                value={"PROCESSING"}
                                name={`status-radio-${order._id}`}
                                className="radio checked:bg-blue-500"
                                checked={selectedOption == 'PROCESSING'}
                                onChange={handleRadioChange} />
                        </label>
                    </div>
                    <div className="form-control w-28 me-4">
                        <label className="label cursor-pointer">
                            <span className="label-text">PREPARING</span>
                            <input type="radio"
                                value={"PREPARING"}
                                name={`status-radio-${order._id}`}
                                className="radio checked:bg-blue-500"
                                checked={selectedOption == 'PREPARING'}
                                onChange={handleRadioChange} />
                        </label>
                    </div>
                    <div className="form-control w-28 me-4">
                        <label className="label cursor-pointer">
                            <span className="label-text">SERVED</span>
                            <input type="radio"
                                value={"SERVED"}
                                name={`status-radio-${order._id}`}
                                className="radio checked:bg-blue-500"
                                checked={selectedOption == 'SERVED'}
                                onChange={handleRadioChange} />
                        </label>
                    </div>
                    <div className="form-control w-28 me-4">
                        <label className="label cursor-pointer">
                            <span className="label-text">COMPLETE</span>
                            <input type="radio"
                                value={"COMPLETE"}
                                name={`status-radio-${order._id}`}
                                className="radio checked:bg-blue-500"
                                checked={selectedOption == 'COMPLETE'}
                                onChange={handleRadioChange} />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}