'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { FiPackage, FiClock, FiCheck, FiX } from 'react-icons/fi';

export default function RecentOrders() {
    const [orders, setOrders] = useState({
        data: [],
        isLoading: true,
        error: null
    });

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const data = await adminService.getRecentOrders();
                setOrders({
                    data: data.orders,
                    isLoading: false,
                    error: null
                });
            } catch (error) {
                setOrders(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error.message
                }));
            }
        };

        fetchRecentOrders();
    }, []);

    if (orders.isLoading) {
        return <div className="recent-orders-loading">Loading orders...</div>;
    }

    if (orders.error) {
        return <div className="recent-orders-error">Error: {orders.error}</div>;
    }

    return (
        <div className="recent-orders">
            <h2 className="section-title">Recent Orders</h2>
            <div className="orders-list">
                {orders.data.length === 0 ? (
                    <p className="no-orders">No recent orders</p>
                ) : (
                    orders.data.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="order-icon">
                                <FiPackage />
                            </div>
                            <div className="order-details">
                                <h3>Order #{order.orderNumber}</h3>
                                <p className="order-customer">{order.customerName}</p>
                                <p className="order-amount">${order.totalAmount}</p>
                                <span className={`order-status ${order.status}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
