import { axiosClient } from "./config/axios-client";
import { Order } from "@/types/order";

export const handleApiError = (error: any) => {
  console.log(JSON.stringify(error));
  try {
    const errorMessage = error.response?.data || "An unexpected error occurred.";
    const data = null;
    return { error: errorMessage, data };
  } catch (err) {
    throw new Error("An unexpected error occurred.");
  }
};

export const getAllOrders = async () => {
  try {
    const { data } = await axiosClient.get(`/orders`);
    
    const paidOrders = (data as Order[])
      .filter(order => order.status === "paid")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { error: null, data: paidOrders, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

