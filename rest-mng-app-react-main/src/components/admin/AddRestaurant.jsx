import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { addRestaurant } from '../../services/apiService';


const AddRestaurant = () => {

    const filePickerRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        imageFile: null,
        shortDescription: '',
        description: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, imageFile: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.name == "" || formData.price == "" || formData.imageFile == null) {
            toast.error("Name, Price and Image Cannot Be Empty");
            return;
        }
        try {
            const response = await addRestaurant(
                formData.name,
                formData.email,
                formData.password,
                formData.imageFile,
                formData.shortDescription,
                formData.description,
            );
            if (response.data) {
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    imageFile: null,
                    shortDescription: '',
                    description: ''
                });
                filePickerRef.current.value = null;
                toast.success("Successfully added restaurant.");
            } else {
                toast.error("Failed to add restaurant.");
            }
        } catch (error) {
            toast.error("Failed to add product.");
            console.error('Error creating product:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="m-4 text-2xl text-center font-bold">Add Restaurants</h1>
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
        </form>
    );
};

export default AddRestaurant;
