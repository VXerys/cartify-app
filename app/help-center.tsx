import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '../src/components/ui/icon-symbol';
import { Layout } from '../src/constants/Layout';

const COLORS = Layout.colors;

export default function HelpCenterScreen() {
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            question: "Bagaimana cara mencatat transaksi?",
            answer: "Tekan tombol mikrofon di halaman utama, lalu sebutkan nama barang dan harganya (contoh: 'Beli Ayam Goreng 15 ribu'). Atau gunakan input manual."
        },
        {
            question: "Apakah bisa mengedit transaksi?",
            answer: "Ya, masuk ke menu Riwayat, pilih transaksi yang ingin diubah, lalu tekan tombol edit."
        },
        {
            question: "Bagaimana cara menghapus riwayat?",
            answer: "Di menu Riwayat, geser item ke kiri atau tekan ikon hapus untuk menghapus transaksi."
        },
         {
            question: "Apa keuntungan Anggota Emas?",
            answer: "Anggota Emas mendapatkan akses ke fitur analisis budget mendalam dan tanpa iklan (segera hadir)."
        },
        {
            question: "Aplikasi tidak mengenali suara saya?",
            answer: "Pastikan Anda berada di tempat yang tidak terlalu bising dan berbicara dengan jelas. Cek juga izin mikrofon di pengaturan HP Anda."
        }
    ];

    const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleContactSupport = () => {
        const url = 'mailto:support@cartify.com?subject=Butuh Bantuan Cartify';
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            }
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{ 
                headerTitle: 'Pusat Bantuan', 
                headerStyle: { backgroundColor: COLORS.background },
                headerTintColor: COLORS.text,
                headerShadowVisible: false,
            }} />
            
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Search Header */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Kami siap membantu Anda</Text>
                    <View style={styles.searchContainer}>
                        <IconSymbol name="magnifyingglass" size={20} color={COLORS.subtext} style={styles.searchIcon} />
                        <TextInput 
                            style={styles.searchInput}
                            placeholder="Cari kendala anda..."
                            placeholderTextColor={COLORS.subtext}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* FAQ Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pertanyaan Populer</Text>
                    {filteredFaqs.map((faq, index) => (
                        <View key={index} style={styles.faqItem}>
                            <Text style={styles.faqQuestion}>{faq.question}</Text>
                            <Text style={styles.faqAnswer}>{faq.answer}</Text>
                        </View>
                    ))}
                     {filteredFaqs.length === 0 && (
                        <View style={styles.emptyState}>
                            <IconSymbol name="questionmark.circle.fill" size={40} color={COLORS.placeholder} />
                            <Text style={styles.emptyText}>Tidak ada hasil ditemukan.</Text>
                        </View>
                    )}
                </View>

                {/* Contact Section */}
                <View style={[styles.contactSection, styles.cardShadow]}>
                    <View style={{flex: 1}}>
                        <Text style={styles.contactTitle}>Butuh bantuan lebih lanjut?</Text>
                        <Text style={styles.contactSubtitle}>Tim kami siap membantu 24/7.</Text>
                    </View>
                    <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
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
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    headerContainer: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        // Shadow for better depth
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
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
    emptyState: {
        alignItems: 'center',
        padding: 40,
        opacity: 0.7,
    },
    emptyText: {
        marginTop: 10,
        color: COLORS.subtext,
        fontSize: 16,
    },
    contactSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#E0F2F1', // Light teal tint
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.primary + '20',
    },
    cardShadow: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
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
