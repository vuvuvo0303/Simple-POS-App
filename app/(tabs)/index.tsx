import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Text className="text-6xl text-red-400">Hello world</Text>
    </SafeAreaView>
  );
}
