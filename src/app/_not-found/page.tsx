// src/app/not-found.tsx
import { FC } from 'react';

const NotFound: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Page Not Found</h1>
        <p className="text-gray-700 mb-6">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
