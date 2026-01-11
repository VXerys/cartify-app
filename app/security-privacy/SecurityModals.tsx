import { AppModal } from '@/src/components/ui/AppModal';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Layout } from '@/src/constants/Layout';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './security-privacy.styles';

const COLORS = Layout.colors;

// Clear History Modal
interface ClearHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ClearHistoryModal: React.FC<ClearHistoryModalProps> = ({ visible, onClose, onConfirm }) => (
  <AppModal
    visible={visible}
    title="Hapus Riwayat?"
    subtitle="Semua data transaksi akan dihapus permanen dari perangkat ini. Tindakan ini tidak dapat dibatalkan."
    onClose={onClose}
    onSave={onConfirm}
    saveLabel="Ya, Hapus Semua"
    variant="danger"
    headerIcon={<IconSymbol name="trash.fill" size={32} color={COLORS.danger} />}
  />
);

// Delete Account Modal
interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ visible, onClose, onConfirm }) => (
  <AppModal
    visible={visible}
    title="Hapus Akun Permanen?"
    subtitle="Akun Anda beserta seluruh data akan dihapus secara permanen. Anda tidak akan bisa memulihkannya kembali."
    onClose={onClose}
    onSave={onConfirm}
    saveLabel="Hapus Akun Saya"
    variant="danger"
    headerIcon={<IconSymbol name="xmark.circle.fill" size={32} color={COLORS.danger} />}
  />
);

// App Lock Modal
interface AppLockModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const AppLockModal: React.FC<AppLockModalProps> = ({ visible, onClose, onConfirm }) => (
  <AppModal
    visible={visible}
    title="Aktifkan Kunci Aplikasi"
    subtitle="Lindungi data belanja Anda dengan mengaktifkan kunci aplikasi."
    onClose={onClose}
    onSave={onConfirm}
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
);
