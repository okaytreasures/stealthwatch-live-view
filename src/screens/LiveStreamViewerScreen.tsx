import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

// Access roomId from route params
type ViewerRouteProp = RouteProp<RootStackParamList, 'LiveStreamViewer'>;

const LiveStreamViewerScreen: React.FC = () => {
  const route = useRoute<ViewerRouteProp>();
  const { roomId } = route.params;

  const [loading, setLoading] = useState(true);

  const liveUrl = `https://embed.videosdk.live/rtc-js-prebuilt/${roomId}?micEnabled=true&webcamEnabled=true&name=Viewer`;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading Live Stream...</Text>
        </View>
      )}
      <WebView
        source={{ uri: liveUrl }}
        onLoadEnd={() => setLoading(false)}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 15,
    color: '#fff',
    fontSize: 16,
  },
});

export default LiveStreamViewerScreen;
