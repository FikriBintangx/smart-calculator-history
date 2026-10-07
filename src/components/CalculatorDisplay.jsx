import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { History } from 'lucide-react-native';

export default function CalculatorDisplay({
  displayValue,
  formula,
  isError,
  showSolarPanel = true,
  showMiniHistory = true,
  decimalMode = 'AUTO',
  theme = 'light',
  onOpenHistory
}) {
  const isDark = theme === 'dark' || theme === 'normal';

  const lcdBg = isDark ? '#0f172a' : '#ecfdf5';
  const lcdBorder = isDark ? '#334155' : '#a7f3d0';
  const mainTextColor = isError ? '#ef4444' : isDark ? '#f8fafc' : '#065f46';
  const formulaColor = isDark ? '#94a3b8' : '#047857';

  return (
    <View style={[styles.lcdContainer, { backgroundColor: lcdBg, borderColor: lcdBorder }]}>
      {/* Upper Status / Solar Panel */}
      <View style={styles.topStatusRow}>
        <View style={styles.leftMeta}>
          <Text style={styles.metaBadge}>{decimalMode}</Text>
          <Text style={styles.metaLabel}>PIT A / TAPE</Text>
        </View>

        {showSolarPanel && (
          <View style={styles.solarPanel}>
            <View style={styles.solarCell} />
            <View style={styles.solarCell} />
            <View style={styles.solarCell} />
          </View>
        )}
      </View>

      {/* Formula String Line */}
      {showMiniHistory && (
        <View style={styles.formulaRow}>
          <Text style={[styles.formulaText, { color: formulaColor }]} numberOfLines={1}>
            {formula || ''}
          </Text>

          <TouchableOpacity onPress={onOpenHistory} style={styles.historyIconBtn}>
            <History size={14} color={formulaColor} />
          </TouchableOpacity>
        </View>
      )}

      {/* Main Big LCD Digit Line */}
      <View style={styles.valueRow}>
        <Text style={[styles.valueText, { color: mainTextColor }]} numberOfLines={1} adjustsFontSizeToFit>
          {displayValue}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lcdContainer: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    marginVertical: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3
  },
  topStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  leftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  metaBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    fontFamily: 'monospace'
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5
  },
  solarPanel: {
    flexDirection: 'row',
    backgroundColor: '#78350f',
    padding: 2,
    borderRadius: 4,
    gap: 2,
    borderWidth: 1,
    borderColor: '#451a03'
  },
  solarCell: {
    width: 12,
    height: 12,
    backgroundColor: '#92400e',
    borderRadius: 1
  },
  formulaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 18,
    marginTop: 2
  },
  formulaText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'monospace',
    flex: 1
  },
  historyIconBtn: {
    padding: 2,
    marginLeft: 6
  },
  valueRow: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 4
  },
  valueText: {
    fontSize: 36,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: -0.5
  }
});
