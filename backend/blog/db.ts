import { SQLDatabase } from "encore.dev/storage/sqldb";

export const blogDB = new SQLDatabase("blog", {
  migrations: "./migrations",
});
