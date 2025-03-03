import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';

// Định nghĩa interface cho dữ liệu vị trí
interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export default function LocationScreen() {
  // Khai báo kiểu cho history
  const [history, setHistory] = useState<LocationData[]>([]);
  // Khai báo kiểu cho selectedLocation
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('locationHistory');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory) as LocationData[]);
        }
      } catch (error) {
        console.error("Lỗi khi tải lịch sử:", error);
      }
    };
    loadHistory();
  }, []);

  const renderItem = ({ item }: { item: LocationData }) => {
    const lat = parseFloat(String(item.latitude));
    const lon = parseFloat(String(item.longitude));

    return (
      <TouchableOpacity 
        style={styles.item}
        onPress={() => setSelectedLocation({ latitude: lat, longitude: lon, timestamp: item.timestamp })}
      >
        <Text>Lat: {lat}</Text>
        <Text>Lon: {lon}</Text>
        <Text>Time: {item.timestamp}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch Sử Đăng Nhập</Text>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text>Chưa có lịch sử</Text>}
      />
      {selectedLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }}
            title="Vị trí đăng nhập"
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
});