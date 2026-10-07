import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import {
  X,
  Eye,
  EyeOff,
  FileText,
  Settings,
  Crown
} from 'lucide-react-native';

export default function MenuModal({
  isOpen,
  onClose,
  onToggleHideButtons,
  isButtonsHidden,
  onConvertToText,
  onOpenSettings,
  onOpenUpgrade,
  isPremium
}) {
  if (!isOpen) return null;

  const menuItems = [
    {
      id: 'hide_buttons',
      icon: isButtonsHidden ? Eye : EyeOff,
      label: isButtonsHidden ? 'Tampilkan Tombol Ekstra' : 'Sembunyikan Tombol (Hide Buttons)',
      action: () => {
        onToggleHideButtons();
        onClose();
      }
    },
    {
      id: 'convert_text',
      icon: FileText,
      label: 'Ubah ke Teks (Convert to Text)',
      action: () => {
        onConvertToText();
        onClose();
      }
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Pengaturan (Settings)',
      action: () => {
        onOpenSettings();
        onClose();
      }
    },
    {
      id: 'upgrade',
      icon: Crown,
      label: isPremium ? 'Status Premium Aktif ⭐' : 'Upgrade ke Premium',
      color: '#eab308',
      action: () => {
        onOpenUpgrade();
        onClose();
      }
    }
  ];

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Menu Utama</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.menuList}>
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const iconColor = item.color || '#2563eb';
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={item.action}
                  activeOpacity={0.7}
                  style={styles.menuItem}
                >
                  <View style={styles.itemRow}>
                    <IconComp size={18} color={iconColor} />
                    <Text style={styles.itemLabel}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableOpacity>
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
    maxWidth: 340,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a'
  },
  closeBtn: {
    padding: 4
  },
  menuList: {
    gap: 6
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc'
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b'
  }
});
