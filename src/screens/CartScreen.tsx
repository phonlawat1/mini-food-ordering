import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CartItem, RootStackParamList } from "../types";
import {
  DELIVERY_FEE,
  selectSubtotal,
  useCartStore,
} from "../store/useCartStore";
import { useCouponStore } from "../store/useCouponStore";
import { useOrderStore } from "../store/useOrderStore";
import { calcDiscount } from "../utils/coupon";
import CartRow from "../components/CartRow";
import CouponSection from "../components/CouponSection";
import { COLORS, baht } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Cart">;

const cartKeyExtractor = (i: CartItem) => i.food.id;

const CartScreen: React.FC<Props> = ({ navigation }) => {
  // เลือกทีละ field — actions ของ zustand เป็น reference คงที่
  // จึงไม่ทำให้ component นี้ re-render เวลา state ส่วนอื่นเปลี่ยน
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectSubtotal);
  const increase = useCartStore((s) => s.increase);
  const decrease = useCartStore((s) => s.decrease);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const appliedCoupon = useCouponStore((s) => s.applied);
  const clearCoupon = useCouponStore((s) => s.clear);
  const addOrder = useOrderStore((s) => s.addOrder);
  // เผื่อที่ให้แถบ gesture/ปุ่มนำทางของเครื่อง
  const insets = useSafeAreaInsets();

  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;

  // ถ้าลบของออกจนยอดต่ำกว่าขั้นต่ำ ส่วนลดต้องไม่ถูกนำมาคิด
  const couponBelowMin =
    appliedCoupon !== null && subtotal < appliedCoupon.minSpend;
  const discount = useMemo(
    () =>
      calcDiscount(
        couponBelowMin ? null : appliedCoupon,
        subtotal,
        deliveryFee
      ),
    [couponBelowMin, appliedCoupon, subtotal, deliveryFee]
  );
  const grandTotal = subtotal + deliveryFee - discount.total;

  const renderRow = useCallback(
    ({ item }: { item: CartItem }) => (
      <CartRow
        item={item}
        onIncrease={increase}
        onDecrease={decrease}
        onRemove={remove}
      />
    ),
    [increase, decrease, remove]
  );

  const listFooter = useMemo(() => <CouponSection subtotal={subtotal} />, [
    subtotal,
  ]);

  const handleCheckout = () => {
    const orderId = `OD-${Date.now().toString().slice(-8)}`;

    // บันทึกออร์เดอร์ก่อนล้างตะกร้า ไม่งั้น items จะกลายเป็นว่าง
    addOrder({
      id: orderId,
      items,
      subtotal,
      deliveryFee,
      discount: discount.total,
      couponCode: discount.total > 0 && appliedCoupon ? appliedCoupon.code : null,
      total: grandTotal,
      createdAt: Date.now(),
    });

    clear(); // เคลียร์ตะกร้าให้เป็นศูนย์
    clearCoupon(); // โค้ดใช้ได้ครั้งเดียวต่อออร์เดอร์
    // reset stack → [Home, Success] เพื่อไม่ให้กด Back กลับมาหน้า Cart ได้
    navigation.reset({
      index: 1,
      routes: [{ name: "Home" }, { name: "Success", params: { orderId } }],
    });
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyText}>ตะกร้าของคุณยังว่างอยู่</Text>
        <TouchableOpacity
          style={styles.emptyBtn}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.emptyBtnText}>ไปเลือกเมนูอาหาร</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={cartKeyExtractor}
        contentContainerStyle={styles.list}
        renderItem={renderRow}
        ListFooterComponent={listFooter}
        keyboardShouldPersistTaps="handled"
      />

      {/* สรุปบิล */}
      <View style={[styles.summary, { paddingBottom: 28 + insets.bottom }]}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>ราคารวมอาหาร (Subtotal)</Text>
          <Text style={styles.summaryValue}>{baht(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>ค่าจัดส่ง (Delivery Fee)</Text>
          <Text
            style={[
              styles.summaryValue,
              discount.deliveryDiscount > 0 && styles.strikethrough,
            ]}
          >
            {baht(deliveryFee)}
          </Text>
        </View>

        {discount.total > 0 && appliedCoupon && (
          <View style={styles.summaryRow}>
            <Text style={styles.discountLabel}>
              ส่วนลด ({appliedCoupon.code})
            </Text>
            <Text style={styles.discountValue} testID="text-discount">
              -{baht(discount.total)}
            </Text>
          </View>
        )}

        {couponBelowMin && (
          <Text style={styles.warnText} testID="text-coupon-warning">
            ยอดอาหารต่ำกว่าขั้นต่ำของโค้ด {appliedCoupon.code} —
            ส่วนลดยังไม่ถูกนำมาคิด
          </Text>
        )}

        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.grandLabel}>ยอดรวมสุทธิ (Grand Total)</Text>
          <Text style={styles.grandValue}>{baht(grandTotal)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleCheckout}
          testID="btn-checkout"
        >
          <Text style={styles.checkoutText}>สั่งซื้อ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  list: { padding: 12 },
  summary: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 14, color: COLORS.textMuted },
  summaryValue: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  strikethrough: {
    textDecorationLine: "line-through",
    color: COLORS.textMuted,
  },
  discountLabel: { fontSize: 14, fontWeight: "600", color: COLORS.success },
  discountValue: { fontSize: 14, fontWeight: "800", color: COLORS.success },
  warnText: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 2,
    marginBottom: 4,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  grandLabel: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  grandValue: { fontSize: 18, fontWeight: "800", color: COLORS.primary },
  checkoutBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  checkoutText: { color: COLORS.white, fontSize: 16, fontWeight: "800" },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyIcon: { fontSize: 56 },
  emptyText: { fontSize: 16, color: COLORS.textMuted, marginTop: 12 },
  emptyBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyBtnText: { color: COLORS.white, fontWeight: "700" },
});

export default CartScreen;
