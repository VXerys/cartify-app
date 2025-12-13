import { AppModal } from '@/src/components/ui/AppModal';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { currencyToNumber, parseCurrencyInput } from '@/src/utils/currency';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface EditItemModalProps {
    visible: boolean;
    initialName: string;
    initialPrice: number; // Unit price
    initialUnit?: string;
    onClose: () => void;
    onSave: (name: string, price: number, unit: string) => void;
}

export function EditItemModal({ 
    visible, 
    initialName, 
    initialPrice, 
    initialUnit = 'unit',
    onClose, 
    onSave 
}: EditItemModalProps) {
    const [name, setName] = useState(initialName);
    const [unit, setUnit] = useState(initialUnit);
    const [priceStr, setPriceStr] = useState('');

    const COMMON_UNITS = ['pcs', 'kg', 'gr', 'liter', 'ml', 'pack', 'unit', 'box', 'porsi'];

    useEffect(() => {
        if (visible) {
            setName(initialName);
            setUnit(initialUnit || 'unit');
            // Format existing price
            setPriceStr(parseCurrencyInput(initialPrice.toString()));
        }
    }, [visible, initialName, initialPrice, initialUnit]);

    const handlePriceChange = (text: string) => {
        if (text === 'Rp ' || text === '') {
            setPriceStr('');
            return;
        }
        setPriceStr(parseCurrencyInput(text));
    };

    const handleSave = () => {
        if (!name.trim()) return;
        const num = currencyToNumber(priceStr);
        onSave(name, num, unit);
        onClose();
    };

    return (
        <AppModal
            visible={visible}
            title="Edit Item"
            subtitle="Modify item details below"
            onClose={onClose}
            onSave={handleSave}
            saveLabel="Save Changes"
            headerIcon={<IconSymbol name="pencil" size={24} color="#81BFBC" />}
        >
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter product name"
                    placeholderTextColor="#B0B0B0"
                    autoFocus={false}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Unit Price</Text>
                <TextInput
                    style={styles.input}
                    value={priceStr}
                    onChangeText={handlePriceChange}
                    placeholder="Rp 0"
                    placeholderTextColor="#B0B0B0"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Unit</Text>
                <View style={styles.unitContainer}>
                    {COMMON_UNITS.map((u) => (
                        <TouchableOpacity
                            key={u}
                            onPress={() => setUnit(u)}
                            style={[
                                styles.unitChip,
                                unit === u && styles.unitChipActive
                            ]}
                        >
                            <Text style={[
                                styles.unitText,
                                unit === u && styles.unitTextActive
                            ]}>{u}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </AppModal>
    );
}

const styles = StyleSheet.create({
    inputGroup: {
        gap: 8,
        width: '100%',
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#FAFAFA',
        borderWidth: 2,
        borderColor: '#EEE',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    unitContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
    },
    unitChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    unitChipActive: {
        backgroundColor: '#E0F2F1', // Light teal
        borderColor: '#81BFBC',
    },
    unitText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4B5563',
    },
    unitTextActive: {
        color: '#00695C',
        fontWeight: '700',
    },
});
