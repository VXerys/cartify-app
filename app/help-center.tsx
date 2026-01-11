import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '../src/components/ui/icon-symbol';
import { Layout } from '../src/constants/Layout';

const COLORS = Layout.colors;

export default function HelpCenterScreen() {
    const router = useRouter();

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
                <Text style={styles.headerTitle}>Pusat Bantuan</Text>
                <View style={styles.headerSpacer} />
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Help Intro */}
                <View style={styles.introCard}>
                    <IconSymbol name="questionmark.circle.fill" size={40} color={COLORS.primary} />
                    <Text style={styles.introTitle}>Kami siap membantu Anda</Text>
                    <Text style={styles.introSubtitle}>Temukan jawaban untuk pertanyaan Anda di bawah ini</Text>
                </View>

                {/* FAQ Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pertanyaan Populer</Text>
                    
                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>Bagaimana cara mencatat transaksi?</Text>
                        <Text style={styles.faqAnswer}>Tekan tombol mikrofon di halaman utama, lalu sebutkan nama barang dan harganya (contoh: 'Beli Ayam Goreng 15 ribu'). Atau gunakan input manual.</Text>
                    </View>
                    
                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>Apakah bisa mengedit transaksi?</Text>
                        <Text style={styles.faqAnswer}>Ya, masuk ke menu Riwayat, pilih transaksi yang ingin diubah, lalu tekan tombol edit.</Text>
                    </View>
                    
                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>Bagaimana cara menghapus riwayat?</Text>
                        <Text style={styles.faqAnswer}>Di menu Riwayat, geser item ke kiri atau tekan ikon hapus untuk menghapus transaksi.</Text>
                    </View>
                    
                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>Aplikasi tidak mengenali suara saya?</Text>
                        <Text style={styles.faqAnswer}>Pastikan Anda berada di tempat yang tidak terlalu bising dan berbicara dengan jelas. Cek juga izin mikrofon di pengaturan HP Anda.</Text>
                    </View>
                </View>

                {/* Contact Section */}
                <View style={styles.contactSection}>
                    <View style={{flex: 1}}>
                        <Text style={styles.contactTitle}>Butuh bantuan lebih lanjut?</Text>
                        <Text style={styles.contactSubtitle}>Tim kami siap membantu 24/7.</Text>
                    </View>
                    <TouchableOpacity style={styles.contactButton}>
                         <IconSymbol name="envelope.fill" size={20} color="#FFF" />
                         <Text style={styles.contactButtonText}>Email Kami</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
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
    introCard: {
        alignItems: 'center',
        backgroundColor: '#E0F2F1',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
    },
    introTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.primary,
        marginTop: 12,
    },
    introSubtitle: {
        fontSize: 14,
        color: COLORS.primary,
        opacity: 0.8,
        marginTop: 4,
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 16,
    },
    faqItem: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    faqAnswer: {
        fontSize: 14,
        color: COLORS.subtext,
        lineHeight: 20,
    },
    contactSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#E0F2F1',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.primary + '20',
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 4,
    },
    contactSubtitle: {
        fontSize: 13,
        color: COLORS.primary,
        opacity: 0.8,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 8,
    },
    contactButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
});

