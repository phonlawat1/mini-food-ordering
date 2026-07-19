import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { COLORS } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Success">;

/**
 * หน้าสั่งซื้อสำเร็จ
 * - Stack ถูก reset เป็น [Home, Success] ตั้งแต่ตอน Checkout แล้ว
 *   ดังนั้นทั้งปุ่ม "กลับไปหน้าหลัก" และปุ่ม Back ของเครื่อง (Android)
 *   จะพากลับ Home เสมอ และย้อนกลับไปหน้า Cart ไม่ได้
 */
const SuccessScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderId } = route.params;

  const handleBackToHome = () => {
    navigation.popToTop(); // กลับไป Home (route แรกของ stack)
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Text style={styles.check}>✓</Text>
      </View>
      <Text style={styles.title}>สั่งซื้อสำเร็จ!</Text>
      <Text style={styles.subtitle}>
        ขอบคุณที่ใช้บริการ ร้านกำลังเตรียมอาหารของคุณ
      </Text>
      <View style={styles.orderBox}>
        <Text style={styles.orderLabel}>หมายเลขคำสั่งซื้อ</Text>
        <Text style={styles.orderId} testID="order-id">
          {orderId}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          // reset เป็น [Home, Orders] เพื่อให้กด Back จากหน้าออร์เดอร์ไป Home
          // ไม่ใช่ย้อนกลับมาหน้า "สั่งซื้อสำเร็จ" ซึ่งจบไปแล้ว
          navigation.reset({
            index: 1,
            routes: [{ name: "Home" }, { name: "Orders" }],
          })
        }
        testID="btn-view-order"
      >
        <Text style={styles.buttonText}>ดูสถานะออร์เดอร์</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={handleBackToHome}
        testID="btn-back-home"
      >
        <Text style={styles.secondaryButtonText}>กลับไปหน้าหลัก</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.success,
    alignItems: "center",
    justifyContent: "center",
  },
  check: { fontSize: 48, color: COLORS.white, fontWeight: "800" },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 8,
  },
  orderBox: {
    marginTop: 24,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderLabel: { fontSize: 12, color: COLORS.textMuted },
  orderId: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: 4,
  },
  button: {
    marginTop: 32,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 40,
    paddingVertical: 14,
  },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: "700" },
  secondaryButton: { marginTop: 14, paddingHorizontal: 24, paddingVertical: 10 },
  secondaryButtonText: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontWeight: "700",
  },
});

export default SuccessScreen;
