export type Animal = {
  id: string;
  name: string;
  image_url: string;
  base_rate: number;
};

export type PlacedAnimal = Animal & {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};
