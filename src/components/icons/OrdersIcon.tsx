import React, { useMemo } from 'react';
import { View } from 'react-native';
import { COLORS } from '../../theme';

interface Props {
  size?: number;
  color?: string;
}

/** ไอคอนใบเสร็จ/รายการสั่งซื้อ — กรอบสี่เหลี่ยมมน + ขีดบรรทัดข้างใน */
const OrdersIcon: React.FC<Props> = ({ size = 22, color = COLORS.text }) => {
  const s = useMemo(() => {
    const stroke = Math.max(1.5, size * 0.09);
    const lineH = Math.max(1.5, size * 0.08);

    return {
      box: {
        width: size,
        height: size,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
      sheet: {
        width: size * 0.72,
        height: size * 0.88,
        borderWidth: stroke,
        borderColor: color,
        borderRadius: size * 0.14,
        paddingHorizontal: size * 0.12,
        paddingTop: size * 0.16,
      },
      line: {
        height: lineH,
        borderRadius: lineH,
        backgroundColor: color,
        marginBottom: size * 0.11,
      },
      short: { width: '60%' as const },
      long: { width: '100%' as const },
    };
  }, [size, color]);

  return (
    <View style={s.box}>
      <View style={s.sheet}>
        <View style={[s.line, s.long]} />
        <View style={[s.line, s.long]} />
        <View style={[s.line, s.short]} />
      </View>
    </View>
  );
};

export default React.memo(OrdersIcon);
