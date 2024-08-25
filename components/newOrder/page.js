'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import baseUrl from '@/components/services/baseUrl';
import Image from 'next/image';

const NewOrder = () => {
    const [orders, setOrders] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    const ordersWithProductDetails = res.data.orders.map(async (order) => {
                        const updatedCartItems = await Promise.all(order.cartItems.map(async (item) => {
                            try {
                                // Fetch product details including images
                                const productResponse = await axios.get(`${baseUrl}/api/products/products/product/${item.productId}`);
                                return { ...item, product: productResponse.data };
                            } catch (error) {
                                console.error('Error fetching product details:', error);
                                return item; // Return the item without additional product data if the request fails
                            }
                        }));
                        return { ...order, cartItems: updatedCartItems };
                    });

                    Promise.all(ordersWithProductDetails).then((updatedOrders) => {
                        // Filter orders to only include those with the status "new"
                        const newOrders = updatedOrders.filter(order => order.lastStatus.name === 'new');
                        setOrders(newOrders);
                        setLoading(false);
                    });
                })
                .catch(error => {
                    console.error('Error fetching order history:', error);
                    setLoading(false);
                });
        }
    }, [userId]);

    if (loading) {
        return <p>Loading...</p>; 
    }

    return (
        <div className='p-4 bg-white rounded-md shadow-md'>
            <h2 className='text-xl font-bold text-[#EB5B00]'>New Orders</h2>
            {orders.length > 0 ? (
                <div className='mt-4 space-y-4'>
                    {orders.map(order => (
                        <div key={order._id} className='border p-4 rounded-md shadow-sm'>
                            <h3 className='font-semibold text-lg'>Invoice: {order.invoice}</h3>
                            <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                            <p><strong>Grand Total:</strong> ${order.grandTotal}</p>
                            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                            <p><strong>Status:</strong> {order.lastStatus.name}</p>
                            <div className='mt-2'>
                                <h4 className='font-semibold'>Items:</h4>
                                <ul className='list-disc pl-5'>
                                    {order.cartItems.map(item => (
                                        <li key={item._id} className='flex items-center space-x-4'>
                                            {/* Display the first product image */}
                                            {item.product?.images?.[0] && (
                                                <Image
                                                    src={`${baseUrl}/${item.product.images[0]}`} // Assuming the image path is relative
                                                    alt={item.product.productName}
                                                    width={50} height={50}
                                                />
                                            )}
                                            <div>
                                                <p>{item.product?.productName} - {item.quantity} x ${item.price} (Size: {item.size})</p>
                                                <p className='text-sm text-gray-500'>Discount: ${item.discountAmount}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No new orders found.</p>
            )}
        </div>
    );
};

export default NewOrder;
