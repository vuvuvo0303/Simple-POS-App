import { Product } from "./product";

export type Order = {
  _id: string;
  paymentMethod: "cash" | "qr";
  products: {
    productId: Product;
    quantity: number;
  }[];
  totalPrice: number;
  status: "pending" | "paid";
  createdAt: string;
};
