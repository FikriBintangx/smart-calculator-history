import { Vibration } from 'react-native';

/**
 * Trigger Haptic Vibration Feedback for React Native Android
 */
export function triggerVibration(enabled = true, durationMs = 25) {
  if (!enabled) return;
  try {
    Vibration.vibrate(durationMs);
  } catch {
    // Ignore if vibration permissions or hardware missing
  }
}
