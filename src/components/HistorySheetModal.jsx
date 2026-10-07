import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { X, History, Trash2 } from 'lucide-react-native';

export default function HistorySheetModal({
  isOpen,
  onClose,
  history = [],
  onClearHistory,
  onSelectResult
}) {
  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <History size={18} color="#2563eb" />
              <Text style={styles.modalTitle}>Lembar Riwayat Perhitungan</Text>
            </View>

            <View style={styles.actionRow}>
              {history.length > 0 && (
                <TouchableOpacity onPress={onClearHistory} style={styles.clearBtn}>
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={18} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.scrollArea}>
            {(!history || history.length === 0) ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Belum Ada Riwayat Perhitungan</Text>
              </View>
            ) : (
              history.map((item, idx) => (
                <TouchableOpacity
                  key={item.id || `hist-${idx}`}
                  onPress={() => {
                    if (onSelectResult) onSelectResult(item.result);
                    onClose();
                  }}
                  style={styles.historyCard}
                >
                  <Text style={styles.formulaText}>{item.formula}</Text>
                  <Text style={styles.resultText}>= {item.result}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: '75%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a'
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  clearBtn: {
    padding: 4
  },
  closeBtn: {
    padding: 4
  },
  scrollArea: {
    maxHeight: 300
  },
  emptyBox: {
    paddingVertical: 30,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 12,
    color: '#94a3b8'
  },
  historyCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8
  },
  formulaText: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace'
  },
  resultText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10b981',
    fontFamily: 'monospace',
    marginTop: 2
  }
});
