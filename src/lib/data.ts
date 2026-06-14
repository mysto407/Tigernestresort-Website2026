import type { Room, DiningOption, Attraction, NavLink } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Rooms", href: "/rooms" },
  { label: "Dining", href: "/dining" },
  { label: "About", href: "/about" },
];

export const ROOMS: Room[] = [
  {
    id: "deluxe",
    name: "Deluxe Room",
    description:
      "Thoughtfully designed with wood-furnished interiors and traditional Bhutanese accents. Our Deluxe Rooms offer a serene retreat with garden or valley views, morning tea service, and all the comforts of home.",
    capacity: 3,
    image: "/tnrPhotos/5.jpg",
    images: [
      "/tnrPhotos/rooms/deluxe1.png",
      "/tnrPhotos/rooms/deluxe2.png",
      "/tnrPhotos/rooms/deluxe3.png",
      "/tnrPhotos/rooms/deluxe5.png",
      "/tnrPhotos/rooms/deluxe6.png",
    ],
    features: [
      "Double or twin bed configuration",
      "Valley or garden views",
      "Morning tea service",
      "Ensuite bathroom",
      "Traditional Bhutanese décor",
      "Tea and Coffee Maker",
      "Hair Dryer",
      "Wi-Fi",
      "Toiletries",
      "Extra Bed Available",
      "Extra Linen, Blanket and Pillow Available",
    ],
  },
  {
    id: "suite",
    name: "Suite",
    description:
      "Spacious and elegantly appointed, our Suites feature a generous bedroom, a dedicated sitting area, and a private balcony with sweeping views of Paro Valley. The perfect space to unwind after a day of exploration.",
    capacity: 2,
    image: "/tnrPhotos/37.jpg",
    images: [
      "/tnrPhotos/37.jpg",
      "/tnrPhotos/rooms/Suit1.jpg",
      "/tnrPhotos/rooms/Suit2.jpg",
      "/tnrPhotos/rooms/Suit3.jpg",
      "/tnrPhotos/rooms/Suit4.jpg",
    ],
    features: [
      "King-size bed",
      "Private balcony with valley views",
      "Separate sitting area",
      "Premium bathroom amenities",
      "Traditional Bhutanese textiles",
      "Complimentary minibar",
      "Tea and Coffee Maker",
      "Hair Dryer",
      "Wi-Fi",
      "Toiletries",
      "Extra Bed Available",
      "Extra Linen, Blanket and Pillow Available",
    ],
  },
  {
    id: "cottage",
    name: "Cottage Room",
    description:
      "Ideal for families and those seeking extra space, our Cottage Rooms come with a private lounge, surrounded by lush gardens and scenic mountain views — a tranquil hideaway within the resort.",
    capacity: 4,
    image: "/tnrPhotos/29.jpg",
    images: [
      "/tnrPhotos/rooms/cottage1.png",
      "/tnrPhotos/rooms/cottage2.png",
      "/tnrPhotos/rooms/cottage3.jpg",
      "/tnrPhotos/rooms/cottage4.jpg",
    ],
    features: [
      "Multiple bed configurations",
      "Private garden lounge",
      "Mountain and valley views",
      "Family-friendly layout",
      "Ensuite bathroom",
      "In-room safe",
      "Tea and Coffee Maker",
      "Hair Dryer",
      "Wi-Fi",
      "Toiletries",
      "Extra Bed Available",
      "Extra Linen, Blanket and Pillow Available",
    ],
  },
];

export const DINING: DiningOption[] = [
  {
    id: "main-restaurant",
    name: "Paro Valley Kitchen",
    description:
      "Our main dining room celebrates the rich culinary heritage of Bhutan. From hearty Ema Datshi — the national dish of chillies and cheese — to delicate red rice dishes, every meal is a cultural journey. International options are also available for guests seeking familiar flavours.",
    type: "Main Restaurant",
    image: "/tnrPhotos/3.jpg",
  },
  {
    id: "bonfire",
    name: "Bonfire Terrace",
    description:
      "As the Himalayan night air cools, gather around our open bonfire terrace for traditional cultural performances, local stories, and light bites under a canopy of stars. An experience unique to Tiger's Nest Resort.",
    type: "Outdoor Experience",
    image: "/tnrPhotos/8.jpg",
  },
  {
    id: "breakfast",
    name: "Morning Spread",
    description:
      "Begin each day with a wholesome spread of local and continental options. Fresh fruits, Bhutanese butter tea, warm bread, and eggs prepared to your liking — all enjoyed with views of the valley waking up.",
    type: "Breakfast",
    image: "/tnrPhotos/19.jpg",
  },
];

export const ATTRACTIONS: Attraction[] = [
  {
    id: "taktsang",
    name: "Tiger's Nest Monastery",
    description:
      "Taktsang Palphug Monastery — one of Buddhism's most sacred sites — clings to a cliff face 3,120 metres above sea level. The hike to the monastery is among the most iconic in the world, rewarding visitors with breathtaking views and deep spiritual significance.",
    tripToBase: "1.5 km",
    hikeDistance: "9 km return",
    totalTime: "5–6 hrs",
    image: "/tnrPhotos/38.jpg",
    images: ["/tnrPhotos/tigersnest1.jpg", "/tnrPhotos/tigersnest2.jpg"],
  },
  {
    id: "drugyel",
    name: "Drugyel Dzong",
    description:
      "Built by Tenzin Drukdra in 1649 to commemorate victory over an invasion from Tibet, this historic fortress stands as a powerful symbol of Bhutanese resilience and heritage. Dramatic views of Mount Jomolhari on clear days.",
    tripToBase: "14 km",
    totalTime: "2–3 hrs",
    image: "/tnrPhotos/Drugyal1.jpg",
    images: ["/tnrPhotos/Drugyal1.jpg", "/tnrPhotos/Drugyal2.jpg"],
  },
  {
    id: "bumdrak",
    name: "Bumdrak Monastery",
    description:
      "A sacred high-altitude monastery blessed by Guru Padmasambhava and his consort Yeshe Tsogyel. The site is revered for its cliff imprints said to represent a hundred thousand footprints, offering a profound pilgrimage experience.",
    tripToBase: "1.5 km",
    hikeDistance: "14 km return",
    totalTime: "Full day (8–10 hrs)",
    image: "/tnrPhotos/Bumdrak1.png",
    images: ["/tnrPhotos/Bumdrak1.png", "/tnrPhotos/Bumdrak2.png"],
  },
  {
    id: "kyichu",
    name: "Kyichu Lhakhang",
    description:
      "One of Bhutan's oldest and most sacred temples, believed to have been built in the 7th century by Tibetan Emperor Songtsen Gampo. The temple's serene courtyards and ancient prayer wheels offer a deeply moving cultural experience.",
    tripToBase: "3 km",
    totalTime: "1–2 hrs",
    image: "/tnrPhotos/kyichu1.jpg",
    images: ["/tnrPhotos/kyichu1.jpg", "/tnrPhotos/kyichu2.jpg"],
  },
];

export const CONTACT = {
  phone: "+975 77190270",
  whatsapp: "+975 77190270",
  address: "Satsam Chorten, Paro, Bhutan",
  offer: "Book directly to get 50% OFF",
};

// Social links — replace the placeholder URLs with the real profiles.
export const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "Facebook", href: "https://facebook.com/" },
];
