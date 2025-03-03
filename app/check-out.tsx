import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import useCartStore from "@/store/cart-store";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
const API_URL = "http://10.87.17.81:5000/api";

export default function Checkout() {
  const router = useRouter();
  const { cart, paymentMethod, setPaymentMethod } = useCartStore();
  const [receivedAmount, setReceivedAmount] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  const totalAmount = currentOrder ? currentOrder.totalPrice : 0;
  const changeAmount = receivedAmount ? parseFloat(receivedAmount) - totalAmount : 0;
  const { clearCart } = useCartStore();
  useEffect(() => {
    createOrder();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Quyền bị từ chối", "Vui lòng cấp quyền để lưu hóa đơn.");
    }
  };

  const createOrder = async () => {
    try {
      const orderProducts = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      const response = await axios.post(`${API_URL}/orders`, {
        products: orderProducts,
      });

      setCurrentOrder(response.data);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleCashPayment = async () => {
    if (!currentOrder || parseFloat(receivedAmount) < totalAmount) return;

    try {
      const response = await axios.patch(`${API_URL}/orders/payment/confirm`, {
        orderId: currentOrder._id,
        paymentMethod: "cash",
        cashReceived: parseFloat(receivedAmount),
        change: changeAmount,
      });

      if (response.status === 200) {
        // Cập nhật trạng thái đơn hàng
        const updatedOrder = await axios.get(`${API_URL}/orders/${currentOrder._id}`);
        setCurrentOrder(updatedOrder.data);

        if (updatedOrder.data.status === "paid") {
          setIsPaymentComplete(true);
          ToastAndroid.show("Thanh toán thành công!", ToastAndroid.SHORT);
          clearCart();
          // Chờ 500ms rồi mở modal (hiệu ứng UI mượt hơn)
          setTimeout(() => {
            setShowInvoiceModal(true);
          }, 500);
        } else {
          Alert.alert("Lỗi", "Thanh toán chưa được ghi nhận. Vui lòng kiểm tra lại.");
        }
      } else {
        Alert.alert("Lỗi", "Thanh toán không thành công. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error confirming cash payment:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi xác nhận thanh toán.");
    }
  };

  const handleQRPayment = async () => {
    if (!currentOrder) return;

    try {
      const response = await axios.post(`${API_URL}/orders/payment/qr`, {
        orderId: currentOrder._id,
      });

      if (response.data.qrUrl) {
        setQrUrl(response.data.qrUrl);
        setShowQRCode(true);
        setIsCheckingPayment(true);
      } else {
        Alert.alert("Không thể tạo mã QR. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("QR Error:", error);
      Alert.alert("Có lỗi khi tạo mã QR. Vui lòng thử lại.");
    }
  };

  const handlePrintInvoice = async () => {
    if (!currentOrder) {
      Alert.alert("Lỗi", "Không tìm thấy đơn hàng.");
      return;
    }

    setLoadingInvoice(true);
    try {
      const invoiceUrl = `${API_URL}/orders/${currentOrder._id}/invoice`;
      console.log("Tải hóa đơn từ:", invoiceUrl);

      const fileUri = `${FileSystem.documentDirectory}invoice-${currentOrder._id}.pdf`;
      console.log("Đang lưu vào:", fileUri);

      const downloadResumable = FileSystem.createDownloadResumable(invoiceUrl, fileUri);
      const { uri } = await downloadResumable.downloadAsync();

      console.log("Hóa đơn tải về tại:", uri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Tải hóa đơn", "Không thể in hóa đơn, nhưng đã tải về.");
      }
    } catch (error) {
      console.error("Lỗi tải hóa đơn:", error);
      Alert.alert("Lỗi", "Không thể tải hóa đơn.");
    } finally {
      setLoadingInvoice(false);
      setShowInvoiceModal(false);
      router.push("/");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.totalText}>Total amount: ${totalAmount.toFixed(2)}</Text>

      {!paymentMethod ? (
        <View style={styles.methodSelection}>
          <TouchableOpacity style={styles.button} onPress={() => setPaymentMethod("cash")}>
            <Text style={styles.buttonText}>Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setPaymentMethod("qr")}>
            <Text style={styles.buttonText}>QR Code</Text>
          </TouchableOpacity>
        </View>
      ) : paymentMethod === "cash" ? (
        <View style={styles.paymentContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter received amount"
            value={receivedAmount}
            onChangeText={(text) => {
              // Chỉ cho phép nhập số hợp lệ
              if (/^\d*\.?\d*$/.test(text) || text === "") {
                setReceivedAmount(text);
              }
            }}
            onBlur={() => {
              // Khi rời khỏi input, kiểm tra số tiền nhập
              if (!receivedAmount || parseFloat(receivedAmount) <= 0) {
                Alert.alert("Lỗi", "Vui lòng nhập số tiền lớn hơn 0.");
                setReceivedAmount(""); // Reset input nếu không hợp lệ
              }
            }}
          />

          <Text style={styles.changeText}>Change: ${changeAmount.toFixed(2)}</Text>
          <TouchableOpacity
            style={[styles.button, { opacity: !receivedAmount || parseFloat(receivedAmount) < totalAmount ? 0.5 : 1 }]}
            onPress={() => {
              if (!receivedAmount || parseFloat(receivedAmount) < totalAmount) {
                Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ trước khi xác nhận thanh toán.");
                return;
              }
              handleCashPayment();
            }}
            disabled={!receivedAmount || parseFloat(receivedAmount) < totalAmount}
          >
            <Text style={styles.buttonText}>Payment confirm</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.paymentContainer}>
          {qrUrl ? <Image source={{ uri: qrUrl }} style={styles.qrImage} /> : <Text>Đang tạo mã QR...</Text>}
          <TouchableOpacity style={styles.button} onPress={handleQRPayment}>
            <Text style={styles.buttonText}>{isCheckingPayment ? "Đang chờ thanh toán..." : "Tạo mã QR"}</Text>
          </TouchableOpacity>
        </View>
      )}

      {isPaymentComplete && (
        <Modal visible={showInvoiceModal} transparent>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Do you want to print invoices??</Text>
            {loadingInvoice ? (
              <ActivityIndicator size="large" color="blue" />
            ) : (
              <>
                <TouchableOpacity style={styles.button} onPress={handlePrintInvoice}>
                  <Text style={styles.buttonText}>Print invoice</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    clearCart(); // Xóa giỏ hàng
                    setShowInvoiceModal(false); // Đóng modal
                    router.push("/"); // Điều hướng về trang chủ
                  }}
                >
                  <Text style={styles.buttonText}>No, go Home Page</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  totalText: { fontSize: 24, fontWeight: "600", textAlign: "center" },
  button: { backgroundColor: "blue", padding: 16, borderRadius: 8, marginVertical: 5 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalText: { fontSize: 18, marginBottom: 16 },
});
