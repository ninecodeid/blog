import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import backend from "~backend/client";
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "~backend/blog/types";

const colorOptions = [
  { name: "Biru", value: "#3B82F6" },
  { name: "Hijau", value: "#10B981" },
  { name: "Ungu", value: "#8B5CF6" },
  { name: "Merah", value: "#EF4444" },
  { name: "Kuning", value: "#F59E0B" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
];

export default function AdminCategories() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      try {
        return await backend.blog.listCategories();
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        throw err;
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateCategoryRequest) => {
      try {
        return await backend.blog.createCategory(data);
      } catch (err) {
        console.error("Create error:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Berhasil",
        description: "Kategori berhasil dibuat",
      });
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Create error:", error);
      toast({
        title: "Error",
        description: "Gagal membuat kategori",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateCategoryRequest & { id: number }) => {
      const { id, ...updateData } = data;
      try {
        return await backend.blog.updateCategory({ id, ...updateData });
      } catch (err) {
        console.error("Update error:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Berhasil",
        description: "Kategori berhasil diperbarui",
      });
      setEditingCategory(null);
      resetForm();
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui kategori",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        return await backend.blog.deleteCategory({ id });
      } catch (err) {
        console.error("Delete error:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Berhasil",
        description: "Kategori berhasil dihapus",
      });
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus kategori. Pastikan tidak ada artikel yang menggunakan kategori ini.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#3B82F6",
    });
  };

  const handleCreate = () => {
    setIsCreateOpen(true);
    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Nama kategori harus diisi",
        variant: "destructive",
      });
      return;
    }

    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        ...formData,
        description: formData.description || undefined,
      });
    } else {
      createMutation.mutate({
        ...formData,
        description: formData.description || undefined,
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg">Memuat kategori...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center py-20">
          <p className="text-red-600 dark:text-red-400">Gagal memuat kategori. Silakan coba lagi.</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            {error instanceof Error ? error.message : "Kesalahan tidak diketahui"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Tag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Kelola Kategori
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Kelola kategori artikel blog teknologi
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-0">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mx-4 max-w-md rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Tambah Kategori Baru</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300">
                  Buat kategori baru untuk mengorganisir artikel
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">
                      Nama Kategori *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      placeholder="Masukkan nama kategori"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 font-medium">
                      Deskripsi
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      placeholder="Masukkan deskripsi kategori"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300 font-medium">Warna</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                          className={`w-full h-10 rounded-lg border-2 transition-all ${
                            formData.color === color.value
                              ? "border-gray-900 dark:border-white scale-105"
                              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                    className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full sm:w-auto rounded-lg"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full sm:w-auto rounded-lg border-0"
                  >
                    {createMutation.isPending ? (
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Tag className="h-4 w-4 mr-2" />
                    )}
                    Simpan Kategori
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        {data?.categories && data.categories.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Nama</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold hidden sm:table-cell">Deskripsi</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Warna</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold hidden md:table-cell">Tanggal Dibuat</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.categories.map((category) => (
                  <TableRow key={category.id} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                    <TableCell className="text-gray-900 dark:text-white font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                      {category.description || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <Badge 
                          className="text-white border-0 text-xs"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 hidden md:table-cell text-sm">
                      {formatDate(category.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                        <Dialog open={editingCategory?.id === category.id} onOpenChange={(open) => !open && setEditingCategory(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mx-4 max-w-md rounded-xl">
                            <DialogHeader>
                              <DialogTitle className="text-gray-900 dark:text-white">Edit Kategori</DialogTitle>
                              <DialogDescription className="text-gray-600 dark:text-gray-300">
                                Perbarui informasi kategori
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="edit-name" className="text-gray-700 dark:text-gray-300 font-medium">
                                    Nama Kategori *
                                  </Label>
                                  <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="mt-1 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                    placeholder="Masukkan nama kategori"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-description" className="text-gray-700 dark:text-gray-300 font-medium">
                                    Deskripsi
                                  </Label>
                                  <Textarea
                                    id="edit-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="mt-1 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                    placeholder="Masukkan deskripsi kategori"
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-700 dark:text-gray-300 font-medium">Warna</Label>
                                  <div className="grid grid-cols-4 gap-2 mt-2">
                                    {colorOptions.map((color) => (
                                      <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                                        className={`w-full h-10 rounded-lg border-2 transition-all ${
                                          formData.color === color.value
                                            ? "border-gray-900 dark:border-white scale-105"
                                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                                        }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setEditingCategory(null)}
                                  className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full sm:w-auto rounded-lg"
                                >
                                  Batal
                                </Button>
                                <Button
                                  type="submit"
                                  disabled={updateMutation.isPending}
                                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full sm:w-auto rounded-lg border-0"
                                >
                                  {updateMutation.isPending ? (
                                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  ) : (
                                    <Edit className="h-4 w-4 mr-2" />
                                  )}
                                  Perbarui Kategori
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mx-4 rounded-xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-gray-900 dark:text-white">
                                Hapus Kategori
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                                Apakah Anda yakin ingin menghapus kategori "{category.name}"? 
                                Kategori yang memiliki artikel tidak dapat dihapus.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full sm:w-auto rounded-lg">
                                Batal
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(category.id)}
                                className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto rounded-lg"
                                disabled={deleteMutation.isPending}
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Tag className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Belum ada kategori</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Mulai dengan membuat kategori pertama Anda.</p>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl border-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Kategori Pertama
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
