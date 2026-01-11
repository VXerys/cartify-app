import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Layout } from '@/src/constants/Layout';
import { deleteAllTransactions, getTransactionsWithItems } from '@/src/services/db';
import { exportToCSV, exportToPDF } from '@/src/services/pdfExportService';

import { ExportDataModal } from './security-privacy/ExportDataModal';
import { styles } from './security-privacy/security-privacy.styles';
import { DateRange, ExportFormat, ModalState } from './security-privacy/security-privacy.types';
import { SecurityItem } from './security-privacy/SecurityItem';
import { AppLockModal, ClearHistoryModal, DeleteAccountModal } from './security-privacy/SecurityModals';

const COLORS = Layout.colors;

export default function SecurityPrivacyScreen() {
  const router = useRouter();
  const db = useSQLiteContext();

  // App Lock State
  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState<ModalState>({ type: null, isOpen: false });

  // Export Options State
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [includeAISummary, setIncludeAISummary] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('all');

  // Stats for preview
  const [transactionCount, setTransactionCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Toggle App Lock
  const handleAppLockToggle = (value: boolean) => {
    if (value) {
      setModalVisible({ type: 'appLock', isOpen: true });
    } else {
      setAppLockEnabled(false);
      toast.success('Kunci aplikasi dinonaktifkan');
    }
  };

  const confirmAppLockEnable = () => {
    setAppLockEnabled(true);
    setModalVisible({ type: null, isOpen: false });
    toast.success('Kunci aplikasi diaktifkan');
  };

  const handleAnalyticsToggle = (value: boolean) => {
    setAnalyticsEnabled(value);
  };

  // Load stats for export preview
  const loadExportStats = async () => {
    try {
      const transactions = await getTransactionsWithItems(db);
      const now = new Date();

      let filteredTx = transactions;
      if (dateRange === '7days') {
        const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredTx = transactions.filter((t) => new Date(t.date) >= cutoff);
      } else if (dateRange === '30days') {
        const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredTx = transactions.filter((t) => new Date(t.date) >= cutoff);
      }

      setTransactionCount(filteredTx.length);
      setTotalAmount(filteredTx.reduce((sum, t) => sum + t.total_amount, 0));
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  const handleExportData = async () => {
    await loadExportStats();
    setModalVisible({ type: 'exportData', isOpen: true });
  };

  const handleClearHistory = () => {
    setModalVisible({ type: 'clearHistory', isOpen: true });
  };

  const handleDeleteAccount = () => {
    setModalVisible({ type: 'deleteAccount', isOpen: true });
  };

  const confirmExportData = async () => {
    setIsExporting(true);
    try {
      const allTransactions = await getTransactionsWithItems(db);
      const now = new Date();

      let transactions = allTransactions;
      if (dateRange === '7days') {
        const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        transactions = allTransactions.filter((t) => new Date(t.date) >= cutoff);
      } else if (dateRange === '30days') {
        const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        transactions = allTransactions.filter((t) => new Date(t.date) >= cutoff);
      }

      if (transactions.length === 0) {
        toast.error('Tidak ada data transaksi untuk periode ini.');
        setModalVisible({ type: null, isOpen: false });
        setIsExporting(false);
        return;
      }

      let result;
      if (exportFormat === 'pdf') {
        result = await exportToPDF(transactions, { includeAISummary });
      } else {
        result = await exportToCSV(transactions);
      }

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Gagal mengekspor data.');
    } finally {
      setIsExporting(false);
      setModalVisible({ type: null, isOpen: false });
    }
  };

  const confirmClearHistory = async () => {
    try {
      await deleteAllTransactions(db);
      setModalVisible({ type: null, isOpen: false });
      toast.success('Riwayat transaksi berhasil dihapus');
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus riwayat');
    }
  };

  const confirmDeleteAccount = () => {
    setModalVisible({ type: null, isOpen: false });
    toast.success('Akun Anda telah dihapus');
    setTimeout(() => {
      router.replace('/');
    }, 1000);
  };

  const closeModal = () => setModalVisible({ type: null, isOpen: false });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <IconSymbol name="chevron.left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Keamanan & Privasi</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerInfo}>
          <IconSymbol name="shield.fill" size={48} color={COLORS.primary} style={{ opacity: 0.8 }} />
          <Text style={styles.headerText}>
            Kelola keamanan akun dan preferensi privasi Anda di sini.
          </Text>
        </View>

        {/* Section: Keamanan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>KEAMANAN APLIKASI</Text>
          <View style={styles.card}>
            <SecurityItem
              icon="lock.fill"
              label="Kunci Aplikasi"
              description="Aktifkan PIN untuk melindungi akses ke aplikasi Anda."
              isSwitch
              value={appLockEnabled}
              onToggle={handleAppLockToggle}
            />
          </View>
        </View>

        {/* Section: Privasi & Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA & PRIVASI</Text>
          <View style={styles.card}>
            <SecurityItem
              icon="chart.bar.xaxis"
              label="Bagikan Analitik"
              description="Bantu kami meningkatkan aplikasi dengan data penggunaan anonim."
              isSwitch
              value={analyticsEnabled}
              onToggle={handleAnalyticsToggle}
              iconColor="#3B82F6"
            />
            <View style={styles.separator} />
            <SecurityItem
              icon="arrow.down.doc.fill"
              label="Unduh Data Saya"
              description="Ekspor riwayat transaksi ke PDF atau CSV dengan filter periode."
              onPress={handleExportData}
              iconColor="#10B981"
            />
          </View>
        </View>

        {/* Section: Zona Bahaya */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ZONA BAHAYA</Text>
          <View style={[styles.card, { borderColor: COLORS.danger + '30', borderWidth: 1 }]}>
            <SecurityItem
              icon="trash.fill"
              label="Hapus Riwayat Transaksi"
              isDestructive
              onPress={handleClearHistory}
            />
            <View style={styles.separator} />
            <SecurityItem
              icon="xmark.circle.fill"
              label="Hapus Akun Permanen"
              isDestructive
              onPress={handleDeleteAccount}
            />
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <ExportDataModal
        visible={modalVisible.type === 'exportData' && modalVisible.isOpen}
        onClose={closeModal}
        onExport={confirmExportData}
        isExporting={isExporting}
        transactionCount={transactionCount}
        totalAmount={totalAmount}
        dateRange={dateRange}
        setDateRange={setDateRange}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        includeAISummary={includeAISummary}
        setIncludeAISummary={setIncludeAISummary}
        setTransactionCount={setTransactionCount}
        setTotalAmount={setTotalAmount}
        db={db}
      />

      <ClearHistoryModal
        visible={modalVisible.type === 'clearHistory' && modalVisible.isOpen}
        onClose={closeModal}
        onConfirm={confirmClearHistory}
      />

      <DeleteAccountModal
        visible={modalVisible.type === 'deleteAccount' && modalVisible.isOpen}
        onClose={closeModal}
        onConfirm={confirmDeleteAccount}
      />

      <AppLockModal
        visible={modalVisible.type === 'appLock' && modalVisible.isOpen}
        onClose={closeModal}
        onConfirm={confirmAppLockEnable}
      />
    </SafeAreaView>
  );
}
