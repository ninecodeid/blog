import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import backend from "~backend/client";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Silakan pilih file gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file harus kurang dari 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1]; // Remove data:image/...;base64, prefix

        try {
          const response = await backend.storage.uploadImage({
            filename: file.name,
            contentType: file.type,
            data: base64Data,
          });

          onChange(response.url);
        } catch (error) {
          console.error('Upload error:', error);
          alert('Gagal mengupload gambar');
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File read error:', error);
      alert('Gagal membaca file');
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-gray-700">Gambar Artikel</Label>
      
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="w-full h-32 sm:h-48 object-cover rounded-lg border border-gray-200"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-2">
            {isUploading ? (
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
            ) : (
              <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            )}
            <p className="text-gray-600 text-sm sm:text-base">
              {isUploading ? 'Mengupload...' : 'Klik untuk upload gambar'}
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              PNG, JPG, GIF hingga 5MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {!value && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full border-gray-300 text-gray-600 hover:border-blue-300"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Mengupload...' : 'Pilih Gambar'}
        </Button>
      )}
    </div>
  );
}
