import { NextResponse } from 'next/server';

// Generate a simple colored rectangle as a test image
function generateTestImage(width = 400, height = 300, color = '#3B82F6') {
  // Create SVG content
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="24">
        Test Image
      </text>
    </svg>
  `;
  
  return svg;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const width = parseInt(searchParams.get('width') || '400');
  const height = parseInt(searchParams.get('height') || '300');
  const color = searchParams.get('color') || '#3B82F6';
  
  const svg = generateTestImage(width, height, color);
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}