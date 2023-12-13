import React from 'react';
import QRCode from 'react-qr-code';
import { useSelector } from 'react-redux';

const getRestaurantId = state => state.auth.restaurantId;

const QRCodePage = () => {

    const _restaurantId = useSelector(getRestaurantId);

    return (
        <div>
            <h2 className='m-4 text-3xl text-center font-bold'>Restaurant QR Code</h2>
            <h2 className='m-4 text-2xl text-center font-bold'>Scan to view all the products</h2>
            <div className='flex flex-col justify-center items-center m-28'>
                <QRCode value={`${window.location.protocol + "//" + window.location.host}/?restaurantId=${_restaurantId}`} />
                <a href={`${window.location.protocol + "//" + window.location.host}/?restaurantId=${_restaurantId}`}>Visit URL</a>
            </div>
        </div>
    );
};

export default QRCodePage;
