import Toast from "react-native-toast-message";
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const router = useRouter();

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

        // Navigate after a short delay
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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
        <Text style={styles.loginButtonText}>{isLoading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { height: 50, borderColor: "gray", borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 5 },
  loginButton: { backgroundColor: "#007bff", padding: 15, borderRadius: 5, alignItems: "center" },
  loginButtonText: { color: "white", fontWeight: "bold" },
});
