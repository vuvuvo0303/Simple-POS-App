import { View, Text, FlatList, Alert, TextInput, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import useStore from "@/store/cart-store";
import { Product } from "@/types/product";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { Link, router } from "expo-router";

const Cart = () => {
  const [selectedValue, setSelectedValue] = useState<"cash" | "qr">("cash");
  const setPaymentMethod = useStore((state) => state.setPaymentMethod);
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const options: {
    label: string;
    value: "cash" | "qr";
  }[] = [
    { label: "Pay by cash", value: "cash" },
    { label: "Pay via QR", value: "qr" },
  ];
  const handleRemoveItem = (id: string) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item from the cart?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => removeFromCart(id) },
    ]);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, quantity);
    }
  };

  const handleCheckout = () => {
    setPaymentMethod(selectedValue);
    router.navigate("/check-out");
  };

  const renderItem = ({ item }: { item: Product & { quantity: number } }) => (
    <View className="flex-row justify-between items-center border-b p-2">
      <Image source={{ uri: item.imageUrl }} className="w-16 h-16 rounded-lg" />
      <Text className="text-lg flex-1 ml-2">{item.name}</Text>
      <View className="flex-row items-center gap-2 pl-2">
        <TouchableOpacity
          onPress={() => handleUpdateQuantity(item._id, item.quantity - 1)}
          className="bg-red-500 p-2 rounded-lg"
        >
          <Text className="text-white">-</Text>
        </TouchableOpacity>
        <TextInput
          className="border rounded-lg p-1 w-12 text-center"
          keyboardType="numeric"
          value={String(item.quantity)}
          onChangeText={(text) => handleUpdateQuantity(item._id, Number(text))}
        />
        <TouchableOpacity
          onPress={() => handleUpdateQuantity(item._id, item.quantity + 1)}
          className="bg-green-500 p-2 rounded-lg"
        >
          <Text className="text-white">+</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-lg ml-2">${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <SafeAreaView className={"p-4 bg-white flex-1"}>
      <Text className={"text-2xl font-bold mb-4"}>Your Cart</Text>
      {cart.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <LottieView source={require("@/assets/foodcart.json")} autoPlay loop style={{ width: "100%", height: 400 }} />
          <Text className="text-lg font-bold text-gray-600 mt-4">Your cart is empty.</Text>
        </View>
      ) : (
        <>
          <FlatList data={cart} keyExtractor={(item) => item._id} renderItem={renderItem} />
          <View style={{ paddingBottom: 80 }}>
            <Text className={"text-xl font-bold mt-4"}>Total: ${totalPrice.toFixed(2)}</Text>
            <View className="mt-5">
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSelectedValue(option.value)}
                  className={`flex-row items-center mb-2`}
                >
                  <View
                    className={`w-5 h-5 border-2 border-gray-500 rounded-full ${
                      selectedValue === option.value ? "bg-blue-500" : "bg-white"
                    }`}
                  />
                  <Text className={`ml-2 text-lg`}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={handleCheckout} className="bg-blue-500 p-4 rounded-lg mt-4">
              <Text className="text-white text-center">Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Cart;
