'use client'
import { AuthContext } from '@/components/context/AuthProvider';
import baseUrl from '@/components/services/baseUrl';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const totalQuantity = useSelector(state => state.cart.totalQuantity);
    const [allOrders, setAllOrders] = useState();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = JSON.parse(localStorage.getItem('userId'));
            setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            axios.get(`${baseUrl}/api/orders/order-count/${userId}`)
                .then(res => {
                    setAllOrders(res.data);
                })
                .catch(error => {
                    console.error('Error fetching order count:', error);
                });
        }
    }, [userId]);

    return (
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 min-h-full lg:min-h-96'>
            <div className='bg-[#eb5a0027] lg:px-12 gap-2 py-4 md:h-32 flex flex-col justify-center items-center rounded-md'>
                <h1 className='text-[#EB5B00] md:text-3xl font-bold'>{allOrders?.orderCount}</h1>
                <h1 className='text-[#EB5B00] md:text-xl text-center'>Total Orders</h1>
            </div>
            <div className='bg-[#4ccd992c] lg:px-12 gap-2 py-4 md:h-32 flex flex-col justify-center items-center rounded-md'>
                <h1 className='text-[#4CCD99] md:text-3xl font-bold'>00</h1>
                <h1 className='text-[#4CCD99] md:text-xl text-center'>New Orders</h1>
            </div>
            <div className='bg-[#ff4c4c21] lg:px-12 gap-2 py-4 md:h-32 flex flex-col justify-center items-center rounded-md'>
                <h1 className='text-[#FF4C4C] md:text-3xl font-bold'>00</h1>
                <h1 className='text-[#FF4C4C] md:text-xl text-center'>Wishlist</h1>
            </div>
            <div className='bg-[#387bdf34] lg:px-12 gap-2 py-4 md:h-32 flex flex-col justify-center items-center rounded-md'>
                <h1 className='text-[#387ADF] md:text-3xl font-bold'>{totalQuantity}</h1>
                <h1 className='text-[#387ADF] md:text-xl text-center'>Carts</h1>
            </div>
        </div>
    );
};

export default Dashboard;
