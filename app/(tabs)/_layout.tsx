import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import HomeScreen from "../(tabs)/index";
import StatisticScreen from "../(tabs)/statistic";
import OrderListScreen from "../(tabs)/order-list";
import CartScreen from "../(tabs)/cart";
import LocationHistory from "./location-history";
import Toast from "react-native-toast-message";

const Tab = createBottomTabNavigator();

const FadeAnimation = ({ current }: any) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const TabNavigator = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icons: Record<string, any> = {
              Home: "home",
              Order: "shoppingcart",
              Statistic: "barschart",
              Orderlist: "profile",
              LocationHistory: "enviromento",
            };
            return <AntDesign name={icons[route.name]} size={size} color={color} />;
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
          cardStyleInterpolator: FadeAnimation,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Order" component={CartScreen} />
        <Tab.Screen name="Statistic" component={StatisticScreen} />
        <Tab.Screen name="Orderlist" component={OrderListScreen} />
        <Tab.Screen name="LocationHistory" component={LocationHistory} />
      </Tab.Navigator>
      {/* Hiển thị Toast */}
      <Toast />
    </>
  );
};

const TabLayout = () => {
  return <TabNavigator />;
};

export default TabLayout;
