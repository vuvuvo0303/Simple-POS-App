import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Modal, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Entypo, FontAwesome6 } from "@expo/vector-icons";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import { getAllProducts } from "@/lib/api/product-api"; // Gọi API sản phẩm
import Loader from "@/components/Loader";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);

        // Gọi API lấy danh sách sản phẩm
        const productResult = await getAllProducts();
        if (!productResult.error) {
          const productsData = productResult.data!;
          setProducts(productsData);
          setFilteredProducts(productsData);

          // Trích xuất danh mục từ sản phẩm
          const uniqueCategories = ["All", ...new Set(productsData.map((product) => product.category))];
          setCategories(uniqueCategories);
        } else {
          alert(productResult.error);
        }

        setIsLoading(false);
      };
      fetchData();
    }, [])
  );

  // Lọc sản phẩm theo danh mục
  const filterByCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) => product.category === category));
    }
    setModalVisible(false);
  };

  if (isLoading) {
    return <Loader />;
  }
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("isLoggedIn"); // Xóa trạng thái đăng nhập
  
      // Hiển thị Toast thông báo
      Toast.show({
        type: "success", // "success" | "error" | "info"
        text1: "Successful!",
        text2: "Logout Successfully",
      });
  
      // Điều hướng sau 1.5 giây để người dùng thấy thông báo trước khi chuyển trang
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (error) {
      console.log("Error logging out:", error);
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Logout Error, Please try again.",
      });
    }
  };
  

  if (isLoading) {
    return <Loader />;
  }
  return (
    <SafeAreaView className="flex-1 p-4">
      {/* Header */}
      <View className="flex flex-row justify-between items-center p-4">
        <Entypo name="menu" size={24} color="black" />
        <View className="flex flex-row items-center gap-2">
          <Entypo name="location-pin" size={24} color="red" />
          <Text className="text-gray-600">TP.HCM</Text>
        </View>
        <AntDesign onPress={handleLogout} name="logout" size={24} color="red" />
      </View>

      {/* Thanh tìm kiếm */}
      <View className="flex flex-row items-center p-4 border border-gray-300 rounded-lg mb-4">
        <TextInput
          className="flex-1 p-2 border border-gray-300 rounded-lg"
          placeholder="Search food..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <FontAwesome6 name="filter" size={24} color="green" className="ml-2" />
        </TouchableOpacity>
      </View>

      {/* Danh sách món ăn */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex flex-wrap flex-row justify-between" style={{ marginBottom: 100 }}>
          {filteredProducts
            .filter((food) => food.name.toLowerCase().includes(search.toLowerCase()))
            .map((food) => (
              <View key={food._id} style={{ width: "48%", marginBottom: 10 }}>
                <ProductCard product={food} />
              </View>
            ))}
        </View>
      </ScrollView>

      {/* Modal chọn danh mục */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-3/4">
            <Text className="text-lg font-bold mb-3">Select Category</Text>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                className={`p-3 rounded-lg ${selectedCategory === category ? "bg-green-500" : "bg-gray-200"} mb-2`}
                onPress={() => filterByCategory(category)}
              >
                <Text className="text-center">{category}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity className="mt-4 p-3 bg-red-500 rounded-lg" onPress={() => setModalVisible(false)}>
              <Text className="text-white text-center font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
