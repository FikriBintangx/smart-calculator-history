import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Platform,
  StyleSheet
} from 'react-native';
import { X, Copy, FileText } from 'lucide-react-native';
import { exportTapeToText } from '../logic/calculatorEngine';

export default function ConvertToTextModal({ isOpen, onClose, tapeRows }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const plainTextOutput = exportTapeToText(tapeRows);

  const handleCopy = () => {
    setCopied(true);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Teks riwayat tersalin!', ToastAndroid.SHORT);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <FileText size={18} color="#2563eb" />
              <Text style={styles.modalTitle}>Ubah ke Teks Biasa</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea}>
            <Text style={styles.plainText}>{plainTextOutput || 'Tidak ada riwayat.'}</Text>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Tutup</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
              <Copy size={16} color="#ffffff" />
              <Text style={styles.copyText}>{copied ? 'Tersalin!' : 'Salin Teks'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
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
  closeBtn: {
    padding: 4
  },
  scrollArea: {
    maxHeight: 220,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6
  },
  plainText: {
    color: '#34d399',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f1f5f9'
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b'
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#2563eb'
  },
  copyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff'
  }
});
