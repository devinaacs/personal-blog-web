export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};
