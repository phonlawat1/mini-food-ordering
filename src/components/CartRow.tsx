import React, { useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CartItem } from '../types';
import QuantityStepper from './QuantityStepper';
import { COLORS, baht } from '../theme';

interface Props {
  item: CartItem;
  /** รับ foodId กลับไป เพื่อให้ parent ส่ง callback ตัวเดิมได้ทุก render */
  onIncrease: (foodId: string) => void;
  onDecrease: (foodId: string) => void;
  onRemove: (foodId: string) => void;
}

const CartRow: React.FC<Props> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const id = item.food.id;
  const handleIncrease = useCallback(() => onIncrease(id), [onIncrease, id]);
  const handleDecrease = useCallback(() => onDecrease(id), [onDecrease, id]);
  const handleRemove = useCallback(() => onRemove(id), [onRemove, id]);

  return (
    <View style={styles.row}>
      <Image
        source={item.food.image}
        style={styles.image}
        resizeMethod="resize"
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.food.name}
        </Text>
        <Text style={styles.unitPrice}>{baht(item.food.price)} / รายการ</Text>
        <View style={styles.qtyRow}>
          <QuantityStepper
            size="small"
            qty={item.qty}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
          <Text style={styles.lineTotal}>
            {baht(item.food.price * item.qty)}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={handleRemove}
        testID={`remove-${id}`}>
        <Text style={styles.removeText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: COLORS.border,
  },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  unitPrice: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  lineTotal: { fontSize: 15, fontWeight: '800', color: COLORS.primary },
  removeBtn: { padding: 8, marginLeft: 4 },
  removeText: { fontSize: 18 },
});

export default React.memo(CartRow);
