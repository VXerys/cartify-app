import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import { AppModal } from '../src/components/ui/AppModal';
import { IconSymbol, IconSymbolName } from '../src/components/ui/icon-symbol';
import { Layout } from '../src/constants/Layout';
import { deleteAllTransactions, getTransactionsWithItems } from '../src/services/db';
import { exportToCSV, exportToPDF } from '../src/services/pdfExportService';

const COLORS = Layout.colors;

type SecurityItemProps = {
    icon: IconSymbolName;
    label: string;
    description?: string;
    isSwitch?: boolean;
    value?: boolean;
    onToggle?: (value: boolean) => void;
    onPress?: () => void;
    isDestructive?: boolean;
    iconColor?: string;
};

const SecurityItem = ({ 
    icon, 
    label, 
    description, 
    isSwitch, 
    value, 
    onToggle, 
    onPress, 
    isDestructive,
    iconColor = COLORS.primary 
}: SecurityItemProps) => (
    <TouchableOpacity 
        style={styles.item} 
        onPress={onPress}
        disabled={isSwitch}
        activeOpacity={0.7}
    >
        <View style={[styles.iconContainer, { backgroundColor: isDestructive ? '#FEE2E2' : iconColor + '15' }]}>
            <IconSymbol name={icon} size={22} color={isDestructive ? COLORS.danger : iconColor} />
        </View>
        <View style={styles.itemContent}>
            <View style={styles.textContainer}>
                <Text style={[styles.itemLabel, isDestructive && { color: COLORS.danger }]}>{label}</Text>
                {description && <Text style={styles.itemDescription}>{description}</Text>}
            </View>
            
            {isSwitch ? (
                <Switch 
                    value={value} 
                    onValueChange={onToggle}
                    trackColor={{ false: '#767577', true: COLORS.primary }}
                    thumbColor={'#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                />
            ) : (
                 !isDestructive && <IconSymbol name="chevron.right" size={20} color={COLORS.subtext} />
            )}
        </View>
    </TouchableOpacity>
);

export default function SecurityPrivacyScreen() {
    const router = useRouter();
    const db = useSQLiteContext();
    
    // App Lock State (replacing biometric)
    const [appLockEnabled, setAppLockEnabled] = useState(false);
    const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    // Modal State
    const [modalVisible, setModalVisible] = useState<{
        type: 'clearHistory' | 'deleteAccount' | 'exportData' | 'appLock' | null,
        isOpen: boolean
    }>({ type: null, isOpen: false });
    
    // Export Options State
    const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf');
    const [includeAISummary, setIncludeAISummary] = useState(true);
    const [dateRange, setDateRange] = useState<'7days' | '30days' | 'all'>('all');
    
    // Stats for preview
    const [transactionCount, setTransactionCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // Toggle App Lock - shows modal to set PIN
    const handleAppLockToggle = (value: boolean) => {
        if (value) {
            // When enabling, show modal to set PIN
            setModalVisible({ type: 'appLock', isOpen: true });
        } else {
            // When disabling, just turn it off
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
        // Implement actual analytics preference logic here
    };

    // Load stats for export preview
    const loadExportStats = async () => {
        try {
            const transactions = await getTransactionsWithItems(db);
            const now = new Date();
            
            let filteredTx = transactions;
            if (dateRange === '7days') {
                const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filteredTx = transactions.filter(t => new Date(t.date) >= cutoff);
            } else if (dateRange === '30days') {
                const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                filteredTx = transactions.filter(t => new Date(t.date) >= cutoff);
            }
            
            setTransactionCount(filteredTx.length);
            setTotalAmount(filteredTx.reduce((sum, t) => sum + t.total_amount, 0));
        } catch (error) {
            console.error("Load stats error:", error);
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
            
            // Filter by date range
            let transactions = allTransactions;
            if (dateRange === '7days') {
                const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                transactions = allTransactions.filter(t => new Date(t.date) >= cutoff);
            } else if (dateRange === '30days') {
                const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                transactions = allTransactions.filter(t => new Date(t.date) >= cutoff);
            }
            
            if (transactions.length === 0) {
                toast.error("Tidak ada data transaksi untuk periode ini.");
                setModalVisible({ type: null, isOpen: false });
                setIsExporting(false);
                return;
            }

            let result;
            
            if (exportFormat === 'pdf') {
                // Export as PDF with optional AI summary
                result = await exportToPDF(transactions, { includeAISummary });
            } else {
                // Export as CSV
                result = await exportToCSV(transactions);
            }

            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error("Export error:", error);
            toast.error("Gagal mengekspor data.");
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
        // Mockup delete account
        setModalVisible({ type: null, isOpen: false });
        // Simulating logout/reset
        toast.success('Akun Anda telah dihapus');
        setTimeout(() => {
             router.replace('/'); 
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
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

            {/* --- Modals --- */}
            
            {/* Export Data Modal */}
            <AppModal
                visible={modalVisible.type === 'exportData' && modalVisible.isOpen}
                title="Ekspor Data"
                subtitle="Unduh riwayat transaksi belanja Anda."
                onClose={() => setModalVisible({ type: null, isOpen: false })}
                onSave={confirmExportData}
                saveLabel={isExporting ? "Memproses..." : "Ekspor"}
                variant="default"
                headerIcon={<IconSymbol name="arrow.down.doc.fill" size={32} color="#10B981" />}
            >
                <View style={styles.exportContent}>
                    {/* Stats Summary - Compact Horizontal */}
                    <View style={styles.statsSummary}>
                        <View style={styles.statBox}>
                            <IconSymbol name="doc.text.fill" size={16} color={COLORS.primary} />
                            <Text style={styles.statNumber}>{transactionCount}</Text>
                            <Text style={styles.statLabel}>transaksi</Text>
                        </View>
                        <View style={styles.statDot} />
                        <View style={styles.statBox}>
                            <IconSymbol name="banknote.fill" size={16} color={COLORS.primary} />
                            <Text style={styles.statNumber}>
                                {totalAmount >= 1000000 
                                    ? `${(totalAmount / 1000000).toFixed(1)}jt`
                                    : totalAmount >= 1000 
                                        ? `${(totalAmount / 1000).toFixed(0)}rb`
                                        : totalAmount.toString()
                                }
                            </Text>
                            <Text style={styles.statLabel}>total</Text>
                        </View>
                    </View>

                    {/* Period Selector - Pill Style */}
                    <View style={styles.exportSection}>
                        <Text style={styles.exportSectionTitle}>Periode</Text>
                        <View style={styles.periodSelector}>
                            {[
                                { key: '7days' as const, label: '7 Hari' },
                                { key: '30days' as const, label: '30 Hari' },
                                { key: 'all' as const, label: 'Semua' }
                            ].map((option, index) => (
                                <TouchableOpacity
                                    key={option.key}
                                    style={[
                                        styles.periodOption,
                                        dateRange === option.key && styles.periodOptionActive,
                                        index === 0 && styles.periodOptionFirst,
                                        index === 2 && styles.periodOptionLast,
                                    ]}
                                    onPress={async () => {
                                        setDateRange(option.key);
                                        const transactions = await getTransactionsWithItems(db);
                                        const now = new Date();
                                        let filtered = transactions;
                                        if (option.key === '7days') {
                                            const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                                            filtered = transactions.filter(t => new Date(t.date) >= cutoff);
                                        } else if (option.key === '30days') {
                                            const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                                            filtered = transactions.filter(t => new Date(t.date) >= cutoff);
                                        }
                                        setTransactionCount(filtered.length);
                                        setTotalAmount(filtered.reduce((sum, t) => sum + t.total_amount, 0));
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.periodOptionText,
                                        dateRange === option.key && styles.periodOptionTextActive
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Format Selector - Card Style */}
                    <View style={styles.exportSection}>
                        <Text style={styles.exportSectionTitle}>Format</Text>
                        <View style={styles.formatSelector}>
                            {/* PDF Option */}
                            <TouchableOpacity
                                style={[
                                    styles.formatCard,
                                    exportFormat === 'pdf' && styles.formatCardActive
                                ]}
                                onPress={() => setExportFormat('pdf')}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.formatIconBox,
                                    exportFormat === 'pdf' && styles.formatIconBoxActive
                                ]}>
                                    <IconSymbol 
                                        name="doc.richtext.fill" 
                                        size={20} 
                                        color={exportFormat === 'pdf' ? '#FFF' : COLORS.primary} 
                                    />
                                </View>
                                <View style={styles.formatInfo}>
                                    <Text style={[
                                        styles.formatTitle,
                                        exportFormat === 'pdf' && styles.formatTitleActive
                                    ]}>PDF</Text>
                                    <Text style={styles.formatDesc}>Laporan visual</Text>
                                </View>
                                <View style={[
                                    styles.formatRadio,
                                    exportFormat === 'pdf' && styles.formatRadioActive
                                ]}>
                                    {exportFormat === 'pdf' && (
                                        <View style={styles.formatRadioInner} />
                                    )}
                                </View>
                            </TouchableOpacity>

                            {/* CSV Option */}
                            <TouchableOpacity
                                style={[
                                    styles.formatCard,
                                    exportFormat === 'csv' && styles.formatCardActive
                                ]}
                                onPress={() => setExportFormat('csv')}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.formatIconBox,
                                    exportFormat === 'csv' && styles.formatIconBoxActive
                                ]}>
                                    <IconSymbol 
                                        name="tablecells.fill" 
                                        size={20} 
                                        color={exportFormat === 'csv' ? '#FFF' : COLORS.primary} 
                                    />
                                </View>
                                <View style={styles.formatInfo}>
                                    <Text style={[
                                        styles.formatTitle,
                                        exportFormat === 'csv' && styles.formatTitleActive
                                    ]}>CSV</Text>
                                    <Text style={styles.formatDesc}>Data Excel</Text>
                                </View>
                                <View style={[
                                    styles.formatRadio,
                                    exportFormat === 'csv' && styles.formatRadioActive
                                ]}>
                                    {exportFormat === 'csv' && (
                                        <View style={styles.formatRadioInner} />
                                    )}
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

            {/* Clear History Modal */}
            <AppModal
                visible={modalVisible.type === 'clearHistory' && modalVisible.isOpen}
                title="Hapus Riwayat?"
                subtitle="Semua data transaksi akan dihapus permanen dari perangkat ini. Tindakan ini tidak dapat dibatalkan."
                onClose={() => setModalVisible({ type: null, isOpen: false })}
                onSave={confirmClearHistory}
                saveLabel="Ya, Hapus Semua"
                variant="danger"
                headerIcon={<IconSymbol name="trash.fill" size={32} color={COLORS.danger} />}
            />

            {/* Delete Account Modal */}
            <AppModal
                 visible={modalVisible.type === 'deleteAccount' && modalVisible.isOpen}
                 title="Hapus Akun Permanen?"
                 subtitle="Akun Anda beserta seluruh data akan dihapus secara permanen. Anda tidak akan bisa memulihkannya kembali."
                 onClose={() => setModalVisible({ type: null, isOpen: false })}
                 onSave={confirmDeleteAccount}
                 saveLabel="Hapus Akun Saya"
                 variant="danger"
                 headerIcon={<IconSymbol name="xmark.circle.fill" size={32} color={COLORS.danger} />}
            />

            {/* App Lock Enable Modal */}
            <AppModal
                 visible={modalVisible.type === 'appLock' && modalVisible.isOpen}
                 title="Aktifkan Kunci Aplikasi"
                 subtitle="Lindungi data belanja Anda dengan mengaktifkan kunci aplikasi."
                 onClose={() => setModalVisible({ type: null, isOpen: false })}
                 onSave={confirmAppLockEnable}
                 saveLabel="Aktifkan Kunci"
                 variant="default"
                 headerIcon={<IconSymbol name="lock.fill" size={32} color={COLORS.primary} />}
            >
                <View style={styles.appLockInfo}>
                    <View style={styles.appLockFeature}>
                        <View style={styles.appLockFeatureIcon}>
                            <IconSymbol name="key.fill" size={18} color={COLORS.primary} />
                        </View>
                        <View style={styles.appLockFeatureText}>
                            <Text style={styles.appLockFeatureTitle}>PIN 4 Digit</Text>
                            <Text style={styles.appLockFeatureDesc}>
                                Gunakan PIN sederhana untuk akses cepat
                            </Text>
                        </View>
                    </View>
                    <View style={styles.appLockFeature}>
                        <View style={styles.appLockFeatureIcon}>
                            <IconSymbol name="shield.checkered" size={18} color={COLORS.primary} />
                        </View>
                        <View style={styles.appLockFeatureText}>
                            <Text style={styles.appLockFeatureTitle}>Perlindungan Data</Text>
                            <Text style={styles.appLockFeatureDesc}>
                                Riwayat belanja Anda tetap aman dari akses tidak sah
                            </Text>
                        </View>
                    </View>
                    <View style={styles.appLockNote}>
                        <IconSymbol name="info.circle.fill" size={16} color="#6B7280" />
                        <Text style={styles.appLockNoteText}>
                            Anda dapat menonaktifkan kunci kapan saja dari pengaturan ini.
                        </Text>
                    </View>
                </View>
            </AppModal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.background,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    headerSpacer: {
        width: 40,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    headerInfo: {
        alignItems: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    headerText: {
        marginTop: 12,
        fontSize: 14,
        color: COLORS.subtext,
        textAlign: 'center',
        lineHeight: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B7280',
        marginBottom: 10,
        marginLeft: 12,
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        marginRight: 12,
    },
    itemLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    itemDescription: {
        fontSize: 12,
        color: COLORS.subtext,
        lineHeight: 16,
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.border,
        marginLeft: 68,
    },
    // NEW Export Modal Styles - Clean & Responsive
    exportContent: {
        width: '100%',
        gap: 20,
    },
    // Stats Summary
    statsSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0FDF4',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        gap: 16,
    },
    statBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#166534',
    },
    statLabel: {
        fontSize: 13,
        color: '#15803D',
        fontWeight: '500',
    },
    statDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#86EFAC',
    },
    // Export Sections
    exportSection: {
        gap: 10,
    },
    exportSectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    // Period Selector - Connected Pills
    periodSelector: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        padding: 4,
    },
    periodOption: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    periodOptionFirst: {
        // Reserved for first item styling if needed
    },
    periodOptionLast: {
        // Reserved for last item styling if needed
    },
    periodOptionActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    periodOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    periodOptionTextActive: {
        color: COLORS.primary,
    },
    // Format Selector - Horizontal Cards
    formatSelector: {
        gap: 10,
    },
    formatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 14,
    },
    formatCardActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '08',
    },
    formatIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: COLORS.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    formatIconBoxActive: {
        backgroundColor: COLORS.primary,
    },
    formatInfo: {
        flex: 1,
    },
    formatTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
    },
    formatTitleActive: {
        color: COLORS.primary,
    },
    formatDesc: {
        fontSize: 12,
        color: COLORS.subtext,
        marginTop: 2,
    },
    formatRadio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formatRadioActive: {
        borderColor: COLORS.primary,
    },
    formatRadioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
    },
    // AI Option - Simple Row
    aiOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFBEB',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    aiOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    aiOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#92400E',
    },
    // App Lock Modal Styles
    appLockInfo: {
        width: '100%',
        gap: 16,
    },
    appLockFeature: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    appLockFeatureIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    appLockFeatureText: {
        flex: 1,
    },
    appLockFeatureTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    appLockFeatureDesc: {
        fontSize: 12,
        color: COLORS.subtext,
        lineHeight: 16,
    },
    appLockNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 12,
        gap: 10,
        marginTop: 4,
    },
    appLockNoteText: {
        flex: 1,
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
    },
});
