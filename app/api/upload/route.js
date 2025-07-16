import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILES_PER_BATCH = 20;

// Validate individual file
const validateFile = (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_TYPES.join(', ')}` 
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` 
    };
  }

  return { valid: true };
};

// Process single file upload
const processFileUpload = async (file, index, totalFiles) => {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Generate unique public ID
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const cleanFileName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, '_');
    const publicId = `${timestamp}_${randomId}_${cleanFileName}`;

    // Upload to Cloudinary with optimization
    const result = await uploadImage(base64, {
      public_id: publicId,
      tags: ['college-memories', 'user-upload', `batch-${timestamp}`],
      context: {
        original_filename: file.name,
        upload_date: new Date().toISOString(),
        batch_index: index.toString(),
        batch_total: totalFiles.toString(),
      },
    });

    return {
      success: true,
      publicId: result.public_id,
      url: result.secure_url,
      thumbnailUrl: result.eager?.[0]?.secure_url || result.secure_url,
      mediumUrl: result.eager?.[1]?.secure_url || result.secure_url,
      largeUrl: result.eager?.[2]?.secure_url || result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      originalFilename: file.name,
      uploadedAt: new Date().toISOString(),
      tags: result.tags,
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      originalFilename: file.name,
    };
  }
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const batchId = formData.get('batchId') || `batch_${Date.now()}`;
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES_PER_BATCH) {
      return NextResponse.json(
        { error: `Too many files. Maximum ${MAX_FILES_PER_BATCH} files per batch.` },
        { status: 400 }
      );
    }

    // Process files with controlled concurrency (max 3 simultaneous uploads)
    const results = [];
    const batchSize = 3;
    
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchPromises = batch.map((file, batchIndex) => 
        processFileUpload(file, i + batchIndex, files.length)
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    const successful = results.filter(result => result.success);
    const failed = results.filter(result => !result.success);

    // Calculate statistics
    const totalBytes = successful.reduce((sum, result) => sum + (result.bytes || 0), 0);
    const avgProcessingTime = successful.length > 0 ? 
      (Date.now() - parseInt(batchId.split('_')[1])) / successful.length : 0;

    const response = {
      success: true,
      batchId,
      uploaded: successful,
      failed: failed,
      statistics: {
        total: files.length,
        successCount: successful.length,
        failureCount: failed.length,
        totalBytes,
        totalSizeMB: (totalBytes / 1024 / 1024).toFixed(2),
        avgProcessingTimeMs: Math.round(avgProcessingTime),
        uploadedAt: new Date().toISOString(),
      },
      // Include URLs for immediate use
      imageUrls: successful.map(result => ({
        publicId: result.publicId,
        thumbnail: result.thumbnailUrl,
        medium: result.mediumUrl,
        large: result.largeUrl,
        original: result.url,
      }))
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check upload status or retrieve batch info
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');
    
    if (!batchId) {
      return NextResponse.json(
        { error: 'Batch ID required' },
        { status: 400 }
      );
    }

    // In a real application, you would query your database here
    // For now, return a simple response
    return NextResponse.json({
      batchId,
      status: 'completed',
      message: 'Batch upload completed successfully'
    });

  } catch (error) {
    console.error('Upload status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check upload status' },
      { status: 500 }
    );
  }
}

// Handle file size limits and validation
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};