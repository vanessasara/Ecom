// src/pages/profile.tsx
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const ProfilePage: React.FC = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (session) {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => setOrders(data));
    }
  }, [session]);

  if (!session) {
    return <p>Please log in to view your orders.</p>;
  }

  return (
    <div>
      <h1>Welcome, {session?.user?.name}</h1>
      <h2>Your Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order}>
            {order} - {order}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
