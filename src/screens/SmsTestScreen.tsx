import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeModules } from 'react-native';

const { SmsModule } = NativeModules;

const SmsTestScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('18632287124');
  const [message, setMessage] = useState('');

  const sendSMS = () => {
    if (!phoneNumber || !message) {
      Alert.alert('Error', 'Please enter both a phone number and a message.');
      return;
    }

    try {
      SmsModule.sendSMS(phoneNumber, message); // Ensure method name is exactly correct
      Alert.alert('Success', 'SMS sent (check logcat for confirmation)');
    } catch (error) {
      console.error('SMS send error:', error);
      Alert.alert('Error', 'Failed to send SMS.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Test SMS</Text>

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholder="Enter phone number"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          placeholder="Type your test message here"
          placeholderTextColor="#aaa"
        />

        <Button title="Send SMS" onPress={sendSMS} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  inner: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default SmsTestScreen;
