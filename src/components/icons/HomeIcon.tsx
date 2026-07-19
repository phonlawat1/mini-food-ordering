import React, { useMemo } from 'react';
import { View } from 'react-native';
import { COLORS } from '../../theme';

interface Props {
  size?: number;
  color?: string;
}

/** ไอคอนบ้าน วาดด้วย View — หลังคาใช้เทคนิค border สร้างสามเหลี่ยม */
const HomeIcon: React.FC<Props> = ({ size = 22, color = COLORS.text }) => {
  const s = useMemo(() => {
    const roofH = size * 0.42;
    const bodyW = size * 0.62;
    const bodyH = size * 0.44;
    const stroke = Math.max(1.5, size * 0.09);

    return {
      box: {
        width: size,
        height: size,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
      roof: {
        width: 0,
        height: 0,
        borderLeftWidth: size * 0.5,
        borderRightWidth: size * 0.5,
        borderBottomWidth: roofH,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
      },
      body: {
        width: bodyW,
        height: bodyH,
        borderWidth: stroke,
        borderTopWidth: 0,
        borderColor: color,
        borderBottomLeftRadius: stroke,
        borderBottomRightRadius: stroke,
      },
    };
  }, [size, color]);

  return (
    <View style={s.box}>
      <View style={s.roof} />
      <View style={s.body} />
    </View>
  );
};

export default React.memo(HomeIcon);
