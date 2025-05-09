import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [cameraMode, setCameraMode] = useState<'front' | 'back' | 'both'>('back');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedNumber = await AsyncStorage.getItem('emergencyContact');
        const storedCameraMode = await AsyncStorage.getItem('cameraMode');
        if (storedNumber) setEmergencyContact(storedNumber);
        if (storedCameraMode === 'front' || storedCameraMode === 'back' || storedCameraMode === 'both') {
          setCameraMode(storedCameraMode);
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('emergencyContact', emergencyContact);
      await AsyncStorage.setItem('cameraMode', cameraMode);
      Alert.alert('Saved', 'Settings saved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Emergency Contact Number:</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="Enter phone number"
        placeholderTextColor="#aaa"
        value={emergencyContact}
        onChangeText={setEmergencyContact}
      />

      <Text style={[styles.label, { marginTop: 20 }]}>Preferred Camera Mode:</Text>
      <View style={styles.cameraOptions}>
        {['back', 'front', 'both'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.cameraButton,
              cameraMode === option ? styles.cameraButtonActive : null,
            ]}
            onPress={() => setCameraMode(option as 'front' | 'back' | 'both')}
          >
            <Text style={styles.cameraButtonText}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Save" onPress={saveSettings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  label: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  cameraOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  cameraButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  cameraButtonActive: {
    backgroundColor: '#555',
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SettingsScreen;
