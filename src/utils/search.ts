import { CategoryId, FoodItem } from '../types';

/**
 * กรองเมนูตามคำค้นและหมวดหมู่
 * แยกออกมาจากหน้าจอเพื่อให้เขียนเทสต์ครอบได้ (โดยเฉพาะเคสภาษาไทย)
 */
export const filterFoods = (
  foods: FoodItem[],
  query: string,
  category: CategoryId,
): FoodItem[] => {
  const q = query.trim().toLowerCase();

  return foods.filter(f => {
    const matchCategory = category === 'all' || f.category === category;
    if (!matchCategory) {
      return false;
    }
    if (q === '') {
      return true;
    }
    // ค้นได้ทั้งจากชื่อและคำอธิบาย เผื่อผู้ใช้พิมพ์วัตถุดิบ เช่น "กุ้ง"
    return (
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q)
    );
  });
};
