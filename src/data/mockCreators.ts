export interface Creator {
  id: string;
  handle: string;
  avatar: string;
  country: string;
  authStatus: "authorized" | "unauthorized";
  tags: string[];
  followers: number;
  mentions: number;
  totalViews: number;
  engagement: number;
  launchedAds: number;
  videos: string[];
}

export const CREATOR_TAGS = [
  "Collaborator",
  "DG-NEW tag",
  "Zhiyuan Pre L...",
  "Travel",
  "Beauty",
  "Gaming",
  "Fashion",
  "Food",
  "Fitness",
  "Tech",
];

export const mockCreators: Creator[] = [
  {
    id: "1",
    handle: "nancy_tiktok0",
    avatar: "",
    country: "Japan",
    authStatus: "authorized",
    tags: ["Collaborator", "DG-NEW tag", "Zhiyuan Pre L..."],
    followers: 10000,
    mentions: 103,
    totalViews: 5100,
    engagement: 0.16,
    launchedAds: 6,
    videos: [],
  },
  {
    id: "2",
    handle: "usts_aio_test_1",
    avatar: "",
    country: "United States of America",
    authStatus: "unauthorized",
    tags: ["Collaborator"],
    followers: 52900,
    mentions: 62,
    totalViews: 144400,
    engagement: 0.15,
    launchedAds: 6,
    videos: [],
  },
  {
    id: "3",
    handle: "usts_aio_test_4",
    avatar: "",
    country: "United States of America",
    authStatus: "unauthorized",
    tags: ["Collaborator"],
    followers: 10000,
    mentions: 16,
    totalViews: 616,
    engagement: 0,
    launchedAds: 3,
    videos: [],
  },
  {
    id: "4",
    handle: "aio_jp_test1",
    avatar: "",
    country: "Japan",
    authStatus: "authorized",
    tags: ["Travel", "Gaming"],
    followers: 9,
    mentions: 8,
    totalViews: 16,
    engagement: 0,
    launchedAds: 0,
    videos: [],
  },
  {
    id: "5",
    handle: "user_gb_aio1",
    avatar: "",
    country: "United Kingdom",
    authStatus: "authorized",
    tags: ["Collaborator", "DG-NEW tag"],
    followers: 6100,
    mentions: 7,
    totalViews: 4200,
    engagement: 0.87,
    launchedAds: 0,
    videos: [],
  },
  {
    id: "6",
    handle: "test_za_dg",
    avatar: "",
    country: "South Africa",
    authStatus: "unauthorized",
    tags: ["Collaborator"],
    followers: 0,
    mentions: 7,
    totalViews: 232,
    engagement: 0,
    launchedAds: 2,
    videos: [],
  },
  {
    id: "7",
    handle: "id_test_028",
    avatar: "",
    country: "Indonesia",
    authStatus: "unauthorized",
    tags: ["Beauty", "Fashion"],
    followers: 3,
    mentions: 7,
    totalViews: 9,
    engagement: 0,
    launchedAds: 0,
    videos: [],
  },
  {
    id: "8",
    handle: "tto_us_2",
    avatar: "",
    country: "United States of America",
    authStatus: "unauthorized",
    tags: ["Collaborator", "Tech"],
    followers: 0,
    mentions: 7,
    totalViews: 0,
    engagement: 0,
    launchedAds: 5,
    videos: [],
  },
  {
    id: "9",
    handle: "gaming_star_99",
    avatar: "",
    country: "Japan",
    authStatus: "authorized",
    tags: ["Gaming", "Tech"],
    followers: 25000,
    mentions: 45,
    totalViews: 89000,
    engagement: 2.3,
    launchedAds: 12,
    videos: [],
  },
  {
    id: "10",
    handle: "beauty_guru_uk",
    avatar: "",
    country: "United Kingdom",
    authStatus: "authorized",
    tags: ["Beauty", "Fashion", "Travel"],
    followers: 180000,
    mentions: 230,
    totalViews: 520000,
    engagement: 4.5,
    launchedAds: 18,
    videos: [],
  },
];

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}
