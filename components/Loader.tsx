import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const Loader = ({ loading = true }: { loading?: boolean }) => {
  if (!loading) {
    return null; // Don't render anything if not loading
  }

  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: semi-transparent background
  },
});

export default Loader;
