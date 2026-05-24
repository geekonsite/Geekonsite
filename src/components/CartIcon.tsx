import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface CartIconProps {
  itemCount: number;
  onClick: () => void;
}

export const CartIcon: React.FC<CartIconProps> = ({ itemCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};