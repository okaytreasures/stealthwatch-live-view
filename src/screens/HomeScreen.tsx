import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>StealthWatchApp</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonSpacing}>
          <Button title="Test Camera" onPress={() => navigation.navigate('Camera')} />
        </View>
        <View style={styles.buttonSpacing}>
          <Button
            title="Activate Panic Mode"
            color="red"
            onPress={() => navigation.navigate('Emergency')}
          />
        </View>
        <View style={styles.buttonSpacing}>
          <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
        </View>
        <View style={styles.buttonSpacing}>
          <Button title="Test SMS" onPress={() => navigation.navigate('SmsTest')} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '80%',
  },
  buttonSpacing: {
    marginVertical: 10,
  },
});

export default HomeScreen;
