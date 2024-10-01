import { google } from 'googleapis';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  // Initialize the OAuth2 client with Google credentials
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.OAUTH2_REDIRECT_URI
  );

  // Authenticate the user using Clerk
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // Retrieve the user's OAuth access token from Clerk
  const clerkResponse = await clerkClient.users.getUserOauthAccessToken(userId, 'oauth_google');
  
  // Ensure the OAuth token exists and handle errors
  //@ts-ignore
  if (!clerkResponse || clerkResponse.length === 0 || !clerkResponse[0].token) {
    return NextResponse.json({ message: 'OAuth token not found' }, { status: 400 });
  }

  //@ts-ignore
  const accessToken = clerkResponse[0].token;
  
  // Set the retrieved access token for OAuth2 client
  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  // Create a Google Drive instance
  const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
  });

  // Attempt to list the user's files in Google Drive
  try {
    const response = await drive.files.list();
    
    // If the response contains data, return the files, otherwise return a message saying no files were found
    if (response && response.data.files) {
      return NextResponse.json({ message: 'Files retrieved', data: response.data.files }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No files found' }, { status: 200 });
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching files from Google Drive:', error);
    
    // Return a response indicating something went wrong
    //@ts-ignore
    return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}
