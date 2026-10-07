import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu, Copy, Delete } from 'lucide-react-native';

export default function Keypad({
  onKeyPress,
  onOpenMenu,
  onCopyDisplay,
  activeOperator,
  selectedExtraKeys = ['±', '√', '%', '00'],
  isButtonsHidden = false,
  theme = 'light'
}) {
  const isDark = theme === 'dark' || theme === 'normal';

  const defaultExtraKeys = ['±', '√', '%', '00'];
  const activeExtraKeys = Array.isArray(selectedExtraKeys) && selectedExtraKeys.length > 0
    ? selectedExtraKeys
    : defaultExtraKeys;

  const row1Keys = [
    { label: 'Menu', type: 'menu', icon: Menu },
    { label: 'Copy', type: 'copy', icon: Copy },
    { label: 'C', type: 'clear' },
    { label: '⌫', type: 'backspace', icon: Delete }
  ];

  const numberGrid = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+']
  ];

  const renderKeyContent = (btn) => {
    if (btn.icon) {
      const IconComp = btn.icon;
      const color = btn.type === 'clear' ? '#ffffff' : isDark ? '#f8fafc' : '#334155';
      return <IconComp size={20} color={color} />;
    }
    return (
      <Text style={[styles.keyText, getKeyTextStyle(btn.type, isDark)]}>
        {btn.label}
      </Text>
    );
  };

  return (
    <View style={styles.keypadContainer}>
      {/* Row 1: Function Controls (Menu, Copy, C, Backspace) */}
      <View style={styles.row}>
        {row1Keys.map((btn, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              if (btn.type === 'menu') onOpenMenu();
              else if (btn.type === 'copy') onCopyDisplay();
              else onKeyPress(btn.label, btn.type);
            }}
            activeOpacity={0.7}
            style={[styles.keyBtn, getKeyStyle(btn.type, isDark)]}
          >
            {renderKeyContent(btn)}
          </TouchableOpacity>
        ))}
      </View>

      {/* Row 2: Extension Keys (% , √, ±, 00) */}
      {!isButtonsHidden && (
        <View style={styles.row}>
          {activeExtraKeys.slice(0, 4).map((keyStr, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => onKeyPress(keyStr, 'extra')}
              activeOpacity={0.7}
              style={[styles.keyBtn, styles.extraBtn, isDark ? styles.extraDark : styles.extraLight]}
            >
              <Text style={[styles.keyText, isDark ? styles.textDark : styles.textLight]}>
                {keyStr}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Main 4x4 Numeric & Operator Grid */}
      {numberGrid.map((row, rIdx) => (
        <View key={rIdx} style={styles.row}>
          {row.map((keyChar, cIdx) => {
            const isOp = ['÷', '×', '-', '+', '='].includes(keyChar);
            const isEquals = keyChar === '=';
            const isActiveOp = activeOperator === keyChar;

            return (
              <TouchableOpacity
                key={cIdx}
                onPress={() => onKeyPress(keyChar, isOp ? 'operator' : 'number')}
                activeOpacity={0.7}
                style={[
                  styles.keyBtn,
                  isEquals
                    ? styles.equalsBtn
                    : isOp
                    ? isActiveOp
                      ? styles.opActiveBtn
                      : styles.opBtn
                    : isDark
                    ? styles.numDark
                    : styles.numLight
                ]}
              >
                <Text
                  style={[
                    styles.keyText,
                    isEquals || isOp
                      ? styles.textWhite
                      : isDark
                      ? styles.textDark
                      : styles.textLight
                  ]}
                >
                  {keyChar}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function getKeyStyle(type, isDark) {
  switch (type) {
    case 'clear':
      return styles.clearBtn;
    case 'backspace':
      return styles.backspaceBtn;
    case 'menu':
    case 'copy':
      return isDark ? styles.fnDark : styles.fnLight;
    default:
      return isDark ? styles.numDark : styles.numLight;
  }
}

function getKeyTextStyle(type, isDark) {
  if (type === 'clear') return styles.textWhite;
  return isDark ? styles.textDark : styles.textLight;
}

const styles = StyleSheet.create({
  keypadContainer: {
    gap: 8,
    marginTop: 4
  },
  row: {
    flexDirection: 'row',
    gap: 8
  },
  keyBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  extraBtn: {
    height: 44
  },
  keyText: {
    fontSize: 20,
    fontWeight: '700'
  },
  fnLight: {
    backgroundColor: '#e2e8f0'
  },
  fnDark: {
    backgroundColor: '#334155'
  },
  clearBtn: {
    backgroundColor: '#ef4444'
  },
  backspaceBtn: {
    backgroundColor: '#f97316'
  },
  extraLight: {
    backgroundColor: '#f1f5f9'
  },
  extraDark: {
    backgroundColor: '#1e293b'
  },
  numLight: {
    backgroundColor: '#ffffff'
  },
  numDark: {
    backgroundColor: '#1e293b'
  },
  opBtn: {
    backgroundColor: '#2563eb'
  },
  opActiveBtn: {
    backgroundColor: '#1d4ed8',
    borderWidth: 2,
    borderColor: '#60a5fa'
  },
  equalsBtn: {
    backgroundColor: '#16a34a'
  },
  textWhite: {
    color: '#ffffff'
  },
  textLight: {
    color: '#0f172a'
  },
  textDark: {
    color: '#f8fafc'
  }
});
