import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import { styled } from "native-wind";

const orders = [
  {
    id: "1",
    items: [
      {
        name: "Pizza",
        image: "https://www.pizzaexpress.vn/wp-content/uploads/2018/08/123rf_74137223_super-e1533621422385-780x435.jpg",
        price: 20,
      },
      {
        name: "Burger",
        image: "https://www.pizzaexpress.vn/wp-content/uploads/2018/08/123rf_74137223_super-e1533621422385-780x435.jpg",
        price: 30,
      },
    ],
    total: 50,
    status: "Paid",
    date: "2025-02-12",
  },
  {
    id: "2",
    items: [
      {
        name: "Pasta",
        image: "https://www.pizzaexpress.vn/wp-content/uploads/2018/08/123rf_74137223_super-e1533621422385-780x435.jpg",
        price: 15,
      },
      {
        name: "Salad",
        image: "https://www.pizzaexpress.vn/wp-content/uploads/2018/08/123rf_74137223_super-e1533621422385-780x435.jpg",
        price: 15,
      },
    ],
    total: 30,
    status: "Paid",
    date: "2025-02-11",
  },
];

const OrderList = () => {
  const renderItem = ({ item }) => (
    <View className="bg-white p-4 rounded-lg mb-4 shadow">
      <Text className="text-lg font-bold mb-2">{item.date}</Text>
      {item.items.map((food, index) => (
        <View key={index} className="flex-row items-center mb-2">
          <Image source={{ uri: food.image }} className="w-12 h-12 rounded-lg mr-2" />
          <View className="flex-1 flex-row justify-between">
            <Text className="text-base">{food.name}</Text>
            <Text className="text-base font-bold">${food.price}</Text>
          </View>
        </View>
      ))}
      <Text className="text-lg font-bold mt-2">Total: ${item.total}</Text>
      <View className="flex-row justify-center mt-2">
      <View className="bg-green-500 px-36 py-2 rounded-lg mt-2  items-center ">
        <Text className="text-sm font-bold text-white mt-1 text-center">{item.status}</Text>
      </View>
      </View>
      
    </View>
  );

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

export default OrderList;
