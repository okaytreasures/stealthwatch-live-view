import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import CameraScreen from './src/screens/CameraScreen';
import SmsTestScreen from './src/screens/SmsTestScreen';
import WebRTCPreviewScreen from './src/screens/WebRTCPreviewScreen';
import LiveStreamViewerScreen from './src/screens/LiveStreamViewerScreen';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Emergency: undefined;
  Camera: undefined;
  SmsTest: undefined;
  WebRTCPreview: undefined;
  LiveStreamViewer: { roomId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Emergency" component={EmergencyScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="SmsTest" component={SmsTestScreen} />
        <Stack.Screen name="WebRTCPreview" component={WebRTCPreviewScreen} />
        <Stack.Screen name="LiveStreamViewer" component={LiveStreamViewerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
