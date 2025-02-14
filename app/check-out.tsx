import { View, Text } from "react-native";
import React from "react";
import useCartStore from "@/store/cart-store";
import { SafeAreaView } from "react-native-safe-area-context";

const Checkout = () => {
  const paymentMethod = useCartStore((state) => state.paymentMethod);
  return (
    <SafeAreaView>
      <Text>{paymentMethod}</Text>
    </SafeAreaView>
  );
};

export default Checkout;
