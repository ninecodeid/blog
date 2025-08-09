import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
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

export default function AdminArticles() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      try {
        return await backend.blog.list({ limit: 100 });
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        throw err;
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        return await backend.blog.deleteArticle({ id });
      } catch (err) {
        console.error("Delete error:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      toast({
        title: "Berhasil",
        description: "Artikel berhasil dihapus",
      });
      setDeleteId(null);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus artikel",
        variant: "destructive",
      });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      try {
        return await backend.blog.update({ id, published });
      } catch (err) {
        console.error("Toggle publish error:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      toast({
        title: "Berhasil",
        description: "Status publikasi artikel berhasil diubah",
      });
    },
    onError: (error) => {
      console.error("Toggle publish error:", error);
      toast({
        title: "Error",
        description: "Gagal mengubah status publikasi",
        variant: "destructive",
      });
    },
  });

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
          <p className="text-gray-600 mt-4">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center py-12">
          <p className="text-red-600">Gagal memuat artikel. Silakan coba lagi.</p>
          <p className="text-gray-500 text-sm mt-2">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Artikel</h1>
          <p className="text-gray-600">Kelola semua artikel blog</p>
        </div>
        <Link to="/admin/articles/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Artikel
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {data?.articles && data.articles.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-gray-700 font-semibold">Judul</TableHead>
                  <TableHead className="text-gray-700 font-semibold hidden sm:table-cell">Kategori</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-700 font-semibold hidden md:table-cell">Tanggal</TableHead>
                  <TableHead className="text-gray-700 font-semibold text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.articles.map((article) => (
                  <TableRow key={article.id} className="border-gray-200">
                    <TableCell className="text-gray-900 font-medium">
                      <div className="max-w-xs truncate">
                        {article.title}
                      </div>
                      {/* Show category on mobile */}
                      <div className="sm:hidden mt-1">
                        {article.category && (
                          <Badge 
                            className="text-white border-0 text-xs"
                            style={{ backgroundColor: article.category.color }}
                          >
                            {article.category.name}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {article.category && (
                        <Badge 
                          className="text-white border-0"
                          style={{ backgroundColor: article.category.color }}
                        >
                          {article.category.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {article.published ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                          Published
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600 hidden md:table-cell text-sm">
                      {formatDate(article.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            togglePublishMutation.mutate({
                              id: article.id,
                              published: !article.published,
                            })
                          }
                          className="text-gray-500 hover:text-blue-600 p-1 sm:p-2"
                          disabled={togglePublishMutation.isPending}
                        >
                          {article.published ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Link to={`/admin/articles/${article.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-blue-600 p-1 sm:p-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-red-600 p-1 sm:p-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white border-gray-200 mx-4">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-gray-900">
                                Hapus Artikel
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-600">
                                Apakah Anda yakin ingin menghapus artikel "{article.title}"? 
                                Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="border-gray-300 text-gray-600 hover:bg-gray-50 w-full sm:w-auto">
                                Batal
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(article.id)}
                                className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
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
            <p className="text-gray-600 mb-4">Belum ada artikel.</p>
            <Link to="/admin/articles/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Artikel Pertama
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
