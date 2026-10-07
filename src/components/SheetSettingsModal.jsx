import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet
} from 'react-native';
import { X, FileText } from 'lucide-react-native';

export default function SheetSettingsModal({
  isOpen,
  onClose,
  paperConfig = {},
  onSave
}) {
  const [cfg, setCfg] = useState({
    showMiniHistory: paperConfig.showMiniHistory ?? true,
    showSolarPanel: paperConfig.showSolarPanel ?? true,
    decimalMode: paperConfig.decimalMode || 'AUTO'
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(cfg);
    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <FileText size={18} color="#2563eb" />
              <Text style={styles.modalTitle}>Pengaturan Lembar Riwayat</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.rowItem}>
              <View style={styles.textGroup}>
                <Text style={styles.label}>Panel Surya (Solar Cell)</Text>
                <Text style={styles.sub}>Tampilkan hiasan panel surya di atas LCD</Text>
              </View>
              <Switch
                value={cfg.showSolarPanel}
                onValueChange={(val) => setCfg({ ...cfg, showSolarPanel: val })}
                trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
                thumbColor={cfg.showSolarPanel ? '#2563eb' : '#f8fafc'}
              />
            </View>

            <View style={styles.rowItem}>
              <View style={styles.textGroup}>
                <Text style={styles.label}>Baris Rumus Mini LCD</Text>
                <Text style={styles.sub}>Tampilkan baris riwayat kecil di atas angka utama LCD</Text>
              </View>
              <Switch
                value={cfg.showMiniHistory}
                onValueChange={(val) => setCfg({ ...cfg, showMiniHistory: val })}
                trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
                thumbColor={cfg.showMiniHistory ? '#2563eb' : '#f8fafc'}
              />
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveText}>Simpan</Text>
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
    padding: 16
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  content: {
    marginVertical: 14,
    gap: 12
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textGroup: {
    flex: 1,
    paddingRight: 10
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b'
  },
  sub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8
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
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#2563eb'
  },
  saveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff'
  }
});
