import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '../src/components/ui/icon-symbol';
import { Layout } from '../src/constants/Layout';

const COLORS = Layout.colors;

export default function TermsPolicyScreen() {
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
                <Text style={styles.headerTitle}>Syarat & Kebijakan</Text>
                <View style={styles.headerSpacer} />
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <Text style={styles.lastUpdated}>Terakhir diperbarui: 19 Desember 2025</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Pendahuluan</Text>
                    <Text style={styles.paragraph}>
                        Selamat datang di Cartify. Dengan menggunakan aplikasi ini, Anda menyetujui Syarat dan Ketentuan berikut. Aplikasi ini dirancang untuk membantu Anda mencatat dan mengelola belanja harian dengan mudah menggunakan teknologi suara dan fitur pintar lainnya.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Data Pribadi</Text>
                    <Text style={styles.paragraph}>
                        Kami menghargai privasi Anda. Data yang Anda masukkan, termasuk riwayat belanja dan rekaman suara, disimpan secara lokal di perangkat Anda atau di server aman kami hanya untuk keperluan fungsionalitas aplikasi. Kami tidak menjual data Anda kepada pihak ketiga.
                    </Text>
                </View>

                 <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Penggunaan Aplikasi</Text>
                    <Text style={styles.paragraph}>
                        Anda dilarang menggunakan aplikasi untuk tujuan ilegal atau melanggar hukum. Fitur pengenalan suara mungkin tidak 100% akurat dan kami tidak bertanggung jawab atas kesalahan pencatatan akibat faktor teknis atau lingkungan.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Perubahan Kebijakan</Text>
                    <Text style={styles.paragraph}>
                        Kami berhak mengubah syarat dan kebijakan ini sewaktu-waktu. Perubahan akan diberitahukan melalui pembaruan aplikasi atau notifikasi. Penggunaan berkelanjutan atas aplikasi dianggap sebagai persetujuan terhadap perubahan tersebut.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Hubungi Kami</Text>
                    <Text style={styles.paragraph}>
                        Jika Anda memiliki pertanyaan mengenai Syarat & Kebijakan ini, silakan hubungi kami melalui fitur Pusat Bantuan di menu Pengaturan.
                    </Text>
                </View>

                <View style={styles.footer}>
                     <Text style={styles.footerText}>© 2025 Cartify App. All rights reserved.</Text>
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
        padding: 24,
        paddingBottom: 40,
    },
    lastUpdated: {
        fontSize: 14,
        color: COLORS.subtext,
        marginBottom: 24,
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 12,
    },
    paragraph: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 24,
        textAlign: 'justify',
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    footerText: {
        fontSize: 12,
        color: COLORS.subtext,
    }
});

