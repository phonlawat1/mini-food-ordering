import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { COLORS } from '../theme';

/** ทักทายตามช่วงเวลาของวัน */
const greetingByHour = (hour: number) => {
  if (hour < 12) {
    return 'สวัสดีตอนเช้า';
  }
  if (hour < 17) {
    return 'สวัสดีตอนบ่าย';
  }
  return 'สวัสดีตอนเย็น';
};

const UserGreeting: React.FC = () => {
  const username = useAuthStore(s => s.username);
  // คำนวณครั้งเดียวต่อการเข้าหน้า ไม่ต้องสร้าง Date ใหม่ทุก render
  const greeting = useMemo(() => greetingByHour(new Date().getHours()), []);

  if (!username) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {username.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.username} numberOfLines={1} testID="text-username">
          {username}
        </Text>
      </View>
      <Text style={styles.wave}>👋</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  info: { flex: 1, marginLeft: 10 },
  greeting: { fontSize: 12, color: COLORS.textMuted },
  username: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  wave: { fontSize: 20 },
});

export default UserGreeting;
