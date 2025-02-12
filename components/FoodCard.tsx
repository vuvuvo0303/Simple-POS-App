import { View, Text, Image, TextInput, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useState } from "react";
import { Food } from "@/types/Food";
import useStore from "@/store/food-store";

const FoodCard = ({ food }: { food: Food }) => {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart(food, quantity);
    ToastAndroid.show("Added to cart", ToastAndroid.SHORT);
    setQuantity(1); // Reset quantity after adding to cart
  };

  return (
    <View className="bg-white rounded-lg shadow-md p-4 w-full">
    <Image source={{ uri: food.image }} className="w-full h-40 rounded-lg" resizeMode="cover" />
    <Text className="text-xl font-bold mt-2">{food.name}</Text>
    <Text className="text-gray-600 mt-1">{food.description}</Text>
    <Text className="text-lg font-semibold mt-2">${food.price.toFixed(2)}</Text>
  
    <View className="flex justify-between items-center mt-2 w-full">
      <View className="flex-row justify-center w-full gap-3">
        <TouchableOpacity onPress={() => setQuantity(quantity - 1)} disabled={quantity === 1}>
          <View className="bg-red-500 flex justify-center items-center size-10 rounded-md">
            <Text className="text-white">-</Text>
          </View>
        </TouchableOpacity>
        <TextInput
          className="border rounded-lg p-2 w-1/3 text-center"
          keyboardType="numeric"
          value={String(quantity)}
          onChangeText={(text) => setQuantity(Number(text))}
        />
        <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
          <View className="bg-green-500 flex justify-center items-center size-10 rounded-md">
            <Text className="text-white">+</Text>
          </View>
        </TouchableOpacity>
      </View>
  
      <TouchableOpacity onPress={handleAddToCart} className="w-full">
        <View className="bg-pink-500 flex justify-center items-center rounded-lg p-3 mt-2">
          <Text className="text-white">Add to Cart</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
  
  );
};

export default FoodCard;
