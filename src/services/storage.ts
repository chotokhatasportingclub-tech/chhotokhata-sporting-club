import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

export interface UploadProgressCallback {
  (percentage: number): void;
}

/**
 * Resizes and compresses image to WebP or JPEG if it exceeds target dimensions
 */
export async function compressImage(file: File, maxDimension = 1600, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // If it's SVG, don't compress
    if (file.type === 'image/svg+xml') {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a file or blob to base64 data URL as reliable fallback
 */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Uploads media file to Firebase Storage with automatic compression and fallback
 */
export async function uploadMedia(
  folder: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> {
  // 1. Validation
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Supported types: JPG, PNG, WebP, SVG, GIF.');
  }

  const maxSizeBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeBytes) {
    throw new Error('File size exceeds the 10MB limit. Please choose a smaller file.');
  }

  // 2. Compress image for high performance
  const processedBlob = await compressImage(file);
  const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const storagePath = `${folder}/${cleanFileName}`;

  try {
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, processedBlob, {
      contentType: file.type === 'image/svg+xml' ? 'image/svg+xml' : 'image/webp',
    });

    return await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress));
          }
        },
        async (error) => {
          console.warn('Firebase Storage upload failed, utilizing resilient inline data store fallback:', error);
          try {
            if (onProgress) onProgress(80);
            const dataUrl = await blobToDataURL(processedBlob);
            if (onProgress) onProgress(100);
            resolve(dataUrl);
          } catch (fbErr) {
            reject(new Error(`Storage and fallback failed: ${error.message}`));
          }
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve(downloadUrl);
          } catch (err) {
            const dataUrl = await blobToDataURL(processedBlob);
            resolve(dataUrl);
          }
        }
      );
    });
  } catch (err) {
    console.warn('Direct upload exception, saving locally as data URL:', err);
    if (onProgress) onProgress(100);
    return await blobToDataURL(processedBlob);
  }
}

/**
 * Deletes media file from storage if it is a Firebase storage URL
 */
export async function deleteMediaByUrl(url: string): Promise<void> {
  if (!url || !url.includes('firebasestorage.googleapis.com')) {
    return; // Don't attempt deleting data URLs or external URLs
  }
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (err) {
    console.warn('Could not delete file from storage (might already be deleted):', err);
  }
}
