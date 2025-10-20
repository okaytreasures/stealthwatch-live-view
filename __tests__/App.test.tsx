/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import {View} from 'react-native';

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('@react-navigation/native', () => {
  return {
    NavigationContainer: ({children}: any) => children,
  };
});
jest.mock('@react-navigation/native-stack', () => {
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({children}: any) => children,
      Screen: ({component: Component, ...rest}: any) => <Component {...rest} />,
    }),
  };
});
jest.mock('../src/screens/HomeScreen', () => 'View');
jest.mock('../src/screens/SettingsScreen', () => 'View');
jest.mock('../src/screens/EmergencyScreen', () => 'View');
jest.mock('../src/screens/CameraScreen', () => 'View');
jest.mock('../src/screens/SmsTestScreen', () => 'View');
jest.mock('../src/screens/WebRTCPreviewScreen', () => 'View');
jest.mock('../src/screens/LiveStreamViewerScreen', () => 'View');

it('renders correctly', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
