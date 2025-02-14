import { Product } from "@/types/product";
import { axiosClient } from "./config/axios-client";

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

export const getAllProducts = async () => {
  try {
    const { data } = await axiosClient.get(`/products`);
    return { error: null, data: data as Product[], success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
