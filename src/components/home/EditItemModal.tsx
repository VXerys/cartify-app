import { AppModal } from '@/src/components/ui/AppModal';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { currencyToNumber, parseCurrencyInput } from '@/src/utils/currency';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

interface EditItemModalProps {
    visible: boolean;
    initialName: string;
    initialPrice: number; // Unit price
    onClose: () => void;
    onSave: (name: string, price: number) => void;
}

export function EditItemModal({ 
    visible, 
    initialName, 
    initialPrice, 
    onClose, 
    onSave 
}: EditItemModalProps) {
    const [name, setName] = useState(initialName);
    const [priceStr, setPriceStr] = useState('');

    useEffect(() => {
        if (visible) {
            setName(initialName);
            // Format existing price
            setPriceStr(parseCurrencyInput(initialPrice.toString()));
        }
    }, [visible, initialName, initialPrice]);

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
        onSave(name, num);
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
});
