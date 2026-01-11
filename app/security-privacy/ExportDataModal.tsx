import { AppModal } from '@/src/components/ui/AppModal';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Layout } from '@/src/constants/Layout';
import { getTransactionsWithItems } from '@/src/services/db';
import { SQLiteDatabase } from 'expo-sqlite';
import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './security-privacy.styles';
import { DATE_RANGE_OPTIONS, DateRange, ExportFormat } from './security-privacy.types';

const COLORS = Layout.colors;

interface ExportDataModalProps {
  visible: boolean;
  onClose: () => void;
  onExport: () => void;
  isExporting: boolean;
  transactionCount: number;
  totalAmount: number;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  includeAISummary: boolean;
  setIncludeAISummary: (value: boolean) => void;
  setTransactionCount: (count: number) => void;
  setTotalAmount: (amount: number) => void;
  db: SQLiteDatabase;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({
  visible,
  onClose,
  onExport,
  isExporting,
  transactionCount,
  totalAmount,
  dateRange,
  setDateRange,
  exportFormat,
  setExportFormat,
  includeAISummary,
  setIncludeAISummary,
  setTransactionCount,
  setTotalAmount,
  db,
}) => {
  const handleDateRangeChange = async (key: DateRange) => {
    setDateRange(key);
    const transactions = await getTransactionsWithItems(db);
    const now = new Date();
    let filtered = transactions;
    if (key === '7days') {
      const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = transactions.filter((t) => new Date(t.date) >= cutoff);
    } else if (key === '30days') {
      const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = transactions.filter((t) => new Date(t.date) >= cutoff);
    }
    setTransactionCount(filtered.length);
    setTotalAmount(filtered.reduce((sum, t) => sum + t.total_amount, 0));
  };

  const formatTotalAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}jt`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}rb`;
    }
    return amount.toString();
  };

  return (
    <AppModal
      visible={visible}
      title="Ekspor Data"
      subtitle="Unduh riwayat transaksi belanja Anda."
      onClose={onClose}
      onSave={onExport}
      saveLabel={isExporting ? 'Memproses...' : 'Ekspor'}
      variant="default"
      headerIcon={<IconSymbol name="arrow.down.doc.fill" size={32} color="#10B981" />}
    >
      <View style={styles.exportContent}>
        {/* Stats Summary */}
        <View style={styles.statsSummary}>
          <View style={styles.statBox}>
            <IconSymbol name="doc.text.fill" size={16} color={COLORS.primary} />
            <Text style={styles.statNumber}>{transactionCount}</Text>
            <Text style={styles.statLabel}>transaksi</Text>
          </View>
          <View style={styles.statDot} />
          <View style={styles.statBox}>
            <IconSymbol name="banknote.fill" size={16} color={COLORS.primary} />
            <Text style={styles.statNumber}>{formatTotalAmount(totalAmount)}</Text>
            <Text style={styles.statLabel}>total</Text>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.exportSection}>
          <Text style={styles.exportSectionTitle}>Periode</Text>
          <View style={styles.periodSelector}>
            {DATE_RANGE_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.periodOption,
                  dateRange === option.key && styles.periodOptionActive,
                  index === 0 && styles.periodOptionFirst,
                  index === 2 && styles.periodOptionLast,
                ]}
                onPress={() => handleDateRangeChange(option.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.periodOptionText,
                    dateRange === option.key && styles.periodOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Format Selector */}
        <View style={styles.exportSection}>
          <Text style={styles.exportSectionTitle}>Format</Text>
          <View style={styles.formatSelector}>
            {/* PDF Option */}
            <TouchableOpacity
              style={[styles.formatCard, exportFormat === 'pdf' && styles.formatCardActive]}
              onPress={() => setExportFormat('pdf')}
              activeOpacity={0.7}
            >
              <View style={[styles.formatIconBox, exportFormat === 'pdf' && styles.formatIconBoxActive]}>
                <IconSymbol
                  name="doc.richtext.fill"
                  size={20}
                  color={exportFormat === 'pdf' ? '#FFF' : COLORS.primary}
                />
              </View>
              <View style={styles.formatInfo}>
                <Text style={[styles.formatTitle, exportFormat === 'pdf' && styles.formatTitleActive]}>
                  PDF
                </Text>
                <Text style={styles.formatDesc}>Laporan visual</Text>
              </View>
              <View style={[styles.formatRadio, exportFormat === 'pdf' && styles.formatRadioActive]}>
                {exportFormat === 'pdf' && <View style={styles.formatRadioInner} />}
              </View>
            </TouchableOpacity>

            {/* CSV Option */}
            <TouchableOpacity
              style={[styles.formatCard, exportFormat === 'csv' && styles.formatCardActive]}
              onPress={() => setExportFormat('csv')}
              activeOpacity={0.7}
            >
              <View style={[styles.formatIconBox, exportFormat === 'csv' && styles.formatIconBoxActive]}>
                <IconSymbol
                  name="tablecells.fill"
                  size={20}
                  color={exportFormat === 'csv' ? '#FFF' : COLORS.primary}
                />
              </View>
              <View style={styles.formatInfo}>
                <Text style={[styles.formatTitle, exportFormat === 'csv' && styles.formatTitleActive]}>
                  CSV
                </Text>
                <Text style={styles.formatDesc}>Data Excel</Text>
              </View>
              <View style={[styles.formatRadio, exportFormat === 'csv' && styles.formatRadioActive]}>
                {exportFormat === 'csv' && <View style={styles.formatRadioInner} />}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Toggle - Only for PDF */}
        {exportFormat === 'pdf' && (
          <TouchableOpacity
            style={styles.aiOption}
            onPress={() => setIncludeAISummary(!includeAISummary)}
            activeOpacity={0.7}
          >
            <View style={styles.aiOptionLeft}>
              <IconSymbol name="sparkles" size={18} color="#F59E0B" />
              <Text style={styles.aiOptionText}>Sertakan Analisis AI</Text>
            </View>
            <Switch
              value={includeAISummary}
              onValueChange={setIncludeAISummary}
              trackColor={{ false: '#E5E7EB', true: COLORS.primary }}
              thumbColor={'#ffffff'}
              ios_backgroundColor="#E5E7EB"
            />
          </TouchableOpacity>
        )}
      </View>
    </AppModal>
  );
};
