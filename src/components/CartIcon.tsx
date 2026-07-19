import React, { useMemo } from 'react';
import { View } from 'react-native';
import { COLORS } from '../theme';

interface Props {
  size?: number;
  color?: string;
}

/**
 * ไอคอนตะกร้าที่วาดด้วย View ล้วน
 * เหตุผลที่ไม่ใช้ emoji 🛒 — emoji ระบายสีเองไม่ได้ จะติดสีประจำตัวมาเสมอ
 * ทำให้จมกับพื้นหลังสีส้ม อันนี้กำหนด color ได้อิสระ และคมทุกความละเอียดจอ
 */
const CartIcon: React.FC<Props> = ({ size = 22, color = COLORS.white }) => {
  const s = useMemo(() => {
    const stroke = Math.max(1.5, size * 0.09);
    const basketH = size * 0.44;
    const wheel = size * 0.17;

    return {
      box: { width: size, height: size },
      handle: {
        position: 'absolute' as const,
        left: 0,
        top: size * 0.1,
        width: size * 0.28,
        height: stroke,
        backgroundColor: color,
        borderRadius: stroke,
        transform: [{ rotate: '28deg' }],
      },
      basket: {
        position: 'absolute' as const,
        right: 0,
        top: size * 0.16,
        width: size * 0.74,
        height: basketH,
        borderWidth: stroke,
        borderColor: color,
        borderTopLeftRadius: stroke,
        borderTopRightRadius: stroke,
        borderBottomLeftRadius: basketH * 0.55,
        borderBottomRightRadius: basketH * 0.55,
      },
      wheelLeft: {
        position: 'absolute' as const,
        left: size * 0.36,
        bottom: 0,
        width: wheel,
        height: wheel,
        borderRadius: wheel / 2,
        backgroundColor: color,
      },
      wheelRight: {
        position: 'absolute' as const,
        right: size * 0.13,
        bottom: 0,
        width: wheel,
        height: wheel,
        borderRadius: wheel / 2,
        backgroundColor: color,
      },
    };
  }, [size, color]);

  return (
    <View style={s.box}>
      <View style={s.handle} />
      <View style={s.basket} />
      <View style={s.wheelLeft} />
      <View style={s.wheelRight} />
    </View>
  );
};

export default React.memo(CartIcon);
