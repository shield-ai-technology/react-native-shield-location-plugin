/**
 * Enum representing the log levels for ShieldLocation.
 */
export declare enum LogLevel {
    LogLevelDebug = 3,
    LogLevelInfo = 2,
    LogLevelNone = 1
}
/**
 * Enum representing the environment information for ShieldLocation.
 */
export declare enum EnvironmentInfo {
    EnvironmentProd = 0,
    EnvironmentDev = 1,
    EnvironmentStag = 2
}
/**
 * Configuration object for initializing ShieldLocation.
 */
export interface Config {
    siteID: string;
    secretKey: string;
    blockedDialog?: {
        title: string;
        body: string;
    } | null;
    logLevel?: LogLevel;
    environmentInfo?: EnvironmentInfo;
}
/**
 * Type definition for the success callback function.
 */
type SuccessCallback = (data: any) => void;
/**
 * Type definition for the failure callback function.
 */
type FailureCallback = (error: any) => void;
/**
 * Type definition for the ShieldLocation callback functions.
 */
export type ShieldCallback = {
    onSuccess?: SuccessCallback;
    onFailure?: FailureCallback;
};
/**
 * The `ShieldLocation` class is a wrapper for the ShieldLocationPlugin native module in React Native.
 * It provides methods for initializing ShieldLocation, retrieving session ID, checking the SDK readiness,
 * sending attributes, and getting the latest device result.
 */
declare class ShieldLocation {
    /**
     * The native module for accessing the ShieldLocationPlugin.
     */
    private static PlatformWrapper;
    /**
     * The event emitter for listening to success and error events.
     */
    private static eventEmitter;
    /**
     * Initializes the ShieldLocation plugin with the provided configuration.
     *
     * @param config - The configuration object containing the required properties.
     * @param callbacks - (Optional) The callback functions for success and failure events.
     */
    static initShield(config: Config, callbacks?: ShieldCallback): Promise<void>;
    /**
     * Private method to set cross-platform parameters.
     * The cross-platform name and the version is fetched from package.json.
     */
    private static setCrossPlatformParameters;
    /**
     * Sets up event listeners for success and error events.
     *
     * @param callbacks - The callback functions for success and failure events.
     */
    private static listeners;
    /**
     * Retrieves the session ID from the ShieldLocation plugin.
     *
     * @returns A Promise that resolves with the session ID.
     */
    static getSessionId(): Promise<string>;
    /**
     * Checks whether the ShieldLocation plugin is initialized.
     *
     * @returns A Promise that resolves with a boolean value indicating whether the ShieldLocation plugin is initialized (true) or not (false).
     */
    static isShieldInitialized(): Promise<boolean>;
    /**
     * Checks if the ShieldLocation SDK is ready and invokes the provided callback with the readiness state.
     *
     * @param callback - A callback function to be invoked with the readiness state.
     *   - `isReady` (boolean): A boolean value indicating whether the ShieldLocation SDK is ready.
     */
    static isSDKready(callback: (isReady: boolean) => void): Promise<void>;
    /**
     * Sends attributes to the ShieldLocation plugin for a specific screen.
     *
     * @param screenName - The name of the screen.
     * @param data - The attribute data object.
     */
    static sendAttributes(screenName: string, data: object): void;
    /**
     * Retrieves the latest device result from the ShieldLocation plugin.
     *
     * @returns A Promise that resolves with the latest device result object.
     */
    static getLatestDeviceResult(): Promise<object>;
}
export default ShieldLocation;
//# sourceMappingURL=index.d.ts.map