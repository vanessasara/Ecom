'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from './ui/button';
import { Input } from './ui/input';


interface LoginCardProps {
  onClose: () => void;
}

const LoginCard: React.FC<LoginCardProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLogin) {
      // Handle login
      await signIn('credentials', { email, password });
    } else {
      // Handle registration
      // Call your registration API with email, password, and name
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-50 absolute inset-0" onClick={onClose}></div>
      <div className="bg-white p-6 rounded shadow-lg relative z-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded"
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded"
          />
          <Button type="submit">
             Log In with Google
          </Button>
    
          <Button  onClick={onClose}>
            Close
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginCard;
