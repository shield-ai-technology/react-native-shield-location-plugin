import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShieldLocation, { LogLevel, Config, EnvironmentInfo, ShieldCallback } from 'react-native-shield-location-plugin';

const App = () => {
  const [sessionId, setSessionId] = useState('');
  const [successResult, setSuccessResult] = useState('');

  // Define the callback function
  const callbacks: ShieldCallback = {
    onSuccess: (data) => {
      // Handle success event here
      console.log('Callback Success:', data);
      setSuccessResult(JSON.stringify(data, null, 2));
    },
    onFailure: (error) => {
      // Handle failure event here
      console.log('Callback Failure:', error);
      setSuccessResult(error)
    },
  };

  const config: Config = {
    siteID: 'dda05c5ddac400e1c133a360e2714aada4cda052',
    secretKey: '9ce44f88a25272b6d9cbb430ebbcfcf1',
    blockedDialog: {
      title: 'Blocked Dialog Title',
      body: 'Blocked Dialog Body'
    }, // can be null also depending on your requirement,
    logLevel: LogLevel.LogLevelInfo,
    environmentInfo: EnvironmentInfo.EnvironmentProd
  };

  useEffect(() => {
    // Call the initShield function with the Config object
    const initializeShield = async () => {
      await ShieldLocation.initShield(config, callbacks)

      ShieldLocation.isSDKready(async (isReady: boolean) => {
        if (isReady) {
          console.log('SDK ready for sendAttributes:', isReady);
          ShieldLocation.sendAttributes("Home", { userid: "userid" }); 
        } else {
          console.log("SDK is not ready for sendAttributes");
        }
      });
      ShieldLocation.isSDKready(async (isReady: boolean) => {
        if (isReady) {
          console.log('SDK ready for sessionID:', isReady);
          const sessionID = await ShieldLocation.getSessionId(); // Fetch session ID using await
          setSessionId(sessionID); // Set session ID to state
        } else {
          console.log("SDK is not ready for sessionID");
        }
      });
      ShieldLocation.isSDKready(async (isReady: boolean) => {
        if (isReady) {
          console.log('SDK ready for getLatestDeviceResult:', isReady);
          
          ShieldLocation.getLatestDeviceResult()
          .then((result: object) => {
            // Handle success with the result object
            if (!successResult) {
              console.log('Received latest device result:', result);
              setSuccessResult(JSON.stringify(result, null, 2));
            }
          })
          .catch((error: object) => {
            // Handle error with the error object
            console.log('Error retrieving device result:', error);
          });
        } else {
          console.log("SDK is not ready for getLatestDeviceResult");
        }
      });
    }
   initializeShield();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.terminalContainer}>
        <Text style={styles.terminalText}>$ Welcome to My App!</Text>
        <Text style={styles.terminalText}>$ session id - {sessionId}</Text>
        <Text style={styles.terminalText}>$ Result - {successResult}</Text>
      </View>
      {/* Additional UI components for your app */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Set background color to black
  },
  terminalContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'black', // Set background color to black
    borderWidth: 1,
    borderColor: 'white', // Set border color to white
    maxWidth: '80%',
  },
  terminalText: {
    color: 'white', // Set text color to white
    fontSize: 14,
    marginBottom: 8,
  },
});

export default App;
