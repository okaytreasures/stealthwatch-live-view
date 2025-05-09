// EmergencyScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, useCameraDevices, VideoFile } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import { NativeModules } from 'react-native';
import { uploadVideo } from '../services/uploadVideo';
import { createMeeting, getMeetingLink } from '../services/videoSdkService';

const { SmsModule } = NativeModules;

const EmergencyScreen: React.FC = () => {
  const cameraRef = useRef<Camera>(null);
  const devices = useCameraDevices();
  const [status, setStatus] = useState<'initializing' | 'sms_sent' | 'recording' | 'failed'>('initializing');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [contactNumber, setContactNumber] = useState<string>('18632287124');

  const device = devices.back || devices.front;

  useEffect(() => {
    const initializeEmergencyMode = async () => {
      console.log('[Init] Starting Emergency Mode...');

      try {
        const saved = await AsyncStorage.getItem('emergencyContact');
        if (saved) setContactNumber(saved);
        console.log('[Init] Loaded contact:', saved || contactNumber);

        await requestAllPermissions();
        console.log('[Init] Permissions granted');

        Geolocation.getCurrentPosition(
          async (pos) => {
            try {
              setLocation(pos.coords);
              console.log('[Init] Location:', pos.coords);

              const roomId = await createMeeting();
              console.log('[Init] Room ID:', roomId);
              if (!roomId) throw new Error('Room creation failed');

              const liveLink = getMeetingLink(roomId);
              console.log('[Init] Live link:', liveLink);

              const message =
                `🚨 Emergency!\n` +
                `📍 https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}\n` +
                `🎥 Live Feed: ${getMeetingLink(roomId)}`;
              await SmsModule.sendSMS(contactNumber, message);
              console.log('[Init] ✅ SMS sent successfully');

              setStatus('sms_sent');
              await startRecording();
            } catch (innerErr) {
              console.error('[Init - Inner]', innerErr);
              setStatus('failed');
            }
          },
          (err) => {
            console.error('[Init] Location fetch failed:', err);
            setStatus('failed');
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        );
      } catch (outerErr) {
        console.error('[Init - Outer]', outerErr);
        setStatus('failed');
      }
    };

    const requestAllPermissions = async () => {
      if (Platform.OS === 'android') {
        const results = await Promise.all([
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA),
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO),
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION),
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.SEND_SMS, {
            title: 'SMS Permission',
            message: 'Allow sending emergency SMS',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }),
        ]);
        if (!results.every((r) => r === PermissionsAndroid.RESULTS.GRANTED)) {
          throw new Error('Permissions denied');
        }
      } else {
        const cam = await Camera.requestCameraPermission();
        const mic = await Camera.requestMicrophonePermission();
        if (cam !== 'granted' || mic !== 'granted') {
          throw new Error('Permissions not granted on iOS');
        }
      }
    };

    const startRecording = async () => {
      if (!device || !cameraRef.current) return;
      try {
        console.log('🎥 Starting recording...');
        const path = `${RNFS.CachesDirectoryPath}/emergency_${Date.now()}.mp4`;

        await cameraRef.current.startRecording({
          flash: 'off',
          fileType: 'mp4',
          onRecordingFinished: async (video: VideoFile) => {
            console.log('✅ Video saved:', video.path);
            try {
              const url = await uploadVideo(video.path);
              const videoMsg = `📹 Emergency video:\n${url}`;
              await SmsModule.sendSMS(contactNumber, videoMsg);
              console.log('✅ Video link sent');
            } catch (uploadErr) {
              console.error('❌ Upload failed:', uploadErr);
            }
          },
          onRecordingError: (e) => {
            console.error('❌ Recording error:', e);
          },
        });

        setStatus('recording');
      } catch (err) {
        console.error('❌ Failed to start recording:', err);
        setStatus('failed');
      }
    };

    initializeEmergencyMode();
  }, [device, contactNumber]);

  if (status === 'initializing') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>Initializing emergency system...</Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Emergency failed to initialize</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => setStatus('initializing')}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {device && (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          video={true}
          audio={true}
          onInitialized={() => console.log('📷 Camera ready')}
          onError={(e) => console.error('❌ Camera error:', e)}
        />
      )}

      <View style={styles.overlay}>
        <Text style={styles.alertText}>EMERGENCY MODE</Text>
        {status === 'sms_sent' && <Text style={styles.statusText}>✓ Emergency SMS sent</Text>}
        {status === 'recording' && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>RECORDING</Text>
          </View>
        )}
        {location && (
          <Text style={styles.locationText}>
            Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  alertText: {
    color: 'red',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    marginRight: 8,
  },
  recordingText: {
    color: 'white',
    fontSize: 16,
  },
  locationText: {
    color: 'white',
    fontSize: 14,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 18,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EmergencyScreen;
