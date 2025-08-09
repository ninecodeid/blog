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
      <div className="p-4 lg:p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Memuat kategori...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center py-12">
          <p className="text-red-600">Gagal memuat kategori. Silakan coba lagi.</p>
          <p className="text-gray-500 text-sm mt-2">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Kategori</h1>
          <p className="text-gray-600">Kelola kategori artikel blog</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kategori
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Tambah Kategori Baru</DialogTitle>
              <DialogDescription className="text-gray-600">
                Buat kategori baru untuk mengorganisir artikel
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Nama Kategori *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Masukkan nama kategori"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-gray-700 font-medium">
                    Deskripsi
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Masukkan deskripsi kategori"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Warna</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                        className={`w-full h-10 rounded-lg border-2 transition-all ${
                          formData.color === color.value
                            ? "border-gray-900 scale-105"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {data?.categories && data.categories.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-gray-700 font-semibold">Nama</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Deskripsi</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Warna</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Tanggal Dibuat</TableHead>
                  <TableHead className="text-gray-700 font-semibold text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.categories.map((category) => (
                  <TableRow key={category.id} className="border-gray-200">
                    <TableCell className="text-gray-900 font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {category.description || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <Badge 
                          className="text-white border-0"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDate(category.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Dialog open={editingCategory?.id === category.id} onOpenChange={(open) => !open && setEditingCategory(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                              className="text-gray-500 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white border-gray-200">
                            <DialogHeader>
                              <DialogTitle className="text-gray-900">Edit Kategori</DialogTitle>
                              <DialogDescription className="text-gray-600">
                                Perbarui informasi kategori
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="edit-name" className="text-gray-700 font-medium">
                                    Nama Kategori *
                                  </Label>
                                  <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Masukkan nama kategori"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-description" className="text-gray-700 font-medium">
                                    Deskripsi
                                  </Label>
                                  <Textarea
                                    id="edit-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Masukkan deskripsi kategori"
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-700 font-medium">Warna</Label>
                                  <div className="grid grid-cols-4 gap-2 mt-2">
                                    {colorOptions.map((color) => (
                                      <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                                        className={`w-full h-10 rounded-lg border-2 transition-all ${
                                          formData.color === color.value
                                            ? "border-gray-900 scale-105"
                                            : "border-gray-300 hover:border-gray-400"
                                        }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <DialogFooter className="mt-6">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setEditingCategory(null)}
                                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                                >
                                  Batal
                                </Button>
                                <Button
                                  type="submit"
                                  disabled={updateMutation.isPending}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
                              className="text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white border-gray-200">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-gray-900">
                                Hapus Kategori
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-600">
                                Apakah Anda yakin ingin menghapus kategori "{category.name}"? 
                                Kategori yang memiliki artikel tidak dapat dihapus.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-300 text-gray-600 hover:bg-gray-50">
                                Batal
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(category.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
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
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Belum ada kategori.</p>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
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
