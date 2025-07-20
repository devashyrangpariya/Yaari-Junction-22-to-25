import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import galleryData from '../../../components/gallery/data/gallery-images.json';
import { promises as fs } from 'fs';

/**
 * API route for handling image uploads
 * - Saves images to /public/uploads directory
 * - Updates gallery-images.json with new entries
 * - Supports multiple file uploads
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const year = formData.get('year') || new Date().getFullYear().toString();
    const batchId = formData.get('batchId') || uuidv4();
    
    // Validate files
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' }, 
        { status: 400 }
      );
    }
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', year);
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // Track upload results
    const uploaded = [];
    const failed = [];
    const startTime = Date.now();
    let totalSizeBytes = 0;
    
    // Process each file
    for (const file of files) {
      try {
        const fileStartTime = Date.now();
        
        // Get file data
        const buffer = Buffer.from(await file.arrayBuffer());
        totalSizeBytes += buffer.byteLength;
        
        // Generate unique filename
        const originalFilename = file.name;
        const extension = path.extname(originalFilename);
        const uniqueFilename = `${uuidv4()}${extension}`;
        const relativePath = `/uploads/${year}/${uniqueFilename}`;
        const filePath = path.join(process.cwd(), 'public', relativePath);
        
        // Save file to disk
        await writeFile(filePath, buffer);
        
        // Create image metadata
        const imageData = {
          id: `img-${year}-${Date.now()}-${uuidv4().substring(0, 8)}`,
          url: relativePath,
          thumbnail: relativePath,
          title: originalFilename.replace(/\.[^/.]+$/, "").replace(/-|_/g, " "),
          description: "",
          year: parseInt(year, 10),
          width: 800, // Default values - would be extracted from actual image
          height: 600,
          tags: [],
          uploadDate: new Date().toISOString()
        };
        
        // Add to upload results
        uploaded.push({
          originalFilename,
          uniqueFilename,
          url: relativePath,
          thumbnailUrl: relativePath,
          imageData,
          processingTimeMs: Date.now() - fileStartTime
        });
        
      } catch (error) {
        console.error('Error processing file:', file.name, error);
        failed.push({
          originalFilename: file.name,
          error: error.message
        });
      }
    }
    
    // Update gallery data file if there are successful uploads
    if (uploaded.length > 0) {
      try {
        // Initialize year array if it doesn't exist
        if (!galleryData[year]) {
          galleryData[year] = [];
        }
        
        // Add new images to gallery data
        uploaded.forEach(item => {
          galleryData[year].push(item.imageData);
        });
        
        // Write updated data back to JSON file
        const galleryFilePath = path.join(
          process.cwd(), 
          'components',
          'gallery',
          'data',
          'gallery-images.json'
        );
        
        await fs.writeFile(
          galleryFilePath, 
          JSON.stringify(galleryData, null, 2)
        );
      } catch (error) {
        console.error('Error updating gallery data:', error);
      }
    }
    
    // Calculate statistics
    const totalTimeMs = Date.now() - startTime;
    const statistics = {
      total: files.length,
      successCount: uploaded.length,
      failureCount: failed.length,
      totalSizeMB: (totalSizeBytes / (1024 * 1024)).toFixed(2),
      avgProcessingTimeMs: uploaded.length > 0 ? 
        Math.round(uploaded.reduce((acc, item) => acc + item.processingTimeMs, 0) / uploaded.length) : 0,
      batchId,
      year
    };
    
    return NextResponse.json({ uploaded, failed, statistics });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * Configure request size limits
 */
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
};