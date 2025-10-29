export type ExamConfig = {
  id: number;
  bg: string;
  title?: string;
};

export function bgFor(id: number): string {
  // Images should be placed at: static/assets/images/backgrounds/exam/{id}.png
  return `/assets/images/backgrounds/exam/${id}.png`;
}

export function examConfig(id: number): ExamConfig {
  return { id, bg: bgFor(id) };
}

