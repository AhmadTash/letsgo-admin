import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://letsgodriving.app/admintool';

export async function POST(request: NextRequest) {
  try {
    // Get form data from the request
    const formData = await request.formData();

    // Forward the request to the actual API
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      body: formData,
    });

    // Get the response data (whether success or error)
    let data;
    try {
      data = await response.json();
    } catch {
      // If response is not JSON, create an error object
      data = { error: `Server error: ${response.status} ${response.statusText}` };
    }

    // Return the response with proper CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

