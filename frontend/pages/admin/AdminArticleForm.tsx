import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { ArticleCategory, CreateArticleRequest, UpdateArticleRequest } from "~backend/blog/types";

export default function AdminArticleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    link: "",
    downloadLink: "",
    category: "Tips" as ArticleCategory,
    published: false,
  });

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      if (!id) return null;
      try {
        return await backend.blog.get({ id: parseInt(id) });
      } catch (err) {
        console.error("Failed to fetch article:", err);
        throw err;
      }
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        description: article.description,
        content: article.content,
        imageUrl: article.imageUrl || "",
        link: article.link || "",
        downloadLink: article.downloadLink || "",
        category: article.category,
        published: article.published,
      });
    }
  }, [article]);

  const createMutation = useMutation({
    mutationFn: async (data: CreateArticleRequest) => {
      try {
        return await backend.blog.create(data);
      } catch (err) {
        console.error("Create error:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      toast({
        title: "Berhasil",
        description: "Artikel berhasil dibuat",
      });
      navigate("/admin/articles");
    },
    onError: (error) => {
      console.error("Create error:", error);
      toast({
        title: "Error",
        description: "Gagal membuat artikel",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateArticleRequest & { id: number }) => {
      const { id, ...updateData } = data;
      try {
        return await backend.blog.update({ id, ...updateData });
      } catch (err) {
        console.error("Update error:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["article", id] });
      toast({
        title: "Berhasil",
        description: "Artikel berhasil diperbarui",
      });
      navigate("/admin/articles");
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui artikel",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Judul, deskripsi, dan konten harus diisi",
        variant: "destructive",
      });
      return;
    }

    if (isEdit) {
      updateMutation.mutate({
        id: parseInt(id!),
        ...formData,
        imageUrl: formData.imageUrl || undefined,
        link: formData.link || undefined,
        downloadLink: formData.downloadLink || undefined,
      });
    } else {
      createMutation.mutate({
        ...formData,
        imageUrl: formData.imageUrl || undefined,
        link: formData.link || undefined,
        downloadLink: formData.downloadLink || undefined,
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isEdit && isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          <p className="text-gray-300 mt-4">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/articles")}
            className="text-gray-300 hover:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isEdit ? "Edit Artikel" : "Tambah Artikel"}
            </h1>
            <p className="text-gray-400">
              {isEdit ? "Perbarui artikel yang sudah ada" : "Buat artikel baru"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-slate-900 rounded-lg border border-slate-700 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <Label htmlFor="title" className="text-gray-300">
                Judul *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="mt-1 bg-slate-800 border-slate-600 text-white"
                placeholder="Masukkan judul artikel"
                required
              />
            </div>

            <div className="lg:col-span-2">
              <Label htmlFor="description" className="text-gray-300">
                Deskripsi Singkat *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="mt-1 bg-slate-800 border-slate-600 text-white"
                placeholder="Masukkan deskripsi singkat artikel"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-gray-300">
                Kategori *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value: ArticleCategory) => handleInputChange("category", value)}
              >
                <SelectTrigger className="mt-1 bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="Hardware" className="text-white">Hardware</SelectItem>
                  <SelectItem value="Software" className="text-white">Software</SelectItem>
                  <SelectItem value="Tips" className="text-white">Tips</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="imageUrl" className="text-gray-300">
                URL Gambar
              </Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                className="mt-1 bg-slate-800 border-slate-600 text-white"
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>

            <div>
              <Label htmlFor="link" className="text-gray-300">
                Link Eksternal
              </Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => handleInputChange("link", e.target.value)}
                className="mt-1 bg-slate-800 border-slate-600 text-white"
                placeholder="https://example.com"
                type="url"
              />
            </div>

            <div>
              <Label htmlFor="downloadLink" className="text-gray-300">
                Link Download
              </Label>
              <Input
                id="downloadLink"
                value={formData.downloadLink}
                onChange={(e) => handleInputChange("downloadLink", e.target.value)}
                className="mt-1 bg-slate-800 border-slate-600 text-white"
                placeholder="https://example.com/download"
                type="url"
              />
            </div>

            <div className="lg:col-span-2">
              <Label htmlFor="content" className="text-gray-300">
                Konten Lengkap *
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                className="mt-1 bg-slate-800 border-slate-600 text-white"
                placeholder="Masukkan konten lengkap artikel"
                rows={12}
                required
              />
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => handleInputChange("published", checked)}
                />
                <Label htmlFor="published" className="text-gray-300">
                  Publikasikan artikel
                </Label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/articles")}
              className="border-slate-600 text-gray-300 hover:bg-slate-800"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEdit ? "Perbarui" : "Simpan"} Artikel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
