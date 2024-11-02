import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { id, email_addresses, first_name, image_url } = body?.data;

    // Validate required fields
    if (!id || !email_addresses || !email_addresses[0]?.email_address) {
      console.error('Missing required fields:', body);
      return new NextResponse('Invalid request body', { status: 400 });
    }

    const email = email_addresses[0].email_address;
    console.log('✅ Received body data:', body);

    try {
      // Perform upsert operation on the database
      await db.user.upsert({
        where: { clerkId: id },
        update: {
          email,
          name: first_name,
          profileImage: image_url,
        },
        create: {
          clerkId: id,
          email,
          name: first_name || '',
          profileImage: image_url || '',
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return new NextResponse('Database update failed', { status: 500 });
    }

    // Return a success response if upsert is successful
    return new NextResponse('User updated in database successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return new NextResponse('Error processing request', { status: 500 });
  }
}
