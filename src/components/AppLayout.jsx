import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet
} from 'react-native';
import { Settings, History } from 'lucide-react-native';

export default function AppLayout({
  children,
  activeTab,
  onNavigate,
  onOpenHistory,
  theme = 'light'
}) {
  const isDark = theme === 'dark';
  const isNormal = theme === 'normal';

  const bgColor = isDark
    ? '#090d16'
    : isNormal
    ? '#0f172a'
    : '#f1f5f9';

  const headerBg = isDark
    ? '#131c2e'
    : isNormal
    ? '#1e293b'
    : '#ffffff';

  const textColor = isDark || isNormal ? '#ffffff' : '#0f172a';
  const subColor = isDark || isNormal ? '#38bdf8' : '#2563eb';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar
        barStyle={isDark || isNormal ? 'light-content' : 'dark-content'}
        backgroundColor={bgColor}
      />

      {/* Main Responsive Wrapper */}
      <View style={styles.content}>
        {/* Header Bar */}
        <View style={[styles.header, { backgroundColor: headerBg }]}>
          <View style={styles.titleRow}>
            <View style={styles.dot} />
            <Text style={[styles.title, { color: textColor }]}>
              Smart Calculator{' '}
              <Text style={[styles.subtitle, { color: subColor }]}>with History</Text>
            </Text>
          </View>

          {activeTab === 'calculator' && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={onOpenHistory}
                style={styles.iconBtn}
                activeOpacity={0.7}
              >
                <History size={20} color={textColor} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onNavigate('settings')}
                style={styles.iconBtn}
                activeOpacity={0.7}
              >
                <Settings size={20} color={textColor} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Main Content Area */}
        <View style={styles.body}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb'
  },
  title: {
    fontSize: 15,
    fontWeight: '800'
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '600'
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  iconBtn: {
    padding: 6,
    borderRadius: 10
  },
  body: {
    flex: 1
  }
});
