import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Category, CategoryId, FoodItem, RootStackParamList } from "../types";
import { CATEGORIES, FOODS } from "../data/foods";
import { useCartStore } from "../store/useCartStore";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { filterFoods } from "../utils/search";
import FoodCard from "../components/FoodCard";
import FloatingNav from "../components/FloatingNav";
import UserGreeting from "../components/UserGreeting";
import { COLORS } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

// อยู่นอก component เพื่อให้เป็น reference เดิมตลอด FlatList จะได้ไม่ re-render ทั้งลิสต์
const foodKeyExtractor = (f: FoodItem) => f.id;
const categoryKeyExtractor = (c: Category) => c.id;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryId>("all");
  const addToCart = useCartStore((s) => s.addToCart);
  // การ์ดใบท้าย ๆ ต้องเลื่อนพ้นทั้งปุ่มตะกร้าลอยและแถบ gesture
  const insets = useSafeAreaInsets();

  // ช่องพิมพ์อัปเดตทันทีจาก `search` แต่การกรอง/วาดลิสต์รอค่าที่หน่วงแล้ว
  const debouncedSearch = useDebouncedValue(search, 250);

  const filteredFoods = useMemo(
    () => filterFoods(FOODS, debouncedSearch, category),
    [debouncedSearch, category]
  );

  const handlePressFood = useCallback(
    (food: FoodItem) => navigation.navigate("Detail", { foodId: food.id }),
    [navigation]
  );

  const handleAddToCart = useCallback((food: FoodItem) => addToCart(food, 1), [
    addToCart,
  ]);

  const renderFood = useCallback(
    ({ item }: { item: FoodItem }) => (
      <FoodCard
        food={item}
        onPress={handlePressFood}
        onAddToCart={handleAddToCart}
      />
    ),
    [handlePressFood, handleAddToCart]
  );

  const renderCategory = useCallback(
    ({ item }: { item: Category }) => {
      const active = category === item.id;
      return (
        <TouchableOpacity
          style={[styles.chip, active && styles.chipActive]}
          onPress={() => setCategory(item.id)}
        >
          <Text style={[styles.chipText, active && styles.chipTextActive]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    },
    [category]
  );

  return (
    <View style={styles.container}>
      {/* แถบทักทาย + ชื่อผู้ใช้ที่กำลังใช้งาน */}
      <UserGreeting />

      {/* ช่องค้นหา */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหาชื่ออาหาร..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
          testID="input-search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* แถบหมวดหมู่ */}
      <View style={styles.categoryRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={categoryKeyExtractor}
          contentContainerStyle={styles.categoryList}
          renderItem={renderCategory}
        />
      </View>

      {/* รายการอาหาร (Grid 2 คอลัมน์) */}
      <FlatList
        data={filteredFoods}
        keyExtractor={foodKeyExtractor}
        numColumns={2}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: 110 + insets.bottom },
        ]}
        ListEmptyComponent={
          <Text style={styles.empty}>ไม่พบเมนูที่ค้นหา 😢</Text>
        }
        renderItem={renderFood}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        keyboardShouldPersistTaps="handled"
      />

      <FloatingNav active="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    marginHorizontal: 12,
    marginTop: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
  },
  clearIcon: { fontSize: 14, color: COLORS.textMuted, padding: 4 },
  categoryRow: { marginTop: 10 },
  categoryList: { paddingHorizontal: 12 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: "600", color: COLORS.text },
  chipTextActive: { color: COLORS.white },
  list: { padding: 6, paddingBottom: 110 },
  empty: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 15,
    color: COLORS.textMuted,
  },
});

export default HomeScreen;
