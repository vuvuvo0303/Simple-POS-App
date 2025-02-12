import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import HomeScreen from "../(tabs)/index";
import StatisticScreen from "../(tabs)/statistic";
import OrderListScreen from "../(tabs)/order-list";
import CartScreen from "../(tabs)/cart";
import { Animated, Easing } from "react-native";

const Tab = createBottomTabNavigator();

const TabLayout = () => {
  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Cart") iconName = "shoppingcart";
          else if (route.name === "Statistic") iconName = "barschart";
          else if (route.name === "Orderlist") iconName = "profile"; // Thay đổi biểu tượng cho Orderlist
          return <AntDesign name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute",
          left: 10,
          right: 10,
          bottom: 10,
        },
        tabBarItemStyle: {
          borderRadius: 20,
        },
        cardStyleInterpolator: forFade,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Statistic" component={StatisticScreen} />
      <Tab.Screen name="Orderlist" component={OrderListScreen} />
    </Tab.Navigator>
  );
};

export default TabLayout;
