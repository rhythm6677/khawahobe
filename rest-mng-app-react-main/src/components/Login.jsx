import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAdminLoginState, updateConsumerLoginState, updateLoginState } from '../redux/authSlice';
import { loginAdmin, loginConsumer, loginUser, signUpAdmin, signUpConsumer, signUpUser } from '../services/apiService';
import { toast } from 'react-toastify';
import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';

const getIsRestaurantCustomer = state => state.auth.isCustomer;
const getIsRestaurantAdmin = state => state.auth.isAdmin;

const LoginPage = () => {

    const dispatch = useDispatch();

    const _isCustomer = useSelector(getIsRestaurantCustomer);
    const _isAdmin = useSelector(getIsRestaurantAdmin);

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        captcha: ''
    });

    const [isLogin, setIsLogin] = useState(true);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.email == "" || formData.password == "") {
            toast.error("Email or Password Cannot Be Empty");
            return;
        }
        if (!isLogin && formData.name == "") {
            toast.error("Restaurant Name Cannot Be Empty");
            return;
        }
        if (validateCaptcha(formData.captcha, false) != true) {
            toast.error('Please fill the captcha authentication correctly');
            return;
        }
        const response =
            _isAdmin ?
                isLogin ?
                    await loginAdmin(formData.email, formData.password) :
                    await signUpAdmin(formData.email, formData.password, formData.name) :
                _isCustomer ?
                    isLogin ?
                        await loginConsumer(formData.email, formData.password) :
                        await signUpConsumer(formData.email, formData.password, formData.name) :
                    isLogin ?
                        await loginUser(formData.email, formData.password) :
                        await signUpUser(formData.email, formData.password, formData.name);

        if (response.data) {
            if (_isAdmin) {
                localStorage.setItem("emailAdmin", response.data.email);
                localStorage.setItem("passwordAdmin", response.data.password);
                localStorage.setItem("nameAdmin", response.data.name);
                dispatch(updateAdminLoginState({
                    loggedIn: true,
                    email: response.data.email,
                    password: response.data.password,
                    name: response.data.name,
                }));
            } else if (_isCustomer) {
                localStorage.setItem("emailConsumer", response.data.email);
                localStorage.setItem("passwordConsumer", response.data.password);
                localStorage.setItem("nameConsumer", response.data.name);
                dispatch(updateConsumerLoginState({
                    loggedIn: true,
                    email: response.data.email,
                    password: response.data.password,
                    name: response.data.name,
                }));
            } else {
                localStorage.setItem("email", response.data.email);
                localStorage.setItem("password", response.data.password);
                localStorage.setItem("name", response.data.name);
                localStorage.setItem("restaurantId", response.data.restaurantId);
                dispatch(updateLoginState({
                    loggedIn: true,
                    email: response.data.email,
                    password: response.data.password,
                    name: response.data.name,
                    restaurantId: response.data.restaurantId,
                    wifiPass: response.data.wifiPass,
                }));
            }
        } else {
            toast.error(response.error.message);
        }
    };

    useEffect(() => {
        loadCaptchaEnginge(6);
    }, [])

    return (
        <div className='flex flex-col items-center justify-center'>

            <h1 className="m-4 text-2xl text-center font-bold">{
                _isAdmin ?
                    "Admin Panel" :
                    _isCustomer ?
                        isLogin ? "Customer Login" : "Customer Registration" :
                        "Restaurant Login"
            }</h1>

            {!isLogin ?
                <input
                    className="input m-4 input-bordered input-primary w-full max-w-xs"
                    type="text"
                    placeholder={_isCustomer || _isAdmin ? `Name` : `Restaurant Name`}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                /> : null
            }

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

            <LoadCanvasTemplate />

            <input
                className="input m-4 input-bordered input-primary w-full max-w-xs"
                type="text"
                placeholder="Write the letters shown"
                name="captcha"
                value={formData.captcha}
                onChange={handleInputChange}
            />

            <button className="btn m-4 btn-primary" onClick={handleSubmit}>{isLogin ? "Login" : "Register"}</button>
            <button className="m-4" onClick={() => {
                setIsLogin(!isLogin);
            }}>
                {_isCustomer ?
                    !isLogin ?
                        <h2>Already a user? <b>Login</b></h2> :
                        <h2>Not a user yet? <b>Register</b></h2>
                    : null
                }
            </button>
        </div>
    );
};

export default LoginPage;
