import { Outlet } from "react-router-dom";
import PublicHeader from "../PublicHeader";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <PublicHeader />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
