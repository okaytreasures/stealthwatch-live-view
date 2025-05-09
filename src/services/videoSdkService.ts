import axios from 'axios';

const API_KEY = '556a9bf8-2520-4acb-b857-6b3c6beb60b7'; // Your real API key
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your real JWT token
const BASE_URL = 'https://api.videosdk.live/v2';

export const createMeeting = async (): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/rooms`,
      {},
      {
        headers: {
          Authorization: TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.roomId;
  } catch (error) {
    console.error('[VideoSDK] createMeeting error:', error);
    return null;
  }
};

export const getMeetingLink = (roomId: string): string => {
  // This should be the same route your emergency contact will visit
  return `https://stealthwatch.vercel.app/viewer?roomId=${roomId}`;
};
