import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router"; // Thêm router
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Reset để test (xóa sau khi test xong)
        await AsyncStorage.removeItem("isLoggedIn");
        const loginStatus = await AsyncStorage.getItem("isLoggedIn");
        console.log("loginStatus from AsyncStorage:", loginStatus); // Debug
        setIsLoggedIn(loginStatus === "true");
        // Ép buộc vào login nếu chưa đăng nhập
        if (loginStatus !== "true") {
          router.replace("/login");
        }
      } catch (error) {
        console.log("Error checking login status:", error);
        setIsLoggedIn(false);
        router.replace("/login"); // Ép buộc vào login nếu lỗi
      } finally {
        SplashScreen.hideAsync();
      }
    };

    if (loaded) {
      checkLoginStatus();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  console.log("Rendering with isLoggedIn:", isLoggedIn);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" redirect={isLoggedIn} />
        {isLoggedIn && (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="check-out" />
            <Stack.Screen name="+not-found" />
          </>
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}