import { api } from "encore.dev/api";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

// Admin login endpoint.
export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req) => {
    // Simple hardcoded credentials - in production, use proper password hashing
    if (req.username === "endie" && req.password === "endie") {
      return {
        token: "admin-token-endie",
        user: {
          id: "admin",
          username: "endie",
        },
      };
    }

    throw new Error("Invalid credentials");
  }
);
