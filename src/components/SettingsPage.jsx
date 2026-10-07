import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet
} from 'react-native';
import {
  ArrowLeft,
  Vibrate,
  Volume2,
  Palette,
  FileText,
  Sliders,
  HelpCircle,
  ChevronRight
} from 'lucide-react-native';

export default function SettingsPage({
  settings,
  onUpdateSettings,
  onBackToCalculator,
  onOpenCustomKeyDialog,
  onOpenSheetSettings,
  onOpenHelpDialog
}) {
  const isDark = settings.theme === 'dark' || settings.theme === 'normal';

  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <TouchableOpacity onPress={onBackToCalculator} style={styles.backBtn}>
          <ArrowLeft size={20} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Pengaturan</Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Section 1: Haptic & Audio */}
        <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor }]}>
          <Text style={styles.sectionTitle}>EFEK & UMPAN BALIK</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <View style={styles.iconTitleRow}>
                <Vibrate size={18} color="#2563eb" />
                <Text style={[styles.settingLabel, { color: textColor }]}>Getaran (Haptik)</Text>
              </View>
              <Text style={[styles.settingSub, { color: subTextColor }]}>
                Getar saat menekan tombol keypad
              </Text>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(val) => onUpdateSettings({ vibrationEnabled: val })}
              trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
              thumbColor={settings.vibrationEnabled ? '#2563eb' : '#f8fafc'}
            />
          </View>

          <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: borderColor }]}>
            <View style={styles.settingTextGroup}>
              <View style={styles.iconTitleRow}>
                <Volume2 size={18} color="#2563eb" />
                <Text style={[styles.settingLabel, { color: textColor }]}>Efek Suara</Text>
              </View>
              <Text style={[styles.settingSub, { color: subTextColor }]}>
                Bunyi klik saat tombol ditekan
              </Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(val) => onUpdateSettings({ soundEnabled: val })}
              trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
              thumbColor={settings.soundEnabled ? '#2563eb' : '#f8fafc'}
            />
          </View>
        </View>

        {/* Section 2: Theme Selector */}
        <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor }]}>
          <Text style={styles.sectionTitle}>TEMA TAMPILAN</Text>
          <View style={styles.themeOptionsRow}>
            {[
              { key: 'light', label: 'Terang (Light)', bg: '#f8fafc', border: '#cbd5e1' },
              { key: 'normal', label: 'Navy Blue', bg: '#0f172a', border: '#3b82f6' },
              { key: 'dark', label: 'Gelap (Dark)', bg: '#020617', border: '#475569' }
            ].map((th) => (
              <TouchableOpacity
                key={th.key}
                onPress={() => onUpdateSettings({ theme: th.key })}
                style={[
                  styles.themeChip,
                  { backgroundColor: th.bg, borderColor: th.border },
                  settings.theme === th.key && styles.themeChipActive
                ]}
              >
                <Text
                  style={[
                    styles.themeChipText,
                    { color: th.key === 'light' ? '#0f172a' : '#ffffff' }
                  ]}
                >
                  {th.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section 3: Customization */}
        <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor }]}>
          <Text style={styles.sectionTitle}>KUSTOMISASI TOMBOL & PITA</Text>

          <TouchableOpacity
            onPress={onOpenCustomKeyDialog}
            style={styles.menuItemRow}
          >
            <View style={styles.iconTitleRow}>
              <Sliders size={18} color="#2563eb" />
              <View>
                <Text style={[styles.settingLabel, { color: textColor }]}>Kustomisasi Tombol Ekstra</Text>
                <Text style={[styles.settingSub, { color: subTextColor }]}>Pilih %, √, ±, 00, M+, M-</Text>
              </View>
            </View>
            <ChevronRight size={18} color={subTextColor} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onOpenSheetSettings}
            style={[styles.menuItemRow, { borderTopWidth: 1, borderTopColor: borderColor }]}
          >
            <View style={styles.iconTitleRow}>
              <FileText size={18} color="#2563eb" />
              <View>
                <Text style={[styles.settingLabel, { color: textColor }]}>Pengaturan Lembar Riwayat</Text>
                <Text style={[styles.settingSub, { color: subTextColor }]}>Panel surya, desimal, batas baris</Text>
              </View>
            </View>
            <ChevronRight size={18} color={subTextColor} />
          </TouchableOpacity>
        </View>

        {/* Section 4: Help & Info */}
        <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor }]}>
          <TouchableOpacity onPress={onOpenHelpDialog} style={styles.menuItemRow}>
            <View style={styles.iconTitleRow}>
              <HelpCircle size={18} color="#2563eb" />
              <Text style={[styles.settingLabel, { color: textColor }]}>Panduan Penggunaan & Bantuan</Text>
            </View>
            <ChevronRight size={18} color={subTextColor} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 10,
    gap: 12
  },
  backBtn: {
    padding: 6
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  scrollArea: {
    flex: 1
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 20
  },
  sectionCard: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563eb',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  settingTextGroup: {
    flex: 1,
    paddingRight: 10
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700'
  },
  settingSub: {
    fontSize: 11,
    marginTop: 2
  },
  themeOptionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4
  },
  themeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center'
  },
  themeChipActive: {
    borderColor: '#2563eb',
    borderWidth: 2.5
  },
  themeChipText: {
    fontSize: 11,
    fontWeight: '700'
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10
  }
});
