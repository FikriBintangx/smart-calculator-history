import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { X, Sliders } from 'lucide-react-native';

export default function CustomKeyDialog({
  isOpen,
  onClose,
  currentSelected = ['±', '√', '%', '00'],
  onSave
}) {
  const [selected, setSelected] = useState(() =>
    Array.isArray(currentSelected) && currentSelected.length > 0 ? [...currentSelected] : ['±', '√', '%', '00']
  );

  if (!isOpen) return null;

  const availableKeys = [
    { key: '±', label: 'Plus / Minus (±)' },
    { key: '√', label: 'Akar Kuadrat (√)' },
    { key: '%', label: 'Persentase (%)' },
    { key: '00', label: 'Double Zero (00)' },
    { key: 'M+', label: 'Memory Plus (M+)' },
    { key: 'M-', label: 'Memory Minus (M-)' },
    { key: 'MR', label: 'Memory Recall (MR)' },
    { key: 'MC', label: 'Memory Clear (MC)' }
  ];

  const toggleKey = (keyStr) => {
    if (selected.includes(keyStr)) {
      setSelected(selected.filter((k) => k !== keyStr));
    } else {
      setSelected([...selected, keyStr]);
    }
  };

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <Sliders size={18} color="#2563eb" />
              <Text style={styles.modalTitle}>Kustomisasi Tombol Ekstra</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Pilih tombol tambahan untuk ditampilkan di keypad</Text>

          <ScrollView style={styles.keyList}>
            {availableKeys.map((item) => {
              const isChecked = selected.includes(item.key);
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => toggleKey(item.key)}
                  activeOpacity={0.7}
                  style={[styles.keyOption, isChecked && styles.keyOptionActive]}
                >
                  <Text style={[styles.keyText, isChecked && styles.keyTextActive]}>
                    {item.label}
                  </Text>
                  <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
                    {isChecked && <Text style={styles.checkIcon}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

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
    padding: 16,
    maxHeight: '80%'
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
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 12
  },
  keyList: {
    maxHeight: 240
  },
  keyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8
  },
  keyOptionActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff'
  },
  keyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155'
  },
  keyTextActive: {
    color: '#1d4ed8',
    fontWeight: '700'
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb'
  },
  checkIcon: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 14
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
