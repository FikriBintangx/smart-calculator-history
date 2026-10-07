import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * React Native Storage Manager
 * Persists user configurations and history logs using AsyncStorage.
 * Enforces 1-Month (30 Days) Auto-Purge retention policy.
 */

const SETTINGS_STORAGE_KEY = 'smart_calculator_settings_v2';
const HISTORY_STORAGE_KEY = 'smart_calculator_history_v2';
const TAPE_ROWS_STORAGE_KEY = 'smart_calculator_tape_v2';

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export const DEFAULT_SETTINGS = {
  vibrationEnabled: true,
  soundEnabled: true,
  soundVolume: 80,
  theme: 'light',
  selectedExtraKeys: ['±', '√', '%', '00'],
  paperSheetConfig: {
    showMiniHistory: true,
    showSolarPanel: true,
    decimalMode: 'AUTO',
    maxTapeLines: 50
  }
};

export const INITIAL_TAPE_ROWS = [
  { id: 'tape-1', createdAt: 1000, operator: '', value: 100, result: 100 },
  { id: 'tape-2', createdAt: 2000, operator: '+', value: 50, result: 150 },
  { id: 'tape-3', createdAt: 3000, operator: '-', value: 20, result: 130 },
  { id: 'tape-4', createdAt: 4000, operator: '×', value: 2, result: 260 }
];

export function pruneItemsOlderThanOneMonth(itemList) {
  if (!Array.isArray(itemList)) return [];
  const now = Date.now();
  return itemList.filter((item) => {
    const timestamp = item.createdAt || (item.id && !isNaN(Number(item.id)) ? Number(item.id) : null);
    if (!timestamp) return true;
    return (now - timestamp) <= ONE_MONTH_MS;
  });
}

export async function loadSettingsAsync() {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      paperSheetConfig: {
        ...DEFAULT_SETTINGS.paperSheetConfig,
        ...(parsed.paperSheetConfig || {})
      }
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettingsAsync(settings) {
  try {
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export async function loadHistoryAsync() {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return pruneItemsOlderThanOneMonth(parsed);
  } catch {
    return [];
  }
}

export async function saveHistoryAsync(historyList) {
  try {
    const validPruned = pruneItemsOlderThanOneMonth(historyList);
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(validPruned.slice(0, 100)));
  } catch (e) {
    console.error('Failed to save history', e);
  }
}

export async function loadTapeRowsAsync() {
  try {
    const raw = await AsyncStorage.getItem(TAPE_ROWS_STORAGE_KEY);
    if (!raw) return INITIAL_TAPE_ROWS;
    const parsed = JSON.parse(raw);
    return pruneItemsOlderThanOneMonth(parsed);
  } catch {
    return INITIAL_TAPE_ROWS;
  }
}

export async function saveTapeRowsAsync(tapeRows) {
  try {
    const validPruned = pruneItemsOlderThanOneMonth(tapeRows);
    await AsyncStorage.setItem(TAPE_ROWS_STORAGE_KEY, JSON.stringify(validPruned));
  } catch (e) {
    console.error('Failed to save tape rows', e);
  }
}

// Synchronous fallbacks for initial render
export function loadSettings() {
  return DEFAULT_SETTINGS;
}
export function saveSettings(settings) {
  saveSettingsAsync(settings);
}
export function loadHistory() {
  return [];
}
export function saveHistory(historyList) {
  saveHistoryAsync(historyList);
}
export function loadTapeRows() {
  return INITIAL_TAPE_ROWS;
}
export function saveTapeRows(tapeRows) {
  saveTapeRowsAsync(tapeRows);
}
