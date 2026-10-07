import React, { useRef, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Edit2, Plus, Trash2 } from 'lucide-react-native';

export default function TapeDisplay({
  tapeRows,
  selectedRowId,
  onSelectRow,
  onEditRow,
  onInsertRow,
  onDeleteRow,
  theme = 'light'
}) {
  const scrollViewRef = useRef(null);
  const isDark = theme === 'dark' || theme === 'normal';

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [tapeRows]);

  const containerBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';

  return (
    <View style={[styles.card, { backgroundColor: containerBg }]}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>TAPE RIWAYAT REAL-TIME</Text>
        <Text style={styles.headerSub}>Cascading Recalc</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {(!tapeRows || tapeRows.length === 0) ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Pita Riwayat Kosong</Text>
          </View>
        ) : (
          tapeRows.map((row, idx) => {
            const isSelected = selectedRowId === row.id;

            return (
              <TouchableOpacity
                key={row.id || idx}
                onPress={() => onSelectRow(row.id)}
                activeOpacity={0.8}
                style={[
                  styles.rowItem,
                  isSelected && styles.rowSelected,
                  isDark ? styles.rowDark : styles.rowLight
                ]}
              >
                <View style={styles.rowMain}>
                  <Text style={styles.rowIdx}>#{idx + 1}</Text>
                  <Text style={[styles.rowFormula, { color: textColor }]}>
                    {row.operator ? `${row.operator} ` : ''}{row.value}
                  </Text>
                  <Text style={styles.rowResult}>= {row.result}</Text>
                </View>

                {isSelected && (
                  <View style={styles.actionToolbar}>
                    <TouchableOpacity
                      onPress={() => onInsertRow(idx)}
                      style={[styles.toolBtn, styles.insertBtn]}
                    >
                      <Plus size={14} color="#16a34a" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onDeleteRow(row.id)}
                      style={[styles.toolBtn, styles.deleteBtn]}
                    >
                      <Trash2 size={14} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 10,
    maxHeight: 180,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 4
  },
  headerTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3b82f6',
    letterSpacing: 0.5
  },
  headerSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10b981'
  },
  scrollArea: {
    maxHeight: 140
  },
  scrollContent: {
    gap: 6
  },
  emptyBox: {
    paddingVertical: 16,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 12,
    color: '#94a3b8'
  },
  rowItem: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1
  },
  rowLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0'
  },
  rowDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155'
  },
  rowSelected: {
    borderColor: '#10b981',
    borderWidth: 2,
    backgroundColor: '#f0fdf4'
  },
  rowMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rowIdx: {
    fontSize: 11,
    color: '#94a3b8',
    fontFamily: 'monospace'
  },
  rowFormula: {
    fontSize: 13,
    fontWeight: '600'
  },
  rowResult: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10b981',
    fontFamily: 'monospace'
  },
  actionToolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0'
  },
  toolBtn: {
    padding: 4,
    borderRadius: 6
  },
  insertBtn: {
    backgroundColor: '#dcfce7'
  },
  deleteBtn: {
    backgroundColor: '#fee2e2'
  }
});
