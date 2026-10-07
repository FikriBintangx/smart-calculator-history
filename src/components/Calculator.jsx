import React, { useState } from 'react';
import { View, StyleSheet, ToastAndroid, Platform } from 'react-native';
import TapeDisplay from './TapeDisplay';
import CalculatorDisplay from './CalculatorDisplay';
import Keypad from './Keypad';
import {
  processButtonInput,
  recalculateTape,
  editTapeRow,
  insertTapeRow,
  deleteTapeRow
} from '../logic/calculatorEngine';
import { playKeySound } from '../audio/soundEffects';
import { triggerVibration } from '../vibration/haptics';

export default function Calculator({
  calcState,
  setCalcState,
  settings,
  tapeRows,
  setTapeRows,
  onOpenHistory,
  onOpenMenu,
  onShowToast,
  isButtonsHidden
}) {
  const { displayValue, formula, lastOperator, isError } = calcState;
  const { vibrationEnabled, soundEnabled, soundVolume, theme, selectedExtraKeys, paperSheetConfig } = settings;

  const [selectedRowId, setSelectedRowId] = useState(null);

  const showToastMsg = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
    if (onShowToast) onShowToast(msg);
  };

  const syncTapeOnEquals = (newNum, operatorStr) => {
    const val = parseFloat(newNum);
    if (isNaN(val)) return;

    setTapeRows((prevRows) => {
      let newRow;
      if (!prevRows || prevRows.length === 0) {
        newRow = {
          id: `tape-${Date.now()}-0`,
          operator: '',
          value: val
        };
      } else {
        newRow = {
          id: `tape-${Date.now()}-${prevRows.length}`,
          operator: operatorStr || '+',
          value: val
        };
      }
      const updated = [...prevRows, newRow];
      return recalculateTape(updated);
    });
  };

  const handleKeyPress = (buttonKey, keyType = 'number') => {
    playKeySound(keyType, soundEnabled, soundVolume);
    triggerVibration(vibrationEnabled, 20);

    setCalcState((prevState) => {
      const nextState = processButtonInput(prevState, buttonKey);

      if (buttonKey === '=' && nextState.displayValue !== 'Error') {
        const valNum = parseFloat(nextState.displayValue);
        if (!isNaN(valNum)) {
          const op = prevState.lastOperator || '+';
          syncTapeOnEquals(valNum, op);
        }
      }

      return nextState;
    });
  };

  const handleSelectRow = (rowId) => {
    setSelectedRowId(rowId);
    const targetRow = tapeRows.find((r) => r.id === rowId);
    if (targetRow) {
      setCalcState((prev) => ({
        ...prev,
        displayValue: String(targetRow.value),
        isNewInput: true
      }));
      showToastMsg(`Baris #${tapeRows.findIndex((r) => r.id === rowId) + 1} dipilih`);
    }
  };

  const handleEditRow = (rowId, updatedFields) => {
    setTapeRows((prevRows) => {
      const recalculated = editTapeRow(prevRows, rowId, updatedFields);
      const lastRow = recalculated[recalculated.length - 1];
      if (lastRow) {
        setCalcState((prev) => ({
          ...prev,
          displayValue: String(lastRow.result),
          isNewInput: true
        }));
      }
      return recalculated;
    });
    showToastMsg('Baris diperbarui & hasil dihitung ulang!');
  };

  const handleInsertRow = (afterIndex) => {
    setTapeRows((prevRows) => {
      return insertTapeRow(prevRows, afterIndex, { operator: '+', value: 0 });
    });
    showToastMsg('Baris baru disisipkan!');
  };

  const handleDeleteRow = (rowId) => {
    setTapeRows((prevRows) => {
      const recalculated = deleteTapeRow(prevRows, rowId);
      const lastRow = recalculated[recalculated.length - 1];
      if (lastRow) {
        setCalcState((prev) => ({
          ...prev,
          displayValue: String(lastRow.result),
          isNewInput: true
        }));
      } else {
        setCalcState((prev) => ({ ...prev, displayValue: '0' }));
      }
      return recalculated;
    });
    setSelectedRowId(null);
    showToastMsg('Baris dihapus!');
  };

  const handleCopyDisplay = () => {
    showToastMsg(`Hasil '${displayValue}' tersalin!`);
  };

  return (
    <View style={styles.container}>
      <TapeDisplay
        tapeRows={tapeRows}
        selectedRowId={selectedRowId}
        onSelectRow={handleSelectRow}
        onEditRow={handleEditRow}
        onInsertRow={handleInsertRow}
        onDeleteRow={handleDeleteRow}
        theme={theme}
      />

      <CalculatorDisplay
        displayValue={displayValue}
        formula={formula}
        isError={isError}
        showSolarPanel={paperSheetConfig?.showSolarPanel}
        showMiniHistory={paperSheetConfig?.showMiniHistory}
        decimalMode={paperSheetConfig?.decimalMode || 'AUTO'}
        theme={theme}
        onOpenHistory={onOpenHistory}
      />

      <Keypad
        onKeyPress={handleKeyPress}
        onOpenMenu={onOpenMenu}
        onCopyDisplay={handleCopyDisplay}
        activeOperator={lastOperator}
        selectedExtraKeys={selectedExtraKeys}
        isButtonsHidden={isButtonsHidden}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  }
});
