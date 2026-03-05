export type DeviceType = 'ios' | 'android' | 'desktop';

export function getDeviceType(): DeviceType {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    // iOS detection from: https://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
        return 'ios';
    }

    if (/android/i.test(userAgent)) {
        return 'android';
    }

    return 'desktop';
}

export const isIOS = getDeviceType() === 'ios';
export const isAndroid = getDeviceType() === 'android';
export const isMobile = isIOS || isAndroid;
