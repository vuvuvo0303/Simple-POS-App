import { View, Text, ScrollView, Dimensions } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart, BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const Statistic = () => {
  const pieData = [
    { name: "Pizza", population: 35, color: "tomato", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "Burger", population: 40, color: "orange", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "Pasta", population: 25, color: "gold", legendFontColor: "#7F7F7F", legendFontSize: 15 },
  ];

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        data: [30, 45, 28, 80, 99, 43, 50, 60, 70, 90, 100, 120],
      },
    ],
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      <ScrollView>
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>Sales Distribution</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: "#1cc910",
              backgroundGradientFrom: "#eff3ff",
              backgroundGradientTo: "#efefef",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>Monthly Orders</Text>
          <BarChart
            data={barData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: "#1cc910",
              backgroundGradientFrom: "#eff3ff",
              backgroundGradientTo: "#efefef",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        <View style={{ marginBottom: 100 }}>
          <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>Summary</Text>
          <View style={{ backgroundColor: "#f0f0f0", padding: 16, borderRadius: 8 }}>
            <Text style={{ fontSize: 18 }}>Total Sales: $100,000</Text>
            <Text style={{ fontSize: 18 }}>Total Orders: 500</Text>
            <Text style={{ fontSize: 18 }}>Average Order Value: $200</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Statistic;
