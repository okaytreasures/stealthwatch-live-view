import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { MeetingProvider, MeetingConsumer } from '@videosdk.live/react-native-sdk';
import { mediaDevices, RTCView } from '@videosdk.live/react-native-webrtc';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI1NTZhOWJmOC0yNTIwLTRhY2ItYjg1Ny02YjNjNmJlYjYwYjciLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0NjY3NzkyMiwiZXhwIjoxNzQ5MjY5OTIyfQ.p2YigzX6qcQENujc3NJI6llU4MSgLJQ6dLrDERhBkGE';
const ROOM_ID = 'test-room-id'; // Replace with the actual room ID
const NAME = 'Viewer';

const ParticipantView = ({ stream }) => {
  if (!stream) return <Text style={styles.text}>Waiting for stream...</Text>;
  return <RTCView streamURL={stream.toURL()} style={styles.video} />;
};

const MeetingView = () => {
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    const joinStream = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    joinStream();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <ParticipantView stream={localStream} />
    </View>
  );
};

const WebRTCPreviewScreen = () => {
  return (
    <MeetingProvider
      config={{
        meetingId: ROOM_ID,
        micEnabled: true,
        webcamEnabled: true,
        name: NAME,
      }}
      token={TOKEN}
    >
      <MeetingConsumer>{() => <MeetingView />}</MeetingConsumer>
    </MeetingProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default WebRTCPreviewScreen;

