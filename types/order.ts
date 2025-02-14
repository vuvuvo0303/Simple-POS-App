import { Product } from "./product";

export type Order = {
  _id: string;
  paymentMethod: "cash" | "qr";
  products: Product[];
  totalPrice: number;
  status: "pending" | "paid";
  createdAt: string;
};
