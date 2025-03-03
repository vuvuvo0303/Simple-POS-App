import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

const API_URL = 'http://10.87.17.81:5000/api';

interface TopProduct {
  _id: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface DailySales {
  date: string;
  total: number;
}

interface Statistics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  dailySales: DailySales[];
  topProducts: TopProduct[];
}

export default function Statistic() {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [statistics, setStatistics] = useState<Statistics>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    dailySales: [],
    topProducts: []
  });

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/stats/dashboard?range=${timeRange}`);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const chartData = {
    labels: statistics.dailySales.map(item => item.date),
    datasets: [
      {
        data: statistics.dailySales.map(item => item.total),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total revenue</Text>
          <Text style={styles.summaryValue}>
            ${statistics.totalRevenue.toFixed(2)}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total order</Text>
          <Text style={styles.summaryValue}>{statistics.totalOrders}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Average/single</Text>
          <Text style={styles.summaryValue}>
            ${statistics.averageOrderValue.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Revenue Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Revenue by day</Text>
        {statistics.dailySales.length > 0 ? (
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726'
              }
            }}
            bezier
            style={styles.chart}
          />
        ) : (
          <Text style={styles.noDataText}>no data</Text>
        )}
      </View>

      {/* Top Products */}
      <View style={styles.topProductsContainer} >
        <Text style={styles.sectionTitle}>Top 5 best-selling products</Text>
        {statistics.topProducts.map((product, index) => (
          <View key={product._id} style={styles.productItem}>
            <Text style={styles.productRank}>{index + 1}</Text>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productStats}>
              Sold: {product.totalQuantity} 
              {/* |Revenue: ${product.totalRevenue.toFixed(2)} */}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  timeRangeContainer: {
    flexDirection: 'row',
    gap: 12
  },
  timeRangeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f0f0f0'
  },
  activeTimeRange: {
    backgroundColor: '#6200ee'
  },
  timeRangeText: {
    color: '#666'
  },
  activeTimeRangeText: {
    color: '#fff'
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 16
  },
  topProductsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  productRank: {
    width: 24,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee'
  },
  productInfo: {
    flex: 1
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4
  },
  productStats: {
    fontSize: 14,
    color: '#666'
  }
});
