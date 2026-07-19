import { filterFoods } from '../src/utils/search';
import { FOODS } from '../src/data/foods';

describe('filterFoods — ค้นหาภาษาไทย', () => {
  it('ค้นจากชื่อเมนูภาษาไทยได้', () => {
    const result = filterFoods(FOODS, 'กะเพรา', 'all');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(f => f.name.includes('กะเพรา'))).toBe(true);
  });

  it('ค้นด้วยคำที่อยู่กลางชื่อได้', () => {
    const result = filterFoods(FOODS, 'ผัด', 'all');
    const names = result.map(f => f.name);
    expect(names).toEqual(expect.arrayContaining(['ผัดไทยกุ้งสด']));
  });

  it('ค้นจากคำอธิบายได้ด้วย (เช่นชื่อวัตถุดิบ)', () => {
    const result = filterFoods(FOODS, 'กุ้ง', 'all');
    expect(result.length).toBeGreaterThan(0);
  });

  it('ตัดช่องว่างหน้า-หลังก่อนค้น', () => {
    const padded = filterFoods(FOODS, '  ข้าวมันไก่  ', 'all');
    const exact = filterFoods(FOODS, 'ข้าวมันไก่', 'all');
    expect(padded).toEqual(exact);
  });

  it('สระ/วรรณยุกต์ต้องตรงกันจึงจะเจอ', () => {
    expect(filterFoods(FOODS, 'ต้มยำ', 'all').length).toBeGreaterThan(0);
    expect(filterFoods(FOODS, 'ตมยำ', 'all')).toHaveLength(0);
  });

  it('คำที่ไม่มีในเมนู ต้องได้ลิสต์ว่าง', () => {
    expect(filterFoods(FOODS, 'พิซซ่าฮาวายเอี้ยน', 'all')).toHaveLength(0);
  });

  it('ค้นภาษาอังกฤษไม่สนตัวพิมพ์เล็ก-ใหญ่', () => {
    const lower = filterFoods(FOODS, 'thai', 'all');
    const upper = filterFoods(FOODS, 'THAI', 'all');
    expect(lower).toEqual(upper);
  });

  it('ใช้คำค้นร่วมกับหมวดหมู่ได้', () => {
    const drinks = filterFoods(FOODS, '', 'drink');
    expect(drinks.length).toBeGreaterThan(0);
    expect(drinks.every(f => f.category === 'drink')).toBe(true);

    // คำที่มีอยู่จริงแต่คนละหมวด ต้องไม่ขึ้น
    expect(filterFoods(FOODS, 'กะเพรา', 'drink')).toHaveLength(0);
  });

  it('คำค้นว่าง = คืนทั้งหมดในหมวดนั้น', () => {
    expect(filterFoods(FOODS, '', 'all')).toHaveLength(FOODS.length);
    expect(filterFoods(FOODS, '   ', 'all')).toHaveLength(FOODS.length);
  });
});
