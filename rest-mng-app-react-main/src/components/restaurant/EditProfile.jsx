import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLoginState } from '../../redux/authSlice';
import { updateUser } from '../../services/apiService';
import { toast } from 'react-toastify';

const getUserData = state => state.auth;

const EditProfile = () => {
    const dispatch = useDispatch();

    const userData = useSelector(getUserData);

    const [formData, setFormData] = useState({
        name: userData.name,
        wifiPass: userData.wifiPass,
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.name == "" || formData.wifiPass == "") {
            toast.error("Restaurant Name Cannot Be Empty");
            return;
        }
        const response = await updateUser(userData.email, userData.password, formData.name, formData.wifiPass);
        if (response.data) {
            localStorage.setItem("name", response.data.name);
            localStorage.setItem("wifiPass", response.data.wifiPass);
            dispatch(updateLoginState({
                loggedIn: true,
                email: response.data.email,
                password: response.data.password,
                name: response.data.name,
                restaurantId: response.data.restaurantId,
                wifiPass: response.data.wifiPass
            }));
            toast.success("Successfully Updated Profile");
        } else {
            toast.error(response.error.message);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <h1 className="m-4 text-2xl text-center font-bold">Update Restaurant Profile</h1>
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
                placeholder="Wifi Password"
                name="wifiPass"
                value={formData.wifiPass}
                onChange={handleInputChange}
            />
            <button className="btn m-4 btn-primary" onClick={handleSubmit}>Update</button>
        </div>
    );
};

export default EditProfile;
