import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { X, Crown, Check, ShieldCheck } from 'lucide-react-native';

export default function PremiumUpgradeModal({
  isOpen,
  onClose,
  isPremium,
  onActivatePremium
}) {
  const [selectedPlan, setSelectedPlan] = useState('lifetime');

  if (!isOpen) return null;

  const handlePurchase = () => {
    onActivatePremium(selectedPlan);
    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <Crown size={22} color="#eab308" />
              <Text style={styles.modalTitle}>Smart Calculator Premium</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea}>
            <View style={styles.featureList}>
              {[
                'Tanpa Iklan Selamanya (Ad-Free Experience)',
                'Simpan Riwayat Tanpa Batas Jumlah Baris',
                'Ekspor Teks & Berbagi Riwayat Lanjutan',
                'Verifikasi Resi Pembelian Backend PHP'
              ].map((feat, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <ShieldCheck size={16} color="#16a34a" />
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}
            </View>

            <View style={styles.plansContainer}>
              <TouchableOpacity
                onPress={() => setSelectedPlan('lifetime')}
                activeOpacity={0.8}
                style={[
                  styles.planCard,
                  selectedPlan === 'lifetime' && styles.planCardActive
                ]}
              >
                <View style={styles.planBadge}>
                  <Text style={styles.badgeText}>PALING POPULER</Text>
                </View>
                <Text style={styles.planTitle}>Sekali Bayar (Lifetime Access)</Text>
                <Text style={styles.planPrice}>Rp 49.000</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedPlan('subscription')}
                activeOpacity={0.8}
                style={[
                  styles.planCard,
                  selectedPlan === 'subscription' && styles.planCardActive
                ]}
              >
                <Text style={styles.planTitle}>Langganan Bulanan</Text>
                <Text style={styles.planPrice}>Rp 9.000 / bulan</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <TouchableOpacity onPress={handlePurchase} style={styles.buyBtn}>
            <Text style={styles.buyText}>
              {isPremium ? 'Status Premium Aktif ⭐' : 'Aktifkan Fitur Premium Sekarang'}
            </Text>
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
    justifyContent: 'flex-end'
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: '85%'
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
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a'
  },
  closeBtn: {
    padding: 4
  },
  scrollArea: {
    maxHeight: 320
  },
  featureList: {
    gap: 8,
    marginBottom: 14,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 14
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155'
  },
  plansContainer: {
    gap: 10
  },
  planCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff'
  },
  planCardActive: {
    borderColor: '#eab308',
    backgroundColor: '#fefce8'
  },
  planBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef08a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#854d0e'
  },
  planTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b'
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ca8a04',
    marginTop: 2
  },
  buyBtn: {
    backgroundColor: '#eab308',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14
  },
  buyText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a'
  }
});
