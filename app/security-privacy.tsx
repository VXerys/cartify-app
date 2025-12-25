import * as FileSystem from 'expo-file-system';
import { Stack, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import { AppModal } from '../src/components/ui/AppModal';
import { IconSymbol, IconSymbolName } from '../src/components/ui/icon-symbol';
import { Layout } from '../src/constants/Layout';
import { deleteAllTransactions, getTransactionsWithItems } from '../src/services/db';

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
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    // Modal State
    const [modalVisible, setModalVisible] = useState<{
        type: 'clearHistory' | 'deleteAccount' | 'exportData' | null,
        isOpen: boolean
    }>({ type: null, isOpen: false });

    const handleBiometricToggle = (value: boolean) => {
        setBiometricEnabled(value);
        // Implement actual biometric logic here
    };

    const handleAnalyticsToggle = (value: boolean) => {
        setAnalyticsEnabled(value);
        // Implement actual analytics preference logic here
    };

    const handleExportData = () => {
        setModalVisible({ type: 'exportData', isOpen: true });
    };

    const handleClearHistory = () => {
        setModalVisible({ type: 'clearHistory', isOpen: true });
    };

    const handleDeleteAccount = () => {
        setModalVisible({ type: 'deleteAccount', isOpen: true });
    };

    const confirmExportData = async () => {
        // Validation: Check if Native Modules are available

        if (!FileSystem.documentDirectory) {
            Alert.alert(
                "Diperlukan Pembaruan Aplikasi",
                "Fitur ini memerlukan modul tambahan (konfigurasi native) yang baru saja ditambahkan. Mohon lakukan rebuild aplikasi (dev client) atau jalankan 'npx expo run:android' untuk menggunakannya."
            );
            setModalVisible({ type: null, isOpen: false });
            return;
        }

        setIsExporting(true);
        try {
            const transactions = await getTransactionsWithItems(db);
            
            if (transactions.length === 0) {
                toast.error("Tidak ada data transaksi untuk diekspor.");
                setModalVisible({ type: null, isOpen: false });
                setIsExporting(false);
                return;
            }

            // Create CSV content
            let csvContent = "ID,Tanggal,Total,Catatan,Item,Harga Satuan,Jumlah,Satuan,Kategori,Total Harga Item\n";
            
            transactions.forEach(t => {
                if (t.items && t.items.length > 0) {
                    t.items.forEach(item => {
                        const row = [
                            t.id,
                            `"${t.date}"`,
                            t.total_amount,
                            `"${t.note || ''}"`,
                            `"${item.item_name}"`,
                            item.item_price,
                            item.quantity,
                            `"${item.unit || ''}"`,
                            `"${item.category}"`,
                            item.total_price
                        ].join(",");
                        csvContent += row + "\n";
                    });
                } else {
                     // Transaction without items
                     const row = [
                        t.id,
                        `"${t.date}"`,
                        t.total_amount,
                        `"${t.note || ''}"`,
                        "-",0,0,"-","-",0
                    ].join(",");
                    csvContent += row + "\n";
                }
            });

            const fileName = `Cartify_Export_${new Date().toISOString().split('T')[0]}.csv`;
            const fileUri = FileSystem.documentDirectory + fileName;

            await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
                toast.success("Data berhasil diekspor!");
            } else {
                toast.error("Fitur berbagi tidak tersedia di perangkat ini.");
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
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{ 
                headerTitle: 'Keamanan & Privasi', 
                headerStyle: { backgroundColor: COLORS.background },
                headerTintColor: COLORS.text,
                headerShadowVisible: false,
            }} />
            
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
                            icon="faceid" 
                            label="Biometrik / Face ID" 
                            description="Gunakan wajah atau sidik jari untuk membuka aplikasi."
                            isSwitch
                            value={biometricEnabled}
                            onToggle={handleBiometricToggle}
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
                            description="Minta salinan riwayat transaksi Anda dalam format CSV (Excel)."
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
                title="Unduh Data?"
                subtitle="Data riwayat transaksi Anda akan dikonversi menjadi file CSV yang bisa dibuka di Excel. Apakah Anda ingin melanjutkan?"
                onClose={() => setModalVisible({ type: null, isOpen: false })}
                onSave={confirmExportData}
                saveLabel={isExporting ? "Memproses..." : "Unduh Sekarang"}
                variant="default"
                headerIcon={<IconSymbol name="arrow.down.doc.fill" size={32} color="#10B981" />}
            />

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

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
        marginLeft: 68, // Icon width + margin + padding
    },
});
