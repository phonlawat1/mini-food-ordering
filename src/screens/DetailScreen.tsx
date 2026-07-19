import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../types";
import { getFoodById, CATEGORIES } from "../data/foods";
import { useCartStore } from "../store/useCartStore";
import QuantityStepper from "../components/QuantityStepper";
import { COLORS, baht } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

const DetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const food = getFoodById(route.params.foodId);
  const [qty, setQty] = useState(1);
  const addToCart = useCartStore((s) => s.addToCart);
  // เผื่อที่ให้แถบ gesture/ปุ่มนำทางของเครื่อง ไม่งั้นแถบล่างโดนกินขอบ
  const insets = useSafeAreaInsets();

  if (!food) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>ไม่พบเมนูนี้</Text>
      </View>
    );
  }

  const categoryLabel =
    CATEGORIES.find((c) => c.id === food.category)?.label ?? "";
  const total = food.price * qty;

  const handleAddToCart = () => {
    addToCart(food, qty);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: 120 + insets.bottom },
        ]}
      >
        <Image source={food.image} style={styles.image} />
        <View style={styles.body}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{categoryLabel}</Text>
          </View>
          <Text style={styles.name}>{food.name}</Text>
          <Text style={styles.price}>{baht(food.price)}</Text>
          <Text style={styles.descTitle}>รายละเอียด</Text>
          <Text style={styles.desc}>{food.description}</Text>

          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>จำนวน</Text>
            <QuantityStepper
              qty={qty}
              onIncrease={() => setQty((q) => q + 1)}
              onDecrease={() => setQty((q) => Math.max(1, q - 1))}
            />
          </View>
        </View>
      </ScrollView>

      {/* แถบล่าง: ราคารวม + Add to Cart */}
      <View style={[styles.bottomBar, { paddingBottom: 12 + insets.bottom }]}>
        <View>
          <Text style={styles.totalLabel}>ราคารวม (x{qty})</Text>
          <Text style={styles.totalPrice}>{baht(total)}</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAddToCart}
          testID="btn-add-to-cart"
        >
          <Text style={styles.addBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { fontSize: 16, color: COLORS.textMuted },
  scroll: { paddingBottom: 120 },
  image: { width: "100%", height: 260, backgroundColor: COLORS.border },
  body: { padding: 16 },
  chip: {
    alignSelf: "flex-start",
    backgroundColor: "#FFEFE8",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipText: { color: COLORS.primaryDark, fontSize: 12, fontWeight: "700" },
  name: { fontSize: 24, fontWeight: "800", color: COLORS.text, marginTop: 10 },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: 6,
  },
  descTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 18,
  },
  desc: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 22,
    marginTop: 6,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyLabel: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: { fontSize: 12, color: COLORS.textMuted },
  totalPrice: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 13,
  },
  addBtnText: { color: COLORS.white, fontSize: 15, fontWeight: "700" },
});

export default DetailScreen;
