import RNFS from 'react-native-fs';

export const uploadVideo = async (filePath: string): Promise<string> => {
  try {
    // Simulate a delay like real upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('📤 Pretending to upload file at path:', filePath);

    // Return a dummy link — acts like a successful upload
    return `https://example.com/videos/${Date.now()}.mp4`;
  } catch (err) {
    console.error('❌ Simulated upload error:', err);
    throw err;
  }
};
