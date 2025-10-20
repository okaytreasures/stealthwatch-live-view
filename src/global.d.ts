declare module 'react' {
  export const useState: any;
  export const useEffect: any;
  export const useRef: any;
  export type FC<P = any> = (props: P) => any;
  const React: any;
  export default React;
}

declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const Button: any;
  export const StyleSheet: any;
  export const Alert: any;
  export const TouchableOpacity: any;
  export const TextInput: any;
  export const ActivityIndicator: any;
}

declare module '@react-navigation/native' {
  export const NavigationContainer: any;
  export const useRoute: any;
  export type RouteProp<T, K> = any;
}

declare module '@react-navigation/native-stack' {
  export const createNativeStackNavigator: any;
  export type NativeStackNavigationProp<T, K> = any;
}

declare module 'react-native-vision-camera';
declare module '@react-native-async-storage/async-storage';
declare module 'react-native-geolocation-service';
declare module 'react-native-fs';
declare module 'react-native-webview';
declare module '@videosdk.live/react-native-sdk';
declare module '@videosdk.live/react-native-webrtc';
declare module 'axios';
declare module '@jest/globals';
declare module 'react-test-renderer';
