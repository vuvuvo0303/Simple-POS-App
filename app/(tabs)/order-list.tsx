import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Order } from "@/types/order";
import { useFocusEffect } from "expo-router";
import { getAllOrders } from "@/lib/api/order-api";
import { formatDate } from "@/lib/date-utils";
import Loader from "@/components/Loader";

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        const result = await getAllOrders();
        if (!result.error) {
          setOrders(result.data!);
        } else {
          alert(result.error);
        }
        setIsLoading(false);
      };
      fetchData();
    }, [])
  );
  if (isLoading) {
    return <Loader />;
  }
  const renderItem = ({ item }: any) => {
    const order = item as Order;
    return (
      <View className="bg-white p-4 rounded-lg mb-4 shadow">
        <View className="flex-row justify-between mt-2">
          <Text className="text-lg font-bold mb-2">{formatDate(new Date(order.createdAt))}</Text>

          <View className={`py-1 px-5 rounded-lg ${order.status === "paid" ? "bg-green-500" : "bg-red-500"}`}>
            <Text className="text-sm font-bold text-white mt-1 text-center">{order.status}</Text>
          </View>
        </View>
        {order.products.map((item, index) => {
          return (
            <View key={index} className="flex-row items-center mb-2">
              <Image source={{ uri: item.productId.imageUrl }} className="w-12 h-12 rounded-lg mr-2" />
              <View className="flex-1 flex-row justify-between">
                <Text className="text-base">{item.productId.name}</Text>
                <Text>x{item.quantity}</Text>
                <Text className="text-base font-bold">${item.productId.price}</Text>
              </View>
            </View>
          );
        })}
        <Text className="text-lg font-bold mt-2">Total: ${order.totalPrice}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 p-4" style={{ paddingBottom: 80 }}>
      {orders.length === 0 ? (
        <Text className="text-center text-lg">Order history is empty</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
};

export default OrderList;
