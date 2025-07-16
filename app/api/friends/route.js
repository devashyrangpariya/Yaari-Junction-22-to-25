import { NextResponse } from 'next/server';
import { FRIENDS } from '@/lib/constants';

/**
 * GET /api/friends
 * Retrieve all friends or filter by query parameters
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const year = searchParams.get('year');
    
    let filteredFriends = [...FRIENDS];
    
    // Apply filters if provided
    if (id) {
      filteredFriends = filteredFriends.filter(friend => friend.id === id);
    }
    
    if (name) {
      const searchTerm = name.toLowerCase();
      filteredFriends = filteredFriends.filter(friend => 
        friend.name.toLowerCase().includes(searchTerm) || 
        friend.nickname.toLowerCase().includes(searchTerm)
      );
    }
    
    if (year) {
      const yearNum = parseInt(year, 10);
      filteredFriends = filteredFriends.filter(friend => friend.joinYear === yearNum);
    }
    
    // Return 404 if no friends match the criteria
    if (filteredFriends.length === 0) {
      return NextResponse.json(
        { error: 'No friends found matching the criteria' },
        { status: 404 }
      );
    }
    
    // Return a single friend if id was specified
    if (id && filteredFriends.length === 1) {
      return NextResponse.json(filteredFriends[0]);
    }
    
    return NextResponse.json(filteredFriends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friends data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/friends
 * Update friend data (e.g., add tags, update social links)
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const { friendId, action, payload } = data;
    
    if (!friendId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: friendId and action' },
        { status: 400 }
      );
    }
    
    // In a real app, this would update a database
    // For this demo, we'll just return a success response
    
    let responseMessage = '';
    
    switch (action) {
      case 'updateSocial':
        responseMessage = 'Social links updated successfully';
        break;
      case 'addTag':
        responseMessage = 'Friend tagged successfully';
        break;
      case 'removeTag':
        responseMessage = 'Friend tag removed successfully';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      message: responseMessage,
      friendId,
      action,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating friend data:', error);
    return NextResponse.json(
      { error: 'Failed to update friend data' },
      { status: 500 }
    );
  }
} 