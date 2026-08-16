export type Animal = {
  id: string;
  name: string;
  image_url: string;
  base_rate: number;
};

// ステータスを追加 ('entering': 入場中, 'active': 通常, 'leaving': 退場中)
export type PlacedAnimal = Animal & {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  status: "entering" | "active" | "walking-out";
};
