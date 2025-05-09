import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
} from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CameraScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraPosition, setCameraPosition] = useState<'back' | 'front'>('back');
  const [isCameraInitialized, setIsCameraInitialized] = useState(true);

  const devices = useCameraDevices(cameraPosition);
  const device =
    cameraPosition === 'back'
      ? devices.back || devices[0]
      : devices.front || devices[1];

  const fallbackDevice = devices.back || devices.front || devices.external;

  useEffect(() => {
    const loadPreferredCamera = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('cameraMode');
        if (savedMode === 'front' || savedMode === 'back') {
          setCameraPosition(savedMode);
          console.log(`✅ Loaded camera preference: ${savedMode}`);
        } else {
          console.log('⚠️ No saved camera mode, using default');
        }
      } catch (e) {
        console.error('❌ Failed to load camera mode from storage', e);
      }
    };
    loadPreferredCamera();
  }, []);

  useEffect(() => {
    console.log('All available devices:', {
      back: devices.back,
      front: devices.front,
      external: devices.external,
    });
  }, [devices]);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const cameraStatus = await Camera.getCameraPermissionStatus();
        const micStatus = await Camera.getMicrophonePermissionStatus();

        console.log('Current Camera Status:', cameraStatus);
        console.log('Current Mic Status:', micStatus);

        if (cameraStatus === 'granted' && micStatus === 'granted') {
          setHasPermission(true);
        } else {
          const newCameraStatus = await Camera.requestCameraPermission();
          const newMicStatus = await Camera.requestMicrophonePermission();
          setHasPermission(
            newCameraStatus === 'granted' && newMicStatus === 'granted'
          );
        }
      } catch (error) {
        console.error('Permission error:', error);
        setHasPermission(false);
      }
    };
    checkPermissions();
  }, []);

  useEffect(() => {
    (async () => {
      const cameraCount = await Camera.getCameraCount();
      console.log(`Device has ${cameraCount} cameras`);
    })();
  }, []);

  useEffect(() => {
    if (device && !isCameraInitialized) {
      const timer = setTimeout(() => {
        setIsCameraInitialized(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [device, isCameraInitialized]);

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>Checking Permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Camera/Microphone permissions not granted.</Text>
        <Text style={styles.text}>Please enable them in app settings</Text>
      </View>
    );
  }

  if (!device) {
    console.error('No camera device found for the selected position:', cameraPosition);
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No camera device found</Text>
      </View>
    );
  }

  if (!isCameraInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>Initializing Camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        audio={true}
        orientation="portrait"
        video={true}
        photo={true}
        onInitialized={() => {
          console.log('Camera initialized!');
          setIsCameraInitialized(true);
        }}
        onError={(error) => console.error('Camera error:', error)}
      />
      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => {
          setIsCameraInitialized(false);
          const newPosition = cameraPosition === 'back' ? 'front' : 'back';
          console.log(`Switching to ${newPosition} camera`);
          setCameraPosition(newPosition);
        }}
      >
        <Text style={styles.switchText}>Switch Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  switchButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  switchText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  warningText: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    color: 'yellow',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
});

export default CameraScreen;
