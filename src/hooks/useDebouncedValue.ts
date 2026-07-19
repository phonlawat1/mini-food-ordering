import { useEffect, useState } from 'react';

/**
 * หน่วงค่าไว้จนกว่าผู้ใช้จะหยุดพิมพ์ครบ `delay` ms
 * ใช้คู่กับ TextInput: ให้ช่องพิมพ์อัปเดตทันที (ไม่หน่วงมือ)
 * แต่ให้งานหนักอย่างการ filter/render ลิสต์ รอค่าที่หน่วงแล้ว
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // พิมพ์ตัวถัดไปก่อนครบเวลา → ยกเลิกรอบเก่า
  }, [value, delay]);

  return debounced;
}
