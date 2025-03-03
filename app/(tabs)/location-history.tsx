import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns'; // Import format từ date-fns

// Định nghĩa interface cho dữ liệu vị trí
interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export default function LocationScreen() {
  const [history, setHistory] = useState<LocationData[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('locationHistory');
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory) as LocationData[];
          // Sắp xếp theo timestamp giảm dần (mới nhất lên đầu)
          const sortedHistory = parsedHistory.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setHistory(sortedHistory);
        }
      } catch (error) {
        console.error("Lỗi khi tải lịch sử:", error);
      }
    };
    loadHistory();
  }, []);

  // Hàm mở Google Maps với ghim tại vị trí
  const openGoogleMaps = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch(err => console.error("Lỗi khi mở Google Maps:", err));
  };

  const renderItem = ({ item }: { item: LocationData }) => {
    const lat = parseFloat(String(item.latitude));
    const lon = parseFloat(String(item.longitude));
    // Format timestamp thành dd/MM/yyyy HH:mm:ss
    const formattedDate = format(new Date(item.timestamp), 'dd/MM/yyyy HH:mm:ss');

    return (
      <TouchableOpacity 
        className="bg-white p-4 mb-3 rounded-lg shadow-md border-l-4 border-blue-500"
        onPress={() => openGoogleMaps(lat, lon)}
      >
        <Text className="text-gray-800 font-semibold">Lat: {lat}</Text>
        <Text className="text-gray-800 font-semibold">Lon: {lon}</Text>
        <Text className="text-gray-600 text-sm mt-1">Time: {formattedDate}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <FlatList 
        data={history}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 80 }} // Thêm padding dưới cùng
        ListEmptyComponent={<Text className="text-center text-gray-500 text-lg">Chưa có lịch sử</Text>}
      />
    </View>
  );
}