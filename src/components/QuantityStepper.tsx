import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../theme';

interface Props {
  qty: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: 'small' | 'large';
}

const QuantityStepper: React.FC<Props> = ({
  qty,
  onIncrease,
  onDecrease,
  size = 'large',
}) => {
  const small = size === 'small';
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.btn, small && styles.btnSmall]}
        onPress={onDecrease}
        testID="stepper-decrease">
        <Text style={[styles.btnText, small && styles.btnTextSmall]}>−</Text>
      </TouchableOpacity>
      <Text style={[styles.qty, small && styles.qtySmall]}>{qty}</Text>
      <TouchableOpacity
        style={[styles.btn, small && styles.btnSmall]}
        onPress={onIncrease}
        testID="stepper-increase">
        <Text style={[styles.btnText, small && styles.btnTextSmall]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSmall: { width: 30, height: 30, borderRadius: 9 },
  btnText: { color: COLORS.white, fontSize: 22, fontWeight: '700', lineHeight: 26 },
  btnTextSmall: { fontSize: 16, lineHeight: 20 },
  qty: {
    minWidth: 44,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  qtySmall: { minWidth: 34, fontSize: 15 },
});

export default React.memo(QuantityStepper);
