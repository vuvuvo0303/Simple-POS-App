import React, { useState } from "react";
import FoodCard from "@/components/FoodCard";
import { foodData } from "@/data/food-data";
import { View, Text, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Entypo, FontAwesome6 } from "@expo/vector-icons";

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  const filteredFoodData = foodData.filter((food) => food.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <SafeAreaView className="flex-1 p-4">
      {/* Header */}
      <View className="flex flex-row justify-between items-center p-4">
        <Entypo name="menu" size={24} color="black" />
        <View className="flex flex-row items-center gap-2">
          <Entypo name="location-pin" size={24} color="red" />
          <Text className="text-gray-600">TP.HCM</Text>
        </View>
        <AntDesign name="setting" size={24} color="black" />
      </View>

      {/* Thanh tìm kiếm */}
      <View className="flex flex-row items-center p-4 border border-gray-300 rounded-lg mb-4">
        <TextInput
          className="flex-1 p-2 border border-gray-300 rounded-lg"
          placeholder="Search food..."
          value={search}
          onChangeText={setSearch}
        />
        <FontAwesome6 name="filter" size={24} color="green" className="ml-2" />
      </View>

      {/* Danh sách món ăn */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex flex-wrap flex-row justify-between">
          {filteredFoodData.map((food) => (
            <View key={food.id} style={{ width: "48%", marginBottom: 10 }}>
              <FoodCard food={food} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
