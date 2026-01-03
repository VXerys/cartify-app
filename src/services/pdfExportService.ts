import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Groq from 'groq-sdk';
import { Transaction } from './db';

// Groq API Key from environment
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

const createGroqClient = () => {
    if (!GROQ_API_KEY) return null;
    return new Groq({
        apiKey: GROQ_API_KEY,
        dangerouslyAllowBrowser: true,
        timeout: 15000,
    });
};

/**
 * Format currency to Indonesian Rupiah
 */
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Format date to Indonesian locale
 */
const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return dateString;
    }
};

/**
 * Generate summary using Groq AI (optional enhancement)
 */
const generateAISummary = async (transactions: Transaction[]): Promise<string | null> => {
    const groq = createGroqClient();
    if (!groq || transactions.length === 0) return null;

    try {
        // Prepare summary data for AI
        const totalTransactions = transactions.length;
        const totalSpent = transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0);
        
        // Category breakdown
        const categoryTotals: Record<string, number> = {};
        transactions.forEach(t => {
            t.items?.forEach(item => {
                const cat = item.category || 'other';
                categoryTotals[cat] = (categoryTotals[cat] || 0) + item.total_price;
            });
        });

        const prompt = `Anda adalah asisten analisis keuangan. Berdasarkan data belanja berikut, berikan ringkasan singkat dalam Bahasa Indonesia (maksimal 3 kalimat):

Total Transaksi: ${totalTransactions}
Total Pengeluaran: ${formatCurrency(totalSpent)}
Breakdown per Kategori:
${Object.entries(categoryTotals).map(([cat, total]) => `- ${cat}: ${formatCurrency(total)}`).join('\n')}

Berikan insight tentang pola pengeluaran dan saran singkat. Jawab langsung tanpa kata pembuka.`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 200,
        });

        return completion.choices[0]?.message?.content || null;
    } catch (error) {
        console.error('AI Summary Error:', error);
        return null;
    }
};

/**
 * Generate HTML template for PDF
 */
const generatePDFHTML = async (
    transactions: Transaction[],
    options?: { includeAISummary?: boolean }
): Promise<string> => {
    const currentDate = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Calculate statistics
    const totalSpent = transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0);
    const totalItems = transactions.reduce((sum, t) => sum + (t.items?.length || 0), 0);
    
    // Category breakdown
    const categoryTotals: Record<string, { total: number; count: number }> = {};
    const categoryColors: Record<string, string> = {
        food: '#22C55E',
        drink: '#3B82F6',
        snacks: '#F59E0B',
        fruit: '#10B981',
        household: '#8B5CF6',
        other: '#6B7280',
    };

    transactions.forEach(t => {
        t.items?.forEach(item => {
            const cat = item.category || 'other';
            if (!categoryTotals[cat]) {
                categoryTotals[cat] = { total: 0, count: 0 };
            }
            categoryTotals[cat].total += item.total_price;
            categoryTotals[cat].count += 1;
        });
    });

    // Get AI summary if enabled
    let aiSummary = '';
    if (options?.includeAISummary) {
        const summary = await generateAISummary(transactions);
        if (summary) {
            aiSummary = `
                <div class="ai-summary">
                    <div class="ai-header">
                        <span class="ai-icon">🤖</span>
                        <span>Analisis AI</span>
                    </div>
                    <p>${summary}</p>
                </div>
            `;
        }
    }

    // Generate category badges HTML
    const categoryBadges = Object.entries(categoryTotals)
        .sort((a, b) => b[1].total - a[1].total)
        .map(([cat, data]) => `
            <div class="category-badge" style="border-left: 4px solid ${categoryColors[cat] || '#6B7280'};">
                <span class="category-name">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                <span class="category-value">${formatCurrency(data.total)}</span>
                <span class="category-count">${data.count} item</span>
            </div>
        `).join('');

    // Generate transaction rows HTML
    const transactionRows = transactions.flatMap((t, tIndex) => {
        const baseRows = t.items?.map((item, iIndex) => `
            <tr class="${tIndex % 2 === 0 ? 'row-even' : 'row-odd'}">
                ${iIndex === 0 ? `
                    <td rowspan="${t.items?.length || 1}" class="cell-id">${t.id}</td>
                    <td rowspan="${t.items?.length || 1}" class="cell-date">${formatDate(t.date)}</td>
                ` : ''}
                <td class="cell-item">${item.item_name}</td>
                <td class="cell-qty">${item.quantity} ${item.unit || 'pcs'}</td>
                <td class="cell-price">${formatCurrency(item.item_price)}</td>
                <td class="cell-total">${formatCurrency(item.total_price)}</td>
                <td class="cell-category">
                    <span class="badge" style="background-color: ${categoryColors[item.category] || '#6B7280'}20; color: ${categoryColors[item.category] || '#6B7280'};">
                        ${item.category || 'other'}
                    </span>
                </td>
                ${iIndex === 0 ? `
                    <td rowspan="${t.items?.length || 1}" class="cell-transaction-total">${formatCurrency(t.total_amount)}</td>
                ` : ''}
            </tr>
        `) || [];
        
        // Handle transactions without items
        if (!t.items || t.items.length === 0) {
            return [`
                <tr class="${tIndex % 2 === 0 ? 'row-even' : 'row-odd'}">
                    <td class="cell-id">${t.id}</td>
                    <td class="cell-date">${formatDate(t.date)}</td>
                    <td class="cell-item" colspan="4">-</td>
                    <td class="cell-category">-</td>
                    <td class="cell-transaction-total">${formatCurrency(t.total_amount)}</td>
                </tr>
            `];
        }
        
        return baseRows;
    }).join('');

    return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Transaksi Cartify</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #ffffff;
            color: #1F2937;
            line-height: 1.5;
            padding: 40px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 24px;
            border-bottom: 3px solid #6366F1;
        }
        
        .logo {
            font-size: 32px;
            font-weight: 800;
            color: #6366F1;
            letter-spacing: -1px;
            margin-bottom: 8px;
        }
        
        .logo span {
            color: #A78BFA;
        }
        
        .subtitle {
            font-size: 14px;
            color: #6B7280;
        }
        
        .report-date {
            margin-top: 12px;
            font-size: 12px;
            color: #9CA3AF;
        }
        
        .stats-grid {
            display: flex;
            gap: 20px;
            margin-bottom: 32px;
        }
        
        .stat-card {
            flex: 1;
            background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
            color: white;
            padding: 20px;
            border-radius: 16px;
            text-align: center;
        }
        
        .stat-card.secondary {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        }
        
        .stat-card.tertiary {
            background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
        }
        
        .stat-value {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 4px;
        }
        
        .stat-label {
            font-size: 12px;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .ai-summary {
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 32px;
            border-left: 4px solid #F59E0B;
        }
        
        .ai-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 700;
            color: #92400E;
            margin-bottom: 12px;
            font-size: 14px;
        }
        
        .ai-icon {
            font-size: 20px;
        }
        
        .ai-summary p {
            color: #78350F;
            font-size: 13px;
            line-height: 1.6;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #374151;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .section-title::before {
            content: '';
            width: 4px;
            height: 20px;
            background: #6366F1;
            border-radius: 2px;
        }
        
        .categories-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 32px;
        }
        
        .category-badge {
            background: #F9FAFB;
            padding: 12px 16px;
            border-radius: 12px;
            min-width: 140px;
        }
        
        .category-name {
            display: block;
            font-size: 11px;
            color: #6B7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        
        .category-value {
            display: block;
            font-size: 16px;
            font-weight: 700;
            color: #1F2937;
        }
        
        .category-count {
            display: block;
            font-size: 11px;
            color: #9CA3AF;
            margin-top: 2px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-top: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border-radius: 12px;
            overflow: hidden;
        }
        
        thead {
            background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);
            color: white;
        }
        
        th {
            padding: 14px 12px;
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 10px;
        }
        
        td {
            padding: 12px;
            border-bottom: 1px solid #E5E7EB;
        }
        
        .row-even {
            background: #ffffff;
        }
        
        .row-odd {
            background: #F9FAFB;
        }
        
        .cell-id {
            font-weight: 600;
            color: #6366F1;
            text-align: center;
            width: 50px;
        }
        
        .cell-date {
            color: #374151;
            font-size: 10px;
            width: 120px;
        }
        
        .cell-item {
            font-weight: 500;
            color: #1F2937;
        }
        
        .cell-qty {
            text-align: center;
            color: #6B7280;
            width: 80px;
        }
        
        .cell-price, .cell-total {
            text-align: right;
            font-family: 'Courier New', monospace;
            color: #374151;
            width: 100px;
        }
        
        .cell-transaction-total {
            text-align: right;
            font-family: 'Courier New', monospace;
            font-weight: 700;
            color: #059669;
            background: #ECFDF5 !important;
            width: 110px;
        }
        
        .cell-category {
            text-align: center;
            width: 90px;
        }
        
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 2px solid #E5E7EB;
            text-align: center;
            color: #9CA3AF;
            font-size: 11px;
        }
        
        .footer-brand {
            font-weight: 700;
            color: #6366F1;
        }
        
        .grand-total {
            margin-top: 24px;
            text-align: right;
            padding: 20px;
            background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
            border-radius: 16px;
            border: 2px solid #10B981;
        }
        
        .grand-total-label {
            font-size: 14px;
            color: #065F46;
            margin-bottom: 4px;
        }
        
        .grand-total-value {
            font-size: 32px;
            font-weight: 800;
            color: #059669;
            font-family: 'Courier New', monospace;
        }
        
        @media print {
            body {
                padding: 20px;
            }
            
            .stat-card, .ai-summary {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Cart<span>ify</span></div>
        <div class="subtitle">Laporan Riwayat Transaksi</div>
        <div class="report-date">Diekspor pada: ${currentDate}</div>
    </div>
    
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-value">${transactions.length}</div>
            <div class="stat-label">Total Transaksi</div>
        </div>
        <div class="stat-card secondary">
            <div class="stat-value">${totalItems}</div>
            <div class="stat-label">Total Item</div>
        </div>
        <div class="stat-card tertiary">
            <div class="stat-value">${formatCurrency(totalSpent)}</div>
            <div class="stat-label">Total Pengeluaran</div>
        </div>
    </div>
    
    ${aiSummary}
    
    <div class="section-title">Ringkasan per Kategori</div>
    <div class="categories-grid">
        ${categoryBadges}
    </div>
    
    <div class="section-title">Detail Transaksi</div>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Tanggal</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Harga Satuan</th>
                <th>Total Item</th>
                <th>Kategori</th>
                <th>Total Transaksi</th>
            </tr>
        </thead>
        <tbody>
            ${transactionRows}
        </tbody>
    </table>
    
    <div class="grand-total">
        <div class="grand-total-label">Grand Total Semua Transaksi</div>
        <div class="grand-total-value">${formatCurrency(totalSpent)}</div>
    </div>
    
    <div class="footer">
        <p>Dokumen ini dihasilkan secara otomatis oleh <span class="footer-brand">Cartify</span></p>
        <p>© ${new Date().getFullYear()} Cartify - Smart Shopping Assistant</p>
    </div>
</body>
</html>
    `;
};

export interface ExportPDFResult {
    success: boolean;
    message: string;
    fileUri?: string;
}

/**
 * Export transactions to PDF and share
 */
export const exportToPDF = async (
    transactions: Transaction[],
    options?: { includeAISummary?: boolean }
): Promise<ExportPDFResult> => {
    try {
        // Validate transactions
        if (!transactions || transactions.length === 0) {
            return {
                success: false,
                message: 'Tidak ada data transaksi untuk diekspor.',
            };
        }

        // Generate HTML content
        const htmlContent = await generatePDFHTML(transactions, options);

        // Generate PDF from HTML
        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
            base64: false,
        });

        // Rename file with proper name
        const fileName = `Cartify_Laporan_${new Date().toISOString().split('T')[0]}.pdf`;
        const newUri = `${FileSystem.documentDirectory}${fileName}`;

        // Move file to document directory with proper name
        await FileSystem.moveAsync({
            from: uri,
            to: newUri,
        });

        // Check if sharing is available
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(newUri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Bagikan Laporan Transaksi',
                UTI: 'com.adobe.pdf',
            });
            
            return {
                success: true,
                message: 'Laporan PDF berhasil diekspor!',
                fileUri: newUri,
            };
        } else {
            return {
                success: false,
                message: 'Fitur berbagi tidak tersedia di perangkat ini.',
                fileUri: newUri,
            };
        }
    } catch (error) {
        console.error('PDF Export Error:', error);
        return {
            success: false,
            message: `Gagal mengekspor PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
};

/**
 * Export transactions to CSV and share
 */
export const exportToCSV = async (transactions: Transaction[]): Promise<ExportPDFResult> => {
    try {
        if (!transactions || transactions.length === 0) {
            return {
                success: false,
                message: 'Tidak ada data transaksi untuk diekspor.',
            };
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
                const row = [
                    t.id,
                    `"${t.date}"`,
                    t.total_amount,
                    `"${t.note || ''}"`,
                    "-", 0, 0, "-", "-", 0
                ].join(",");
                csvContent += row + "\n";
            }
        });

        const fileName = `Cartify_Export_${new Date().toISOString().split('T')[0]}.csv`;
        const fileUri = FileSystem.documentDirectory + fileName;

        await FileSystem.writeAsStringAsync(fileUri, csvContent, { 
            encoding: FileSystem.EncodingType.UTF8 
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
            return {
                success: true,
                message: 'Data CSV berhasil diekspor!',
                fileUri,
            };
        } else {
            return {
                success: false,
                message: 'Fitur berbagi tidak tersedia di perangkat ini.',
                fileUri,
            };
        }
    } catch (error) {
        console.error('CSV Export Error:', error);
        return {
            success: false,
            message: `Gagal mengekspor CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
};
