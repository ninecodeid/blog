import { Header, APIError } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

interface AuthParams {
  authorization?: Header<"Authorization">;
}

export interface AuthData {
  userID: string;
  username: string;
}

const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    const token = data.authorization?.replace("Bearer ", "");
    if (!token) {
      throw APIError.unauthenticated("missing token");
    }

    // Simple token validation - in production, use proper JWT or session management
    if (token === "admin-token-endie") {
      return {
        userID: "admin",
        username: "endie",
      };
    }

    throw APIError.unauthenticated("invalid token");
  }
);

export default auth;
