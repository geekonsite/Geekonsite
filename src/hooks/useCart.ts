import { useState, useCallback, useMemo } from 'react';
import { CartItem, CartState } from '../types/cart';

export const useCart = () => {
  const [cart, setCart] = useState<CartState>({
    items: [],
    isOpen: false,
    total: 0
  });

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        const updatedItems = prevCart.items.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        
        return {
          ...prevCart,
          items: updatedItems,
          total: updatedItems.reduce((sum, cartItem) => sum + (cartItem.price * cartItem.quantity), 0)
        };
      } else {
        // Add new item
        const newItems = [...prevCart.items, { ...item, quantity: 1 }];
        return {
          ...prevCart,
          items: newItems,
          total: newItems.reduce((sum, cartItem) => sum + (cartItem.price * cartItem.quantity), 0)
        };
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      return {
        ...prevCart,
        items: updatedItems,
        total: updatedItems.reduce((sum, cartItem) => sum + (cartItem.price * cartItem.quantity), 0)
      };
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      
      return {
        ...prevCart,
        items: updatedItems,
        total: updatedItems.reduce((sum, cartItem) => sum + (cartItem.price * cartItem.quantity), 0)
      };
    });
  }, [removeFromCart]);

  const toggleCart = useCallback(() => {
    setCart(prevCart => ({
      ...prevCart,
      isOpen: !prevCart.isOpen
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      isOpen: false,
      total: 0
    });
  }, []);

  const itemCount = useMemo(() => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart.items]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleCart,
    clearCart,
    itemCount
  };
};