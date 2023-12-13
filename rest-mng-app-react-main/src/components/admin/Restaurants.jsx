import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FILES_BASE_URL } from '../../utils/constants';
import { activeOrInactiveRest, deleteRestaurant, updateRestaurant } from '../../services/apiService';
import { setRestaurantsData } from '../../redux/homeSlice';

const getProducts = state => state.home.products;
const getRestaurants = state => state.home.restaurants;
const getIsConsumer = state => state.auth.isCustomer;
const getUserData = state => state.auth;

const Restaurants = () => {
    const dispatch = useDispatch();

    const products = useSelector(getProducts);
    const restaurants = useSelector(getRestaurants);
    const isConsumer = useSelector(getIsConsumer);
    const userData = useSelector(getUserData);

    const [formData, setFormData] = useState(null);
    const filePickerRef = useRef(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, imageFile: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.name == "" || formData.price == "") {
            toast.error("Name, Price and Image Cannot Be Empty");
            return;
        }
        try {
            const response = await updateRestaurant(
                formData._id,
                formData.name,
                formData.email,
                formData.password,
                formData.imageFile,
                formData.shortDescription,
                formData.description,
            );
            if (response.data) {
                dispatch(setRestaurantsData(response.data));
                setFormData(null);
                toast.success("Successfully saved restaurant.");
            } else {
                toast.error("Failed to add restaurant.");
            }
        } catch (error) {
            toast.error("Failed to add product.");
            console.error('Error creating product:', error);
        }
    };

    return (
        !formData ?
            <div className='w-full h-full'>
                <h2 className='m-4 text-2xl text-center font-bold'>Restaurants</h2>
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
                                    {isConsumer ?
                                        <div className="flex justify-end">
                                            <button
                                                onClick={async (c_event) => {
                                                    c_event.preventDefault();
                                                    // Add To Cart logic
                                                }}
                                                className="m-1 btn btn-sm btn-outline btn-error">Add To Cart</button>
                                            <button
                                                onClick={async (c_event) => {
                                                    c_event.preventDefault();
                                                    // Add To Wishlist logic
                                                }}
                                                className="m-1 btn btn-sm btn-outline btn-info"> Add To Wishlist</button>
                                        </div> :
                                        <div className="flex justify-end">
                                            <button
                                                onClick={async (c_event) => {
                                                    c_event.preventDefault();
                                                    var resp = await activeOrInactiveRest(product._id);
                                                    if (resp) {
                                                        dispatch(setRestaurantsData(resp.data));
                                                        // toast.success("Success");
                                                    } else {
                                                        toast.error("Failed to delete");
                                                    }
                                                }}
                                                className={product.isActive ? "m-1 btn btn-sm btn-outline btn-error" :
                                                    "m-1 btn btn-sm btn-outline btn-success"}>
                                                {product.isActive ? "Deactivate" : "Activate"}</button>
                                            <button
                                                onClick={async (c_event) => {
                                                    c_event.preventDefault();
                                                    setFormData(product);
                                                }}
                                                className="m-1 btn btn-sm btn-outline btn-info">Edit</button>
                                            <button
                                                onClick={async (c_event) => {
                                                    c_event.preventDefault();
                                                    // Delete logic
                                                    var resp = await deleteRestaurant(product._id);
                                                    if (resp) {
                                                        dispatch(setRestaurantsData(restaurants.filter(value => value != product)));
                                                        toast.success("Deleted restaurant");
                                                    } else {
                                                        toast.error("Failed to delete");
                                                    }
                                                }}
                                                className="m-1 btn btn-sm btn-outline btn-error">Delete</button>
                                        </div>
                                    }
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
            </div> :
            <div className='w-full h-full'>
                <form onSubmit={handleSubmit}>
                    <h1 className="m-4 text-2xl text-center font-bold">Edit Restaurant</h1>
                    <input
                        className="input m-4 input-bordered input-primary w-full max-w-xs"
                        type="text"
                        placeholder="Restaurant Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <input
                        className="input m-4 input-bordered input-primary w-full max-w-xs"
                        type="text"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <input
                        className="input m-4 input-bordered input-primary w-full max-w-xs"
                        type="text"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    <input
                        className="input m-4 input-bordered input-primary w-full max-w-xs"
                        type="text"
                        placeholder="Short Description"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                    />
                    <input
                        className="input m-4 input-bordered input-primary w-full max-w-xs"
                        type="text"
                        placeholder="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                    <input ref={filePickerRef} className="file-input m-4 file-input-bordered file-input-primary w-full max-w-xs" type="file" name="imageFile" onChange={handleFileChange} />
                    <button className="btn m-4 btn-primary" type="submit">Submit</button>
                    <button className="btn m-4 btn-error text-white" onClick={()=>setFormData(null)}>Cancel</button>
                </form>
            </div>
    );
};

export default Restaurants;
