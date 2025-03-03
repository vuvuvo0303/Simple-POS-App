import Toast from "react-native-toast-message";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native"; // Thêm Image
import axios from "axios";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: string;
}

const API_URL = "http://10.87.17.81:5000/api/users";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLocation = async () => {
      const locationData = await getLocation();
      if (locationData) {
        setCurrentLocation(locationData);
      }
    };
    fetchLocation();
  }, []);

  const getLocation = async (): Promise<LocationData | null> => {
    try {
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        Toast.show({ type: "error", text1: "Error", text2: "Please enable location services." });
        return null;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({ type: "error", text1: "Error", text2: "Location permission denied." });
        return null;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error getting location:", error);
      Toast.show({ type: "error", text1: "Error", text2: "Failed to retrieve location." });
      return null;
    }
  };

  const saveLocationHistory = async (locationData: LocationData) => {
    try {
      const existingHistory = await AsyncStorage.getItem("locationHistory");
      const history: LocationData[] = existingHistory ? JSON.parse(existingHistory) : [];
      history.push(locationData);
      await AsyncStorage.setItem("locationHistory", JSON.stringify(history));
    } catch (error) {
      console.error("Error saving location history:", error);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Toast.show({ type: "error", text1: "Error", text2: "Please enter both username and password." });
      return;
    }

    setIsLoading(true);
    const locationData = await getLocation();
    if (!locationData) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
        location: locationData,
      });

      if (response.status === 200) {
        await saveLocationHistory(locationData);
        Toast.show({ type: "success", text1: "Success", text2: "Login successful!" });

        setTimeout(() => {
          router.replace("/(tabs)/cart");
        }, 1500);
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-5 bg-gray-100">
      {/* Đặt LottieView ở giữa */}
      <View className="items-center mb-5">
        <LottieView source={require("@/assets/login.json")} autoPlay loop style={{ width: "40%", height: 100 }} />
      </View>

      {/* Hiển thị bản đồ nếu có vị trí hiện tại */}
      {currentLocation && (
        <MapView
          style={{ width: "100%", height: 200, marginBottom: 20 }}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }}
            title="Your Location"
          />
        </MapView>
      )}

      <TextInput
        className="h-12 border border-gray-400 mb-4 px-3 rounded-md"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        className="h-12 border border-gray-400 mb-4 px-3 rounded-md"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        className="bg-orange-500 p-4 rounded-md items-center"
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text className="text-white font-bold">{isLoading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>

      {/* Thêm hình ảnh dưới nút Login */}
      <View className="flex flex-row items-center justify-center gap-4 pt-24">
        <Image
          source={{
            uri: "https://png.pngtree.com/png-clipart/20210725/original/pngtree-sushi-logo-png-image_6552022.jpg",
          }}
          className="w-24 h-24"
          resizeMode="contain"
        />
        <Text className="text-lg pt-2 font-semibold">POS ポイント10 Sushi</Text>
      </View>

      <Toast />
    </View>
  );
}
