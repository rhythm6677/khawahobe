import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addRestaurantTable } from '../../services/apiService';
import { setRestaurantsTables } from '../../redux/homeSlice';

const getUserData = state => state.auth;

const AddTable = () => {

    const dispatch = useDispatch();

    const userData = useSelector(getUserData);

    const [formData, setFormData] = useState({
        name: '',
        num: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.name == "" && formData.num == "") {
            toast.error("Name Cannot Be Empty");
            return;
        }
        try {
            const response = await addRestaurantTable(
                userData.restaurantId,
                formData.name,
                formData.num,
            );
            if (response.data) {
                setFormData({
                    name: '',
                    num: '',
                });
                dispatch(setRestaurantsTables(response.data.tables));
                toast.success("Successfully added table.");
            } else {
                toast.error(response.error.message);
            }
        } catch (error) {
            toast.error("Failed to add table.");
            console.error('Error creating table:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="m-4 text-2xl text-center font-bold">Add Tables</h1>
            <input
                className="input m-4 input-bordered input-primary w-full max-w-xs"
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
            />
            <input
                className="input m-4 input-bordered input-primary w-full max-w-xs"
                type="text"
                placeholder="Table No"
                name="num"
                value={formData.num}
                onChange={handleInputChange}
            />
            <button className="btn m-4 btn-primary" type="submit">Submit</button>
        </form>
    );
};

export default AddTable;
