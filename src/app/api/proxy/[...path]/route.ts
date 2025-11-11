import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://letsgodriving.app/admintool';

/**
 * Catch-all API proxy route
 * Forwards all API requests to the backend to avoid CORS issues
 * Usage: /api/proxy/students, /api/proxy/jobs, etc.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path, 'DELETE');
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

async function handleRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    // Reconstruct the path from segments
    const path = '/' + pathSegments.join('/');
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${API_BASE_URL}${path}${searchParams ? `?${searchParams}` : ''}`;

    // Get headers from request
    const headers: HeadersInit = {};
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Forward content-type if present
    const contentType = request.headers.get('content-type');
    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    // Prepare request options
    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    // Add body for methods that support it
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      // Check if it's form data or JSON
      if (contentType?.includes('multipart/form-data')) {
        const formData = await request.formData();
        fetchOptions.body = formData;
      } else if (contentType?.includes('application/json')) {
        fetchOptions.body = await request.text();
      } else {
        fetchOptions.body = await request.text();
      }
    }

    // Forward the request to the actual API
    const response = await fetch(url, fetchOptions);

    // Get the response data
    const contentTypeHeader = response.headers.get('content-type');
    
    // Clone the response to read it
    const responseClone = response.clone();
    
    // Try to parse as JSON first
    let data;
    try {
      data = await response.json();
    } catch {
      // If not JSON, get as text
      data = await responseClone.text();
    }

    // Return the response with proper CORS headers
    // If data is a string (non-JSON), return it as text, otherwise as JSON
    if (typeof data === 'string' && !contentTypeHeader?.includes('application/json')) {
      return new NextResponse(data, {
        status: response.status,
        headers: {
          'Content-Type': contentTypeHeader || 'text/plain',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

