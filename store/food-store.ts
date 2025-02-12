import { Food } from "@/types/Food";
import { create } from "zustand";
type FoodState = {
  cart: (Food & { quantity: number })[];
  addToCart: (foodItem: Food, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
};
const useStore = create<FoodState>((set) => ({
  cart: [],
  addToCart: (foodItem, quantity) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === foodItem.id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id === foodItem.id ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...foodItem, quantity }] };
    }),
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
    })),
}));

export default useStore;
