import { Outlet } from "react-router-dom";
import PublicHeader from "../PublicHeader";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-800">
      <PublicHeader />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
