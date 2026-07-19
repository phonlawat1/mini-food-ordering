import React, { useCallback } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FoodItem } from '../types';
import { COLORS, baht } from '../theme';

interface Props {
  food: FoodItem;
  /** รับ food กลับไป เพื่อให้ฝั่ง parent ส่ง callback ตัวเดิมได้ทุก render */
  onPress: (food: FoodItem) => void;
  onAddToCart: (food: FoodItem) => void;
}

const FoodCard: React.FC<Props> = ({ food, onPress, onAddToCart }) => {
  const handlePress = useCallback(() => onPress(food), [onPress, food]);
  const handleAdd = useCallback(() => onAddToCart(food), [onAddToCart, food]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.85}>
      <Image
        source={food.image}
        style={styles.image}
        // ย่อรูปตั้งแต่ตอน decode ลดหน่วยความจำ/งาน GPU บน Android
        resizeMethod="resize"
        resizeMode="cover"
      />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {food.name}
        </Text>
        <Text style={styles.price}>{baht(food.price)}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    margin: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: { width: '100%', height: 110, backgroundColor: COLORS.border },
  body: { padding: 10 },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    minHeight: 36,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 4,
  },
  addBtn: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
});

export default React.memo(FoodCard);
