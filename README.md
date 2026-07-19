# Mini Food Ordering 🍜

แอปสั่งอาหารจำลอง (Mobile App Developer Skills Test) — React Native CLI (Bare) + TypeScript

## Tech Stack

| ส่วน | เทคโนโลยี |
|---|---|
| Framework | React Native 0.86 (CLI / Bare) |
| ภาษา | TypeScript ทั้งหมด |
| Navigation | React Navigation v7 (Native Stack) |
| State Management | Zustand — auth / cart / coupon / order |
| Safe Area | react-native-safe-area-context |
| ข้อมูล | Mock Data 28 เมนู + คูปอง 6 ใบ (ไม่ต่อ API) |
| รูปภาพ | Bundle ไว้ในแอป 28 ไฟล์ (~1.6 MB) |

## วิธีรัน

```bash
npm install        # โปรเจกต์นี้ติดตั้งด้วย pnpm ก็ได้ (มี pnpm-lock.yaml)

# Android
npm run android

# iOS (ครั้งแรกต้องติดตั้ง pods ก่อน)
cd ios && bundle install && bundle exec pod install && cd ..
npm run ios
```

## ฟีเจอร์ตามโจทย์

- **Login Screen** — ฟอร์ม Username/Password (mock ไม่ต่อ API) กด "เข้าสู่ระบบ" แล้วไปหน้า Home
- **Home Screen** — Grid เมนู 28 รายการ (รูป, ชื่อ, ราคา, ปุ่ม Add to Cart), ช่องค้นหา, แถบกรองหมวดหมู่ (All / ของคาว / ของหวาน / เครื่องดื่ม), กดการ์ดไปหน้า Detail
- **Food Detail Screen** — รูปใหญ่, ชื่อ, คำอธิบาย, ราคา, ปุ่ม +/− จำนวน พร้อมราคารวม (x จำนวน), Add to Cart ตามจำนวนที่เลือก
- **Cart Screen** — สรุปรายการทั้งหมด, แก้ไข Qty / ลบเมนูได้ (sync real-time), Subtotal + Delivery Fee (฿25) + Grand Total, กด "สั่งซื้อ" แล้วเคลียร์ตะกร้าและไปหน้า Success
- **Success Screen** — ไอคอนเครื่องหมายถูก, Mock Order ID, ปุ่มไปดูสถานะออร์เดอร์ และกลับหน้าหลัก (ใช้ `navigation.reset` จึงย้อนกลับหน้า Cart ไม่ได้)

## ฟีเจอร์ที่เพิ่มเข้ามา

### แถบเมนูลอยด้านล่าง (Floating Nav)

แถบ pill ลอยเหนือเนื้อหา 3 ปุ่ม — **หน้าหลัก / ตะกร้า / ออร์เดอร์** ปุ่มที่เปิดอยู่เป็นสีส้ม
ตะกร้ามี badge จำนวนชิ้น ออร์เดอร์มี badge จำนวนที่ยังส่งไม่ถึง (อัปเดต real-time ผ่าน Zustand selector)
กดตะกร้าตอนยังไม่ Login จะพาไปหน้า Login ก่อน แล้วพาไป Cart ต่อให้อัตโนมัติ

ไอคอนทั้งหมดวาดด้วย `View` ล้วน (`CartIcon` / `HomeIcon` / `OrdersIcon`) ไม่ได้ใช้ emoji
เพราะ emoji ระบายสีตามสถานะ active/inactive ไม่ได้ และไม่ได้ลงไลบรารีไอคอนเพิ่ม

### หน้าสถานะออร์เดอร์ (Orders)

แสดงออร์เดอร์เรียงใหม่สุดขึ้นก่อน แต่ละใบมีเลขที่, เวลาสั่ง, แถบความคืบหน้า 3 ขั้น
(กำลังเตรียมอาหาร → กำลังจัดส่ง → จัดส่งสำเร็จ), รายการอาหาร และยอดเงินแยกส่วนลด

> ⚠️ ไม่มี backend จริง **สถานะจึงจำลองจากเวลาที่ผ่านไปตั้งแต่กดสั่ง**
> (0–30 วิ = กำลังเตรียม, 30–90 วิ = กำลังส่ง, หลังจากนั้น = สำเร็จ)
> หน้าจอเดินนาฬิกาทุกวินาทีเพื่อให้สถานะขยับเอง — ของจริงค่านี้ต้องมาจากเซิร์ฟเวอร์
> ดู `src/utils/order.ts`

### ส่วนลด / สิทธิพิเศษ (Coupon)

อยู่ในหน้าตะกร้า ก่อนกดสั่งซื้อ ใช้ได้ 2 ทาง:

1. **พิมพ์โค้ดเอง** — ตรวจครบทุกเงื่อนไข พร้อมข้อความบอกเหตุผลเมื่อใช้ไม่ได้
   (ไม่พบโค้ด / หมดอายุ / ไม่ใช่สิทธิ์ของบัญชีนี้ / ยอดไม่ถึงขั้นต่ำ)
2. **เลือกจากสิทธิของตัวเอง** — การ์ดเลื่อนแนวนอน โค้ดที่ยอดยังไม่ถึงขั้นต่ำจะเป็นสีเทา
   กดไม่ได้ และบอกว่าต้องสั่งเพิ่มอีกเท่าไหร่

รองรับ 3 แบบ: ลดเป็น % (มีเพดาน), ลดเป็นบาท, ส่งฟรี
โค้ดที่ระบุ `eligibleUsers` จะเป็นสิทธิเฉพาะบุคคล โชว์เฉพาะ user คนนั้น (ทดสอบด้วย username `augodz`)

จุดที่ระวังไว้:
- ลบของออกจนยอดต่ำกว่าขั้นต่ำ → ส่วนลดถูกตัดออกจากการคำนวณ พร้อมขึ้นคำเตือน (ไม่ใช่คิดส่วนลดต่อเงียบ ๆ)
- ส่วนลดไม่มีทางทำให้ยอดติดลบ
- Logout ล้างคูปองและประวัติออร์เดอร์ทิ้ง เพราะเป็นข้อมูลเฉพาะบุคคล

### อื่น ๆ

- **แถบทักทาย** บนสุดหน้า Home — avatar ตัวอักษรแรก + ทักทายตามช่วงเวลา + ชื่อผู้ใช้
  (แยกออกจากปุ่มออกจากระบบ เพราะชื่อผู้ใช้เป็นข้อมูลตัวตน ไม่ใช่ปุ่มกด)
- **Debounce การค้นหา 250 ms** — ช่องพิมพ์อัปเดตทันที แต่การกรอง/วาดลิสต์รอจนหยุดพิมพ์
- **ค้นหาจากคำอธิบายได้ด้วย** — พิมพ์ "กุ้ง" ก็เจอเมนูที่มีกุ้งเป็นวัตถุดิบ
- Empty state หน้า Cart, Orders และผลค้นหาไม่เจอ
- ลด Qty เหลือ 0 ในตะกร้า = ลบรายการออกอัตโนมัติ
- แสดงราคาแบบสกุลเงินไทย (฿) ทั้งแอป

## เรื่องที่ปรับเพื่อความลื่นไหล

| ปัญหา | วิธีแก้ |
|---|---|
| พิมพ์ค้นหา 1 ตัวอักษร → การ์ดทุกใบ re-render | `React.memo` + callback คงที่ผ่าน `useCallback` (การ์ดรับ `food` กลับไปเอง แทน closure ต่อใบ) |
| กด +/− ในตะกร้า 1 ครั้ง → ทุกแถววาดใหม่ | แยก `CartRow` ออกมาแล้ว memo |
| subscribe ทั้ง store ทำให้ re-render เกินจำเป็น | เลือกทีละ field (`useCartStore(s => s.items)`) — actions ของ zustand เป็น reference คงที่อยู่แล้ว |
| กรองลิสต์ทุก keystroke | debounce 250 ms |
| แถบล่าง/ปุ่มลอยโดนแถบ gesture ของเครื่องกิน | ใช้ `useSafeAreaInsets()` จริง (เดิมมี `SafeAreaProvider` แต่ไม่มีหน้าไหนเรียกใช้เลย) |

## โครงสร้างโปรเจกต์

```
src/
├── assets/foods/   # รูปอาหาร 28 ไฟล์ (bundle ในแอป)
├── components/
│   ├── icons/      # HomeIcon, OrdersIcon (วาดด้วย View)
│   ├── CartIcon, CartRow, CouponSection, FloatingNav
│   └── FoodCard, QuantityStepper, UserGreeting
├── data/           # foods.ts (28 เมนู), coupons.ts (6 ใบ)
├── hooks/          # useDebouncedValue
├── navigation/     # RootNavigator (Native Stack)
├── screens/        # Login, Home, Detail, Cart, Orders, Success
├── store/          # useAuthStore, useCartStore, useCouponStore, useOrderStore
├── utils/          # coupon (ตรวจ+คำนวณส่วนลด), order (สถานะ), search (กรองเมนู)
├── theme.ts        # สี + format ราคา
└── types/          # Types + RootStackParamList
```

Logic ที่คำนวณจริงถูกแยกออกมาไว้ใน `utils/` เป็นฟังก์ชันบริสุทธิ์ เพื่อให้เขียนเทสต์ครอบได้
โดยไม่ต้อง render component

## การทดสอบ

```bash
npx tsc --noEmit   # type-check
npm run lint       # ESLint
npm test           # Jest — 2 suites / 10 tests
```

`__tests__/search.test.ts` ครอบการค้นหาภาษาไทยไว้ 9 เคส (ค้นชื่อ, คำกลางชื่อ,
สระ/วรรณยุกต์ต้องตรง, ตัดช่องว่าง, ผสมหมวดหมู่, ไม่สนตัวพิมพ์เล็ก-ใหญ่ของอังกฤษ)

> หมายเหตุ: `jest.config.js` ต้องยอมให้ `.pnpm` ผ่าน `transformIgnorePatterns`
> เพราะ pnpm วางไฟล์ไว้ที่ `node_modules/.pnpm/<pkg>/node_modules/<pkg>/`
> ถ้าไม่แก้ ESM ของ react-native จะไม่ถูก transform แล้วเทสต์รันไม่ขึ้นเลย

## ข้อจำกัดที่รู้อยู่

- **ไม่มีการเก็บข้อมูลถาวร** — ปิดแอปแล้วตะกร้า/ออร์เดอร์/การ login หายหมด
  (ถ้าต้องการต้องเพิ่ม AsyncStorage + zustand persist middleware)
- **สถานะออร์เดอร์เป็นการจำลอง** ตามเวลา ไม่ได้มาจากเซิร์ฟเวอร์
- **Login ไม่ตรวจรหัสผ่านจริง** กรอกอะไรก็เข้าได้ ขอแค่ไม่เว้นว่าง
- แถบเมนูลอยแสดงเฉพาะหน้า Home และ Orders — หน้า Cart กับ Detail มีแถบล่างของตัวเองอยู่แล้ว

### พิมพ์ภาษาไทยบน Android Emulator ไม่ได้?

ไม่ใช่บั๊กของแอป — เกิดจาก `hw.keyboard=yes` ใน AVD config ทำให้ emulator ส่ง
**สแกนโค้ดดิบของปุ่ม** ผ่านไปให้ Android แล้วแปลงตาม keymap แบบ US
ตัวอักษรไทยที่ Windows IME ประกอบเสร็จแล้วจึงหายไประหว่างทาง

แก้ได้ 3 ทาง: copy-paste จาก host (Ctrl+V), ตั้ง `hw.keyboard=no` แล้วใช้คีย์บอร์ดบนจอ,
หรือรันบนมือถือจริง

## เครดิตรูปภาพ

รูปอาหารทั้ง 28 ไฟล์มาจาก [Wikimedia Commons](https://commons.wikimedia.org/)
ดาวน์โหลดมาเก็บไว้ในโปรเจกต์เพื่อให้แอปโหลดได้เร็วและไม่ต้องพึ่งเน็ต

> ⚠️ ก่อนนำไปใช้งานจริงต้องไปตรวจสัญญาอนุญาตของแต่ละไฟล์ที่ Commons ก่อน
> (ส่วนใหญ่เป็น CC BY-SA ซึ่งต้องให้เครดิตผู้ถ่ายและระบุสัญญาอนุญาต)
> โปรเจกต์นี้เป็นงานทดสอบ/เรียนรู้ จึงยังไม่ได้ใส่เครดิตรายไฟล์

---
ผู้จัดทำ: Aujei (phonlawat.chi@gmail.com)
