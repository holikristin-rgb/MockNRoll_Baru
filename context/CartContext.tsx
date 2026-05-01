import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext<any>(null);

export function CartProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<any[]>([]);

  // Tambah ke keranjang
  const addToCart = (item: any) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (i) => i.id === item.id
      );

      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: i.quantity + 1
              }
            : i
        );
      }

      return [
        ...prev,
        {
          ...item,
          quantity: 1
        }
      ];
    });
  };

  // Kurangi quantity (bukan langsung hapus)
  const removeFromCart = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Hapus item langsung
  const deleteItem = (id: string) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // Beli sekarang (langsung checkout 1 item)
  const buyNow = (item: any) => {
    setCart([
      {
        ...item,
        quantity: 1
      }
    ]);
  };

  // Kosongkan keranjang
  const clearCart = () => {
    setCart([]);
  };

  // Total harga
  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        deleteItem,
        buyNow,
        clearCart,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);