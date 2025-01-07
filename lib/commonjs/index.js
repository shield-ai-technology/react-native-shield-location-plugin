"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.LogLevel = exports.EnvironmentInfo = void 0;
var _reactNative = require("react-native");
var _package = _interopRequireDefault(require("../package.json"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Enum representing the log levels for ShieldLocation.
 */
let LogLevel = exports.LogLevel = /*#__PURE__*/function (LogLevel) {
  LogLevel[LogLevel["LogLevelDebug"] = 3] = "LogLevelDebug";
  LogLevel[LogLevel["LogLevelInfo"] = 2] = "LogLevelInfo";
  LogLevel[LogLevel["LogLevelNone"] = 1] = "LogLevelNone";
  return LogLevel;
}({});
/**
 * Enum representing the environment information for ShieldLocation.
 */
let EnvironmentInfo = exports.EnvironmentInfo = /*#__PURE__*/function (EnvironmentInfo) {
  EnvironmentInfo[EnvironmentInfo["EnvironmentProd"] = 0] = "EnvironmentProd";
  EnvironmentInfo[EnvironmentInfo["EnvironmentDev"] = 1] = "EnvironmentDev";
  EnvironmentInfo[EnvironmentInfo["EnvironmentStag"] = 2] = "EnvironmentStag";
  return EnvironmentInfo;
}({});
/**
 * Configuration object for initializing ShieldLocation.
 */
/**
 * Type definition for the success callback function.
 */
/**
 * Type definition for the failure callback function.
 */
/**
 * Type definition for the ShieldLocation callback functions.
 */
/**
 * The `ShieldLocation` class is a wrapper for the ShieldLocationPlugin native module in React Native.
 * It provides methods for initializing ShieldLocation, retrieving session ID, checking the SDK readiness,
 * sending attributes, and getting the latest device result.
 */
class ShieldLocation {
  /**
   * The native module for accessing the ShieldLocationPlugin.
   */
  static PlatformWrapper = _reactNative.NativeModules.ShieldLocationPlugin;

  /**
   * The event emitter for listening to success and error events.
   */
  static eventEmitter = new _reactNative.NativeEventEmitter(ShieldLocation.PlatformWrapper);

  /**
   * Initializes the ShieldLocation plugin with the provided configuration.
   *
   * @param config - The configuration object containing the required properties.
   * @param callbacks - (Optional) The callback functions for success and failure events.
   */
  static async initShield(config, callbacks) {
    const isOptimizedListener = !!callbacks;

    // Set default values if logLevel is not provided
    const logLevel = config.logLevel || LogLevel.LogLevelNone;

    // Set default values if environmentInfo is not provided
    const environmentInfo = config.environmentInfo || EnvironmentInfo.EnvironmentProd;

    // Set cross-platform parameters internally (React Native and version from package.json)
    ShieldLocation.setCrossPlatformParameters();

    // Call the native method to initialize ShieldLocation with the provided configuration.
    await ShieldLocation.PlatformWrapper.initShield(config.siteID, config.secretKey, isOptimizedListener, config.blockedDialog, logLevel, environmentInfo);
    if (isOptimizedListener) {
      // Set up listeners for success and error events if callbacks are provided.
      ShieldLocation.listeners(callbacks);
    }
  }

  /**
   * Private method to set cross-platform parameters.
   * The cross-platform name and the version is fetched from package.json.
   */
  static setCrossPlatformParameters() {
    const crossPlatformName = _package.default.name;
    const crossPlatformVersion = _package.default.version;
    ShieldLocation.PlatformWrapper.setCrossPlatformParameters(crossPlatformName, crossPlatformVersion);
  }

  /**
   * Sets up event listeners for success and error events.
   *
   * @param callbacks - The callback functions for success and failure events.
   */
  static listeners(callbacks) {
    // Listen for success events and invoke the onSuccess callback if provided.
    ShieldLocation.eventEmitter.addListener("success", data => {
      if (callbacks?.onSuccess) {
        callbacks.onSuccess(data);
      }
    });

    // Listen for error events and invoke the onFailure callback if provided.
    ShieldLocation.eventEmitter.addListener("error", error => {
      if (callbacks?.onFailure) {
        callbacks.onFailure(error);
      }
    });
  }

  /**
   * Retrieves the session ID from the ShieldLocation plugin.
   *
   * @returns A Promise that resolves with the session ID.
   */
  static getSessionId() {
    return ShieldLocation.PlatformWrapper.getSessionId();
  }

  /**
   * Checks whether the ShieldLocation plugin is initialized.
   *
   * @returns A Promise that resolves with a boolean value indicating whether the ShieldLocation plugin is initialized (true) or not (false).
   */
  static isShieldInitialized() {
    return ShieldLocation.PlatformWrapper.isShieldInitialized();
  }

  /**
   * Checks if the ShieldLocation SDK is ready and invokes the provided callback with the readiness state.
   *
   * @param callback - A callback function to be invoked with the readiness state.
   *   - `isReady` (boolean): A boolean value indicating whether the ShieldLocation SDK is ready.
   */
  static async isSDKready(callback) {
    try {
      // Adding a timeout of 100 milliseconds
      await new Promise(resolve => setTimeout(resolve, 100));
      const isInitialized = await this.isShieldInitialized();
      if (!isInitialized) {
        console.log("Shield SDK not initialized:");
        callback(false);
        return;
      }
      const deviceResultListener = event => {
        if (event.status === "isSDKReady") {
          ShieldLocation.eventEmitter.removeAllListeners("device_result_state");
          callback(true);
        }
      };
      ShieldLocation.eventEmitter.addListener("device_result_state", deviceResultListener);
      ShieldLocation.PlatformWrapper.setDeviceResultStateListener();
    } catch (error) {
      console.error("An error occurred:", error);
      callback(false);
    }
  }

  /**
   * Sends attributes to the ShieldLocation plugin for a specific screen.
   *
   * @param screenName - The name of the screen.
   * @param data - The attribute data object.
   */
  static sendAttributes(screenName, data) {
    ShieldLocation.PlatformWrapper.sendAttributes(screenName, data);
  }

  /**
   * Retrieves the latest device result from the ShieldLocation plugin.
   *
   * @returns A Promise that resolves with the latest device result object.
   */
  static getLatestDeviceResult() {
    return new Promise((resolve, reject) => {
      ShieldLocation.PlatformWrapper.getLatestDeviceResult(result => {
        // Handle success with the result object
        resolve(result);
      }, error => {
        // Handle error with the error object
        reject(error);
      });
    });
  }
}
var _default = exports.default = ShieldLocation;
//# sourceMappingURL=index.js.map