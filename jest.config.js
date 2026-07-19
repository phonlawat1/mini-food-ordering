module.exports = {
  preset: '@react-native/jest-preset',
  // โปรเจกต์นี้ติดตั้งด้วย pnpm ทำให้ path จริงเป็น
  // node_modules/.pnpm/<pkg>@<ver>/node_modules/<pkg>/...
  // จึงต้องยอมให้ .pnpm ผ่านด้วย ไม่งั้น ESM ของ react-native จะไม่ถูก transform
  transformIgnorePatterns: [
    'node_modules/(?!(\\.pnpm|(jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-screens|react-native-safe-area-context)/)',
  ],
};
