import { Product } from "@/types/product";
import { create } from "zustand";

type CartState = {
  cart: (Product & { quantity: number })[];
  addToCart: (foodItem: Product, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void; // Thêm hàm reset giỏ hàng
  paymentMethod: "cash" | "qr";
  setPaymentMethod: (method: "cash" | "qr") => void;
};

const useCartStore = create<CartState>((set) => ({
  cart: [],
  paymentMethod: "cash",

  addToCart: (foodItem, quantity) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item._id === foodItem._id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item._id === foodItem._id ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...foodItem, quantity }] };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item._id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) => (item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
    })),

  clearCart: () => set({ cart: [] }), // Reset giỏ hàng

  setPaymentMethod: (method) => set({ paymentMethod: method }),
}));

export default useCartStore;
