import React, { useState, useEffect, Component } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import AppLayout from './components/AppLayout';
import Calculator from './components/Calculator';
import SettingsPage from './components/SettingsPage';
import CustomKeyDialog from './components/CustomKeyDialog';
import SheetSettingsModal from './components/SheetSettingsModal';
import HelpDialog from './components/HelpDialog';
import HistorySheetModal from './components/HistorySheetModal';
import MenuModal from './components/MenuModal';
import ConvertToTextModal from './components/ConvertToTextModal';
import PremiumUpgradeModal from './components/PremiumUpgradeModal';

import {
  loadSettings,
  saveSettings,
  loadHistory,
  saveHistory,
  loadTapeRows,
  saveTapeRows
} from './storage/settingsStorage';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Smart Calculator</Text>
          <Text style={styles.errorSub}>Terjadi kendala pada tampilan aplikasi.</Text>
          <Text style={styles.errorDetail}>
            {String(this.state.error?.message || 'Unknown Error')}
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.retryText}>Muat Ulang Aplikasi</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [settings, setSettings] = useState(() => loadSettings());
  const [history, setHistory] = useState(() => loadHistory());
  const [tapeRows, setTapeRows] = useState(() => loadTapeRows());

  useEffect(() => {
    saveTapeRows(tapeRows);
  }, [tapeRows]);

  const [isPremium, setIsPremium] = useState(false);

  const [calcState, setCalcState] = useState({
    displayValue: '260',
    formula: '130 × 2 =',
    isNewInput: true,
    lastOperator: null,
    history: history,
    isError: false
  });

  const [activeTab, setActiveTab] = useState('calculator');

  const [isCustomKeyDialogOpen, setIsCustomKeyDialogOpen] = useState(false);
  const [isSheetSettingsOpen, setIsSheetSettingsOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConvertToTextOpen, setIsConvertToTextOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isButtonsHidden, setIsButtonsHidden] = useState(false);

  const handleUpdateSettings = (newPartialSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartialSettings };
      saveSettings(updated);
      return updated;
    });
  };

  const handleActivatePremium = (planType) => {
    setIsPremium(true);
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([]);
    setTapeRows([]);
    setCalcState((prev) => ({ ...prev, history: [] }));
  };

  const handleSelectHistoryResult = (resValue) => {
    setCalcState((prev) => ({
      ...prev,
      displayValue: String(resValue),
      isNewInput: true
    }));
  };

  return (
    <ErrorBoundary>
      <AppLayout
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onOpenHistory={() => setIsHistorySheetOpen(true)}
        theme={settings.theme}
      >
        {activeTab === 'calculator' ? (
          <Calculator
            calcState={calcState}
            setCalcState={setCalcState}
            settings={settings}
            tapeRows={tapeRows}
            setTapeRows={setTapeRows}
            onOpenHistory={() => setIsHistorySheetOpen(true)}
            onOpenMenu={() => setIsMenuOpen(true)}
            isButtonsHidden={isButtonsHidden}
          />
        ) : (
          <SettingsPage
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onBackToCalculator={() => setActiveTab('calculator')}
            onOpenCustomKeyDialog={() => setIsCustomKeyDialogOpen(true)}
            onOpenSheetSettings={() => setIsSheetSettingsOpen(true)}
            onOpenHelpDialog={() => setIsHelpDialogOpen(true)}
          />
        )}

        <CustomKeyDialog
          isOpen={isCustomKeyDialogOpen}
          onClose={() => setIsCustomKeyDialogOpen(false)}
          currentSelected={settings.selectedExtraKeys}
          onSave={(keys) => handleUpdateSettings({ selectedExtraKeys: keys })}
        />

        <SheetSettingsModal
          isOpen={isSheetSettingsOpen}
          onClose={() => setIsSheetSettingsOpen(false)}
          paperConfig={settings.paperSheetConfig}
          onSave={(cfg) => handleUpdateSettings({ paperSheetConfig: cfg })}
        />

        <HelpDialog
          isOpen={isHelpDialogOpen}
          onClose={() => setIsHelpDialogOpen(false)}
        />

        <HistorySheetModal
          isOpen={isHistorySheetOpen}
          onClose={() => setIsHistorySheetOpen(false)}
          history={history}
          onClearHistory={handleClearHistory}
          onSelectResult={handleSelectHistoryResult}
        />

        <MenuModal
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onToggleHideButtons={() => setIsButtonsHidden(!isButtonsHidden)}
          isButtonsHidden={isButtonsHidden}
          onConvertToText={() => setIsConvertToTextOpen(true)}
          onOpenSettings={() => setActiveTab('settings')}
          onOpenUpgrade={() => setIsPremiumModalOpen(true)}
          isPremium={isPremium}
        />

        <ConvertToTextModal
          isOpen={isConvertToTextOpen}
          onClose={() => setIsConvertToTextOpen(false)}
          tapeRows={tapeRows}
        />

        <PremiumUpgradeModal
          isOpen={isPremiumModalOpen}
          onClose={() => setIsPremiumModalOpen(false)}
          isPremium={isPremium}
          onActivatePremium={handleActivatePremium}
        />
      </AppLayout>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#38bdf8',
    marginBottom: 8
  },
  errorSub: {
    fontSize: 14,
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 16
  },
  errorDetail: {
    fontSize: 12,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'monospace'
  },
  retryBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14
  }
});
