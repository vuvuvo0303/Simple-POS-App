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
    return { error: null, data: data as Order[], success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
