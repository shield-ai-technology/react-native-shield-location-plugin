# React Native Shield Location Plugin

React Native Plugin for Shield Fraud and ShieldLocation (www.shield.com)

React Native Shield Location Plugin helps developers to assess malicious activities performed on mobile devices and return risk intelligence based on user's behaviour. It collects device's fingerprint, social metrics and network information. 

There are few steps to getting started with the SHIELD SDK:

1. [Integrate the SDK](#integrate-the-sdk)

2. [Initialize the SDK](#initialize-the-sdk)

3. [Get Session ID](#get-session-id)

4. [Send Custom Attributes](#send-custom-attributes)



### Integrate the SDK

This package can be installed in two ways, you can choose a way depends on your need.

**NPM:**
```
npm install react-native-shield-location-plugin
```
**OR**

**YARN:**
```
yarn add react-native-shield-location-plugin
```

**Important Note**:

**IOS-**
Requires running 'pod install' command in your app/ios directory from terminal.

**Before running 'pod install' command please verify that 'dynamic' option is added when you configure linkage for frameworks.**
```
# Configure linkage for frameworks
linkage = ENV['USE_FRAMEWORKS'] || 'dynamic'
```


We make continuous enhancements to our fraud library and detection capabilities which includes new functionalities, bug fixes and security updates. We recommend updating to the latest SDK version to protect against rapidly evolving fraud risks.

You can refer to the Changelog to see more details about our updates.

### Initialize the SDK

The SDK initialization should be configured on `useEffect` *(for **Functional Components**)* or `componentDidMount` *(for **Class Components**)* in your **App.tsx** or on **App launch** to ensure successful generation and processing of the device fingerprint. The SDK is to be initialized only once and will throw an exception if it is initialized more than once.

You need both the **SHIELD_SITE_ID** and **SHIELD_SECRET_KEY** to initialize the SDK. You can locate them at the top of the page.
```
const config: Config = {
   siteID: 'SHIELD_SITE_ID',
   secretKey: 'SHIELD_SECRET_KEY'
};

useEffect(() => {
  const initializeShield = async () => {
    await ShieldLocation.initShield(config);
  };
  
  initializeShield();
}, []);
```
**Note** - ```await ShieldFraud.initShield(config)``` - *The await keyword is used to wait for the promise returned by the initShield function to resolve. In React Native, It is best practice to use `await` when calling native modules from React Native, especially during `asynchronous` operations such as SDK Initialization. This is because using `await` ensures that the main thread is not blocked while the native module is initializing.*

`Config` has these **optional** parameters:

1. `logLevel` Set your log level to `debug`, `info` or `none`. | Receives high-level information about how the SDK processes network requests, responses or error information during SDK integration. Default log level is `none`.
2. `environmentInfo` Set your environment info to `prod`, `dev` or `staging`. Default environment info is `prod`.
3. `blockedDialog` Set your dialog for the blocked dialog both title and body or you can send it as null as well 

Note: You can check whether Shield SDK is ready or not by using isSDKready function

```
ShieldLocation.isSDKready(async (isReady: boolean) => {
  if (isReady) {
    // Shield is Ready: Do your implementation
  }
}
```

### Get Session ID
Session ID is the unique identifier of a user’s app session and acts as a point of reference when retrieving the device result for that session.


Session ID follows the OS lifecycle management, in-line with industry best practice. This means that a user’s session is active for as long as the device maintains it, unless the user terminates the app or the device runs out of memory and has to kill the app.

If you would like to retrieve device results using the backend API, it is important that you store the Session ID on your system. You will need to call the SHIELD backend API using this Session ID.

```
ShieldLocation.isSDKready(async (isReady: boolean) => {
    if (isReady) {
        const sessionID = await ShieldLocation.getSessionId(); // Fetch session ID using await
        console.log('session id: ', sessionID);
    }
}
```

### Get Device Results
SHIELD provides you actionable device intelligence which you can retrieve from the SDK, via the `Optimized Listener` or `Customized Pull method`. You can also retrieve results via the backend API.

*Warning: Only 1 method of obtaining device results **(Optimized Listener or Customized Pull)** can be in effect at any point in time.*

#### Retrieve device results via Optimized Listener

##### SHIELD recommends the Optimized Listener method to reduce number of API calls. #####

Our SDK will capture an initial device fingerprint upon SDK initialization and return an additional set of device intelligence ONLY if the device fingerprint changes along one session. This ensures a truly optimized end to end protection of your ecosystem.

You can register a callback if you would like to be notified in the event that the device attributes change during the session (for example, a user activates a malicious tool a moment after launching the page).

Add an additional parameter during intialization in order to register a callback. 

**For example - `await ShieldFraud.initShield(config, callbacks);`**
 ```
 const callbacks: ShieldCallback = {
  onSuccess: (data) => {
    // Handle success event here
    console.log('Success:', data);
  },
  onFailure: (error) => {
    // Handle failure event here
    console.log('Error:', error);
  },
};

const config: Config = {
  siteID: 'SHIELD_SITE_ID',
  secretKey: 'SHIELD_SECRET_KEY'
};

useEffect(() => {
  const initializeShield = async () => {
    await ShieldLocation.initShield(config, callbacks);
  };
  initializeShield();
}, []);
 ```


### Send Custom Attributes

Use the sendAttributes function to sent event-based attributes such as user_id or activity_id for enhanced analytics. This function accepts two parameters:screenName where the function is triggered, and data to provide any custom fields in key, value pairs.

```
ShieldLocation.isSDKready(async (isReady: boolean) => {
    if (isReady) {
        ShieldLocation.sendAttributes('Screen_Name', { key1: 'value1', key2: 'value2' });
    }
}
```
