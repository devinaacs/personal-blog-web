export type Clapper = {
  id: string;
  readerId: string;
  count: number;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Sharer = {
  id: string;
  readerId: string;
  platform: string;
  userAgent: string | null;
  createdAt: string;
};

export type PostEngagement = {
  clapCount: number;
  shareCount: number;
  clappers: Clapper[];
  sharers: Sharer[];
};
