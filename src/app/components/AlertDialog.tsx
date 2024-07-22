import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/app/components/ui/dialog'; // Adjust the import path based on your project structure
import { Button } from './ui/button';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ open, onClose, onLogin }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Not Logged In?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onLogin}>Log In</Button>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
