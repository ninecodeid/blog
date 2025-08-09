import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, EyeOff, FileText } from "lucide-react";
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
      <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center py-20">
          <p className="text-red-600 dark:text-red-400">Gagal memuat artikel. Silakan coba lagi.</p>
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
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Kelola Artikel
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Kelola semua artikel blog teknologi
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Link to="/admin/articles/new">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-0">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Artikel
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        {data?.articles && data.articles.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Judul</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold hidden sm:table-cell">Kategori</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold hidden md:table-cell">Tanggal</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.articles.map((article) => (
                  <TableRow key={article.id} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                    <TableCell className="text-gray-900 dark:text-white font-medium">
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
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700 text-xs">
                          Dipublikasi
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700 text-xs">
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 hidden md:table-cell text-sm">
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
                          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
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
                            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
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
                                Hapus Artikel
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                                Apakah Anda yakin ingin menghapus artikel "{article.title}"? 
                                Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full sm:w-auto rounded-lg">
                                Batal
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(article.id)}
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
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Belum ada artikel</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Mulai dengan membuat artikel pertama Anda.</p>
            <Link to="/admin/articles/new">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl border-0">
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
