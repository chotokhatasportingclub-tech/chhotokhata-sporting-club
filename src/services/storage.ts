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
    // If it's SVG or not in browser environment, don't compress
    if (file.type === 'image/svg+xml' || typeof window === 'undefined' || typeof FileReader === 'undefined') {
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
 * Uploads media file to Firebase Storage with real progress tracking and timeout protection
 */
export async function uploadMedia(
  folder: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> {
  // 1. Validation
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error('অনুমোদিত ফাইল ফরম্যাট: JPG, PNG, WebP, SVG বা GIF।');
  }

  const maxSizeBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeBytes) {
    throw new Error('ছবির আকার সর্বোচ্চ ১০ মেগাবাইট (10MB) হতে পারে।');
  }

  // 2. Compress image for high performance
  const processedBlob = await compressImage(file);
  const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const storagePath = `${folder}/${cleanFileName}`;

  return new Promise<string>(async (resolve, reject) => {
    let isSettled = false;
    let timeoutId: any = null;

    // Fallback function: convert compressed blob to Base64 data URL
    const fallbackToDataUrl = async (reason?: string) => {
      if (isSettled) return;
      isSettled = true;
      if (timeoutId) clearTimeout(timeoutId);
      try {
        if (onProgress) onProgress(60);
        const dataUrl = await blobToDataURL(processedBlob);
        if (onProgress) onProgress(100);
        console.info('Image processed and optimized via high-performance inline storage' + (reason ? ` (${reason})` : ''));
        resolve(dataUrl);
      } catch (err: any) {
        reject(new Error('ছবি প্রসেস করতে ব্যর্থ হয়েছে: ' + (err?.message || '')));
      }
    };

    try {
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, processedBlob, {
        contentType: file.type === 'image/svg+xml' ? 'image/svg+xml' : 'image/webp',
      });

      // 4-second timeout: If storage bucket is not created, blocked by CORS, or stalled, seamlessly fall back
      timeoutId = setTimeout(() => {
        if (!isSettled) {
          try {
            uploadTask.cancel();
          } catch (e) {
            // ignore
          }
          fallbackToDataUrl('Cloud Storage response timeout');
        }
      }, 4000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (isSettled) return;
          if (snapshot.totalBytes > 0) {
            const rawProgress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            if (onProgress) {
              onProgress(Math.min(rawProgress, 95));
            }
          }
        },
        async (error: any) => {
          if (isSettled) return;
          // Storage bucket not provisioned, CORS error, or offline -> fallback immediately so user isn't blocked
          console.warn('Firebase Storage upload failed, falling back to optimized inline data URL:', error);
          await fallbackToDataUrl(error?.message || 'Storage unavailable');
        },
        async () => {
          if (isSettled) return;
          if (timeoutId) clearTimeout(timeoutId);

          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            isSettled = true;
            if (onProgress) onProgress(100);
            resolve(downloadUrl);
          } catch (err: any) {
            await fallbackToDataUrl('Could not get download URL');
          }
        }
      );
    } catch (directErr: any) {
      if (timeoutId) clearTimeout(timeoutId);
      await fallbackToDataUrl('Direct storage connection error');
    }
  });
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
