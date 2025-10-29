export type ExamAnswer = {
  id: number;
  left: number;
  center: number;
  right: number;
};

export const examAnswers: Record<number, ExamAnswer> = {
  1: { id: 1, left: 2, center: 1, right: 3 },   // 16 + 7 = 23
  2: { id: 2, left: 2, center: 1, right: 1 },   // 14 + 7 = 21
  3: { id: 3, left: 4, center: 1, right: 1 },   // 35 + 6 = 41
  4: { id: 4, left: 3, center: 1, right: 2 },   // 16 + 16 = 32
  5: { id: 5, left: 3, center: 1, right: 2 },   // 15 + 17 = 32
  6: { id: 6, left: 4, center: 1, right: 0 },   // 22 + 18 = 40
  7: { id: 7, left: 3, center: 1, right: 0 },   // 13 + 17 = 30
  8: { id: 8, left: 4, center: 1, right: 0 },   // 23 + 17 = 40
  9: { id: 9, left: 5, center: 1, right: 0 },   // 26 + 24 = 50
  10:{ id: 10, left: 5, center: 1, right: 0 },  // 13 + 37 = 50
};

export function getExamAnswer(id: number): ExamAnswer | null {
  return examAnswers[id] ?? null;
}

