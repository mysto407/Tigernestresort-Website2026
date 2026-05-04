export interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  features: string[];
  image?: string;
  images?: string[];
}

export interface DiningOption {
  id: string;
  name: string;
  description: string;
  type: string;
  image?: string;
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  distance?: string;
  tripToBase?: string;
  hikeDistance?: string;
  totalTime?: string;
  image?: string;
  images?: string[];
}

export interface NavLink {
  label: string;
  href: string;
}
