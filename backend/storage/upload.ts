import { api } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";

const imagesBucket = new Bucket("images", {
  public: true,
});

interface UploadImageRequest {
  filename: string;
  contentType: string;
  data: string; // base64 encoded
}

interface UploadImageResponse {
  url: string;
}

// Uploads an image and returns the public URL.
export const uploadImage = api<UploadImageRequest, UploadImageResponse>(
  { expose: true, method: "POST", path: "/upload/image" },
  async (req) => {
    // Convert base64 to buffer
    const buffer = Buffer.from(req.data, 'base64');
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${req.filename}`;
    
    // Upload to bucket
    await imagesBucket.upload(filename, buffer, {
      contentType: req.contentType,
    });
    
    // Return public URL
    const url = imagesBucket.publicUrl(filename);
    
    return { url };
  }
);
