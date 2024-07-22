'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import AlertDialog from './AlertDialog';
import LoginCard from './LoginCard';
import { Button } from './ui/button';

const CheckoutButton: React.FC = () => {
  const { data: session } = useSession();
  const [showAlert, setShowAlert] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);

  const handleCheckout = () => {
    if (!session) {
      setShowAlert(true);
    } else {
      // Proceed with checkout
    }
  };

  const handleLoginClick = () => {
    setShowAlert(false);
    setShowLoginCard(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleLoginCardClose = () => {
    setShowLoginCard(false);
  };

  return (
    <>
      <Button onClick={handleCheckout}>
        Checkout
      </Button>
      <AlertDialog open={showAlert} onClose={handleAlertClose} onLogin={handleLoginClick} />
      {showLoginCard && <LoginCard onClose={handleLoginCardClose} />}
    </>
  );
};

export default CheckoutButton;
