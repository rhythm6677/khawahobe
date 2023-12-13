import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addProduct } from '../../services/apiService';

const getUserData = state => state.auth;

const AddProduct = () => {

    const filePickerRef = useRef(null);

    const userData = useSelector(getUserData);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
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
            const response = await addProduct(
                formData.name,
                formData.price,
                userData.restaurantId,
                formData.imageFile,
                formData.shortDescription,
                formData.description,
            );
            if (response.data) {
                setFormData({
                    name: '',
                    price: '',
                    restaurantId: '',
                    imageFile: null,
                    shortDescription: '',
                    description: ''
                });
                filePickerRef.current.value = null;
                toast.success("Successfully added product.");
            } else {    
                toast.error(response.error.message);
            }
        } catch (error) {
            toast.error("Failed to add product.");
            console.error('Error creating product:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="m-4 text-2xl text-center font-bold">Add Products</h1>
            <input
                className="input m-4 input-bordered input-primary w-full max-w-xs"
                type="text"
                placeholder="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
            />
            <input
                className="input m-4 input-bordered input-primary w-full max-w-xs"
                type="text"
                placeholder="Price"
                name="price"
                value={formData.price}
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

export default AddProduct;
