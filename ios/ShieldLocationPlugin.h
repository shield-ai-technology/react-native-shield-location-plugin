
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@import ShieldFraud;
@import ShieldLocationAnalysis;

@interface ShieldLocationPlugin : RCTEventEmitter <RCTBridgeModule, DeviceShieldCallback>

@end
