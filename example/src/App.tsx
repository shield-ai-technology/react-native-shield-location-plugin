import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import ShieldLocation, {
  LogLevel,
  EnvironmentInfo,
} from 'react-native-shield-location-plugin';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import type { Config, ShieldCallback } from 'react-native-shield-location-plugin';

const App = () => {
  const [sessionId, setSessionId] = useState('');
  const [successResult, setSuccessResult] = useState('');
  const [locationPermissionStatus, setLocationPermissionStatus] = useState('');

  const callbacks: ShieldCallback = {
    onSuccess: (data) => {
      console.log('Callback Success:', data);
      setSuccessResult(JSON.stringify(data, null, 2));
    },
    onFailure: (error) => {
      console.log('Callback Failure:', error);
      setSuccessResult(error);
    },
  };

  const config: Config = {
    siteID: 'SHIELD_SITE_ID',
    secretKey: 'SHIELD_SECRET_KEY',
    blockedDialog: {
      title: 'Blocked Dialog Title',
      body: 'Blocked Dialog Body',
    },
    logLevel: LogLevel.LogLevelDebug,
    environmentInfo: EnvironmentInfo.EnvironmentProd,
  };

  const requestLocationPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );

      switch (result) {
        case RESULTS.GRANTED:
          setLocationPermissionStatus('Granted');
          break;
        case RESULTS.DENIED:
          setLocationPermissionStatus('Denied');
          Alert.alert('Permission Denied', 'Location access is required for this app.');
          break;
        case RESULTS.BLOCKED:
          setLocationPermissionStatus('Blocked');
          Alert.alert(
            'Permission Blocked',
            'Location access is blocked. Please enable it in the app settings.'
          );
          break;
        case RESULTS.UNAVAILABLE:
          setLocationPermissionStatus('Unavailable');
          break;
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const initializeShield = async () => {
    try {
      await ShieldLocation.initShield(config, callbacks);

      ShieldLocation.isSDKready(async (isReady: boolean) => {
        if (isReady) {
          ShieldLocation.sendAttributes('Home', { userid: 'userid' });
          const sessionID = await ShieldLocation.getSessionId();
          setSessionId(sessionID);
        } else {
          console.log('SDK is not ready');
        }
      });

    } catch (error) {
      console.error('Shield SDK initialization error:', error);
    }
  };

  useEffect(() => {
    // Request location permission first
    requestLocationPermission().then(() => {
      // Wait for 3 seconds before initializing Shield SDK
      setTimeout(() => {
        initializeShield();
      }, 3000);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.terminalContainer}>
        <Text style={styles.terminalText}>$ Welcome to My App!</Text>
        <Text style={styles.terminalText}>$ Location Permission: {locationPermissionStatus}</Text>
        <Text style={styles.terminalText}>$ Session ID: {sessionId}</Text>
        <Text style={styles.terminalText}>$ Result: {successResult}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  terminalContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'white',
    maxWidth: '80%',
  },
  terminalText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
  },
});

export default App;