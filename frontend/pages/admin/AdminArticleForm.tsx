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
import ImageUpload from "../../components/ImageUpload";
import type { CreateArticleRequest, UpdateArticleRequest } from "~backend/blog/types";

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
    categoryId: 0,
    published: false,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        return await backend.blog.listCategories();
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        throw err;
      }
    },
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
        categoryId: article.categoryId,
        published: article.published,
      });
    }
  }, [article]);

  useEffect(() => {
    if (!isEdit && categoriesData?.categories && categoriesData.categories.length > 0 && formData.categoryId === 0) {
      setFormData(prev => ({ ...prev, categoryId: categoriesData.categories[0].id }));
    }
  }, [categoriesData, isEdit, formData.categoryId]);

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

    if (formData.categoryId === 0) {
      toast({
        title: "Error",
        description: "Kategori harus dipilih",
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

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isEdit && isLoading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/articles")}
            className="text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {isEdit ? "Edit Artikel" : "Tambah Artikel"}
            </h1>
            <p className="text-gray-600">
              {isEdit ? "Perbarui artikel yang sudah ada" : "Buat artikel baru"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <Label htmlFor="title" className="text-gray-700 font-medium">
                Judul *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Masukkan judul artikel"
                required
              />
            </div>

            <div className="lg:col-span-2">
              <Label htmlFor="description" className="text-gray-700 font-medium">
                Deskripsi Singkat *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Masukkan deskripsi singkat artikel"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-gray-700 font-medium">
                Kategori *
              </Label>
              <Select
                value={formData.categoryId.toString()}
                onValueChange={(value) => handleInputChange("categoryId", parseInt(value))}
              >
                <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {categoriesData?.categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-2">
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => handleInputChange("imageUrl", url)}
                onRemove={() => handleInputChange("imageUrl", "")}
              />
            </div>

            <div>
              <Label htmlFor="link" className="text-gray-700 font-medium">
                Link Eksternal
              </Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => handleInputChange("link", e.target.value)}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://example.com"
                type="url"
              />
            </div>

            <div>
              <Label htmlFor="downloadLink" className="text-gray-700 font-medium">
                Link Download
              </Label>
              <Input
                id="downloadLink"
                value={formData.downloadLink}
                onChange={(e) => handleInputChange("downloadLink", e.target.value)}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://example.com/download"
                type="url"
              />
            </div>

            <div className="lg:col-span-2">
              <Label htmlFor="content" className="text-gray-700 font-medium">
                Konten Lengkap *
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                <Label htmlFor="published" className="text-gray-700 font-medium">
                  Publikasikan artikel
                </Label>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/articles")}
              className="border-gray-300 text-gray-600 hover:bg-gray-50 w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
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
