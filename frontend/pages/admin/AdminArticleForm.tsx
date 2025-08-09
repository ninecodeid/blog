import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, FileText, Image as ImageIcon, Link as LinkIcon, Download, Eye, EyeOff, Sparkles } from "lucide-react";
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
      <div className="p-6 lg:p-8">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/articles")}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl p-3"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {isEdit ? "Edit Artikel" : "Buat Artikel Baru"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {isEdit ? "Perbarui artikel yang sudah ada" : "Tulis artikel teknologi terbaru"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Informasi Dasar</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                    Judul Artikel *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-lg"
                    placeholder="Masukkan judul artikel yang menarik..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                    Deskripsi Singkat *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none"
                    placeholder="Tulis deskripsi singkat yang menggambarkan artikel..."
                    rows={4}
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {formData.description.length}/200 karakter
                  </p>
                </div>

                <div>
                  <Label htmlFor="content" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                    Konten Artikel *
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    className="border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none"
                    placeholder="Tulis konten lengkap artikel di sini..."
                    rows={16}
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {formData.content.split(' ').length} kata • {Math.ceil(formData.content.split(' ').length / 200)} menit baca
                  </p>
                </div>
              </div>
            </div>

            {/* Media & Links Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Media & Tautan</h2>
              </div>

              <div className="space-y-6">
                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url) => handleInputChange("imageUrl", url)}
                  onRemove={() => handleInputChange("imageUrl", "")}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="link" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="w-4 h-4" />
                        <span>Link Eksternal</span>
                      </div>
                    </Label>
                    <Input
                      id="link"
                      value={formData.link}
                      onChange={(e) => handleInputChange("link", e.target.value)}
                      className="h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                      placeholder="https://example.com"
                      type="url"
                    />
                  </div>

                  <div>
                    <Label htmlFor="downloadLink" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                      <div className="flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Link Download</span>
                      </div>
                    </Label>
                    <Input
                      id="downloadLink"
                      value={formData.downloadLink}
                      onChange={(e) => handleInputChange("downloadLink", e.target.value)}
                      className="h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                      placeholder="https://example.com/download"
                      type="url"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  {formData.published ? (
                    <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Publikasi</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <Label htmlFor="published" className="text-gray-700 dark:text-gray-300 font-semibold">
                      Status Publikasi
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formData.published ? "Artikel akan terlihat publik" : "Artikel disimpan sebagai draft"}
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => handleInputChange("published", checked)}
                  />
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                    Kategori *
                  </Label>
                  <Select
                    value={formData.categoryId.toString()}
                    onValueChange={(value) => handleInputChange("categoryId", parseInt(value))}
                  >
                    <SelectTrigger className="h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                      <SelectValue placeholder="Pilih kategori artikel" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
                      {categoriesData?.categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            {formData.title && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-700/50 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Preview</h3>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {formData.title}
                  </h4>
                  {formData.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {formData.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formData.published ? "Dipublikasi" : "Draft"}</span>
                    {categoriesData?.categories?.find(c => c.id === formData.categoryId) && (
                      <>
                        <span>•</span>
                        <span>{categoriesData.categories.find(c => c.id === formData.categoryId)?.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/articles")}
            className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full sm:w-auto h-12 rounded-xl"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full sm:w-auto h-12 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0"
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{isEdit ? "Memperbarui..." : "Menyimpan..."}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{isEdit ? "Perbarui" : "Simpan"} Artikel</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
