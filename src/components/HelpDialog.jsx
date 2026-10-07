import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { X, HelpCircle } from 'lucide-react-native';

export default function HelpDialog({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <HelpCircle size={18} color="#2563eb" />
              <Text style={styles.modalTitle}>Panduan Penggunaan</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea}>
            <View style={styles.item}>
              <Text style={styles.itemTitle}>1. Pita Riwayat Cascading</Text>
              <Text style={styles.itemBody}>
                Ketuk salah satu baris perhitungan pada area atas untuk memilihnya sebagai baris aktif. Ubah nilainya atau sisipkan baris baru, maka seluruh hasil perhitungan setelahnya akan otomatis dihitung ulang!
              </Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.itemTitle}>2. Tombol Ekstra</Text>
              <Text style={styles.itemBody}>
                Gunakan tombol %, √, ±, atau 00 untuk mempercepat perhitungan. Anda dapat memilih tombol apa saja yang tampil via menu Pengaturan.
              </Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.itemTitle}>3. Kebijakan Retensi 1 Bulan</Text>
              <Text style={styles.itemBody}>
                Seluruh data riwayat disimpan secara lokal di perangkat Android Anda dan dibersihkan otomatis setelah 30 hari.
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.okBtn}>
            <Text style={styles.okText}>Saya Mengerti</Text>
          </TouchableOpacity>
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
  closeBtn: {
    padding: 4
  },
  scrollArea: {
    maxHeight: 260
  },
  item: {
    marginBottom: 12,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 12
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563eb',
    marginBottom: 2
  },
  itemBody: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16
  },
  okBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  okText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  }
});
