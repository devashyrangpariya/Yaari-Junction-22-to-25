import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getOptimizedImageUrl } from '@/lib/imageUtils';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * GET /api/images
 * Retrieve images with filtering, pagination, and caching
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const year = searchParams.get('year');
    const tag = searchParams.get('tag');
    const friend = searchParams.get('friend');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    
    // Build Cloudinary search query
    let searchOptions = {
      expression: 'folder=college_memories',
      sort_by: [{ created_at: 'desc' }],
      max_results: limit,
      next_cursor: page > 1 ? searchParams.get('cursor') : undefined,
      with_field: 'tags',
      with_field: 'context'
    };
    
    // Add filters
    if (year) {
      searchOptions.expression += ` AND context.year=${year}`;
    }
    
    if (tag) {
      searchOptions.expression += ` AND tags=${tag}`;
    }
    
    if (friend) {
      searchOptions.expression += ` AND context.friends=${friend}`;
    }
    
    // Fetch images from Cloudinary
    const result = await cloudinary.search.expression(searchOptions.expression)
      .sort_by(...searchOptions.sort_by)
      .max_results(searchOptions.max_results)
      .next_cursor(searchOptions.next_cursor)
      .with_field('tags')
      .with_field('context')
      .execute();
    
    // Transform response
    const images = result.resources.map(resource => ({
      id: resource.public_id,
      url: resource.secure_url,
      thumbnail: getOptimizedImageUrl(resource.secure_url, { width: 300, height: 300, quality: 80 }),
      width: resource.width,
      height: resource.height,
      format: resource.format,
      tags: resource.tags || [],
      friends: resource.context?.friends ? resource.context.friends.split(',') : [],
      year: resource.context?.year || null,
      uploadDate: resource.created_at,
      assetId: resource.asset_id
    }));
    
    // Return response with pagination info
    return NextResponse.json({
      images,
      pagination: {
        total: result.total_count,
        page,
        limit,
        hasMore: !!result.next_cursor,
        nextCursor: result.next_cursor || null
      }
    }, {
      headers: {
        // Cache for 5 minutes
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60'
      }
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/images
 * Update image metadata (tags, friends, etc.)
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const { imageId, action, payload } = data;
    
    if (!imageId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: imageId and action' },
        { status: 400 }
      );
    }
    
    let result;
    
    switch (action) {
      case 'addTag':
        if (!payload?.tag) {
          return NextResponse.json(
            { error: 'Missing tag in payload' },
            { status: 400 }
          );
        }
        
        result = await cloudinary.uploader.add_tag(
          payload.tag,
          imageId,
          { resource_type: 'image' }
        );
        break;
        
      case 'removeTag':
        if (!payload?.tag) {
          return NextResponse.json(
            { error: 'Missing tag in payload' },
            { status: 400 }
          );
        }
        
        result = await cloudinary.uploader.remove_tag(
          payload.tag,
          imageId,
          { resource_type: 'image' }
        );
        break;
        
      case 'updateFriends':
        if (!payload?.friends) {
          return NextResponse.json(
            { error: 'Missing friends in payload' },
            { status: 400 }
          );
        }
        
        result = await cloudinary.uploader.update(
          imageId,
          {
            context: `friends=${payload.friends.join(',')}`,
            resource_type: 'image'
          }
        );
        break;
        
      case 'updateYear':
        if (!payload?.year) {
          return NextResponse.json(
            { error: 'Missing year in payload' },
            { status: 400 }
          );
        }
        
        result = await cloudinary.uploader.update(
          imageId,
          {
            context: `year=${payload.year}`,
            resource_type: 'image'
          }
        );
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      message: `Image ${action} successful`,
      imageId,
      result
    });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/images
 * Delete an image from Cloudinary
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');
    
    if (!imageId) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }
    
    // Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(imageId);
    
    if (result.result !== 'ok') {
      return NextResponse.json(
        { error: 'Failed to delete image', details: result },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
      imageId,
      result
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
} 