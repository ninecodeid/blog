import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PublicLayout from "./components/layouts/PublicLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminArticleForm from "./pages/admin/AdminArticleForm";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-slate-800">
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/article/:id" element={<ArticlePage />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="articles/new" element={<AdminArticleForm />} />
              <Route path="articles/:id/edit" element={<AdminArticleForm />} />
            </Route>
          </Routes>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}
