import { google } from 'googleapis'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/lib/db'

export async function GET() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.OAUTH2_REDIRECT_URI
  )

  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  const clerkResponse = await clerkClient.users.getUserOauthAccessToken(userId, 'oauth_google')
  

  //@ts-ignore
  if (!clerkResponse || !clerkResponse.length) {
    return NextResponse.json({ message: 'No OAuth token found' }, { status: 400 })
  }
  
  //@ts-ignore
  const accessToken = clerkResponse[0]?.token
  if (!accessToken) {
    return NextResponse.json({ message: 'Failed to get access token' }, { status: 500 })
  }

  oauth2Client.setCredentials({ access_token: accessToken })

  const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
  })
  
  const channelId = uuidv4()

  try {
    const startPageTokenRes = await drive.changes.getStartPageToken({})
    const startPageToken = startPageTokenRes.data.startPageToken
    if (!startPageToken) {
      throw new Error('startPageToken is unexpectedly null')
    }

    const listener = await drive.changes.watch({
      pageToken: startPageToken,
      supportsAllDrives: true,
      supportsTeamDrives: true,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: 'https://intelliautobuild.vercel.app/api/drive-activity/notification',
        kind: 'api#channel',
      },
    })

    if (listener.status === 200) {
      const channelStored = await db.user.update({
        where: { clerkId: userId },
        data: { googleResourceId: listener.data.resourceId },
      })

      if (channelStored) {
        return NextResponse.json({ message: 'Listening to changes...' })
      }
    }
  } catch (error) {
    console.error('Error:', error)
    //@ts-ignore
    return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Oops! something went wrong, try again' })
}
