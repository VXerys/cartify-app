import { AppModal } from '@/src/components/ui/AppModal';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Layout } from '@/src/constants/Layout';
import React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './settings.styles';
import { AVATAR_OPTIONS, LANGUAGE_OPTIONS, PasswordState, VOICE_POSITION_OPTIONS } from './settings.types';

const COLORS = Layout.colors;

// Edit Profile Modal
interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  tempName: string;
  setTempName: (name: string) => void;
  userEmail: string;
  moderateScale: (size: number) => number;
  t: (key: string) => string;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible, onClose, onSave, tempName, setTempName, userEmail, moderateScale, t,
}) => (
  <AppModal
    visible={visible}
    title={t('profile.editProfile')}
    subtitle={t('profile.editProfileSubtitle')}
    onClose={onClose}
    onSave={onSave}
    saveLabel={t('common.save')}
    headerIcon={<IconSymbol name="person.fill" size={moderateScale(32)} color={COLORS.primary} />}
  >
    <View style={[styles.inputContainer, { gap: moderateScale(20) }]}>
      <View style={styles.inputWrapper}>
        <Text style={[styles.inputLabel, { fontSize: moderateScale(14), marginBottom: moderateScale(8), marginLeft: moderateScale(4) }]}>
          {t('profile.fullName')}
        </Text>
        <View style={[styles.inputFieldContainer, { height: moderateScale(54), borderRadius: moderateScale(16), paddingHorizontal: moderateScale(16) }]}>
          <IconSymbol name="person" size={moderateScale(20)} color={COLORS.subtext} style={{ marginRight: moderateScale(10) }} />
          <TextInput
            style={[styles.inputStyled, { fontSize: moderateScale(16) }]}
            value={tempName}
            onChangeText={setTempName}
            placeholder={t('profile.fullName')}
            placeholderTextColor={COLORS.placeholder}
          />
        </View>
      </View>
      <View style={styles.inputWrapper}>
        <Text style={[styles.inputLabel, { fontSize: moderateScale(14), marginBottom: moderateScale(8), marginLeft: moderateScale(4) }]}>
          {t('profile.email')}
        </Text>
        <View style={[styles.inputFieldContainer, { height: moderateScale(54), borderRadius: moderateScale(16), paddingHorizontal: moderateScale(16), backgroundColor: '#F3F4F6', borderColor: 'transparent' }]}>
          <IconSymbol name="cube.box.fill" size={moderateScale(20)} color={COLORS.subtext} style={{ marginRight: moderateScale(10) }} />
          <TextInput style={[styles.inputStyled, { fontSize: moderateScale(16), color: '#6B7280' }]} value={userEmail} editable={false} />
          <IconSymbol name="lock.fill" size={moderateScale(16)} color="#9CA3AF" />
        </View>
        <Text style={[styles.helperText, { fontSize: moderateScale(12), marginTop: moderateScale(6), marginLeft: moderateScale(4) }]}>
          {t('profile.emailHelper')}
        </Text>
      </View>
    </View>
  </AppModal>
);

// Avatar Selection Modal
interface AvatarModalProps {
  visible: boolean;
  onClose: () => void;
  userAvatar: string;
  onSelectAvatar: (uri: string) => void;
  moderateScale: (size: number) => number;
  t: (key: string) => string;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({
  visible, onClose, userAvatar, onSelectAvatar, moderateScale, t,
}) => {
  const [loading, setLoading] = React.useState(false);

  const pickImage = async () => {
    try {
      setLoading(true);
      
      // Dynamically import expo-image-picker
      const ImagePicker = await import('expo-image-picker');
      
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert(t('profile.galleryPermissionDenied'));
        setLoading(false);
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        onSelectAvatar(result.assets[0].uri);
        onClose();
      }
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal
      visible={visible}
      title={t('profile.updatePhoto')}
      subtitle={t('profile.updatePhotoSubtitle')}
      onClose={onClose}
      headerIcon={<IconSymbol name="camera.fill" size={moderateScale(32)} color={COLORS.primary} />}
    >
      <View style={[styles.avatarGrid, { gap: moderateScale(16), marginBottom: moderateScale(24) }]}>
        {AVATAR_OPTIONS.map((uri, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.avatarOption,
              { width: moderateScale(80), height: moderateScale(80), borderRadius: moderateScale(40), padding: moderateScale(3), borderWidth: moderateScale(2) },
              userAvatar === uri && styles.avatarOptionSelected,
            ]}
            onPress={() => onSelectAvatar(uri)}
            activeOpacity={0.7}
          >
            <Image source={{ uri }} style={[styles.avatarThumb, { borderRadius: moderateScale(40) }]} />
            {userAvatar === uri && (
              <View style={[styles.avatarCheck, { width: moderateScale(24), height: moderateScale(24), borderRadius: moderateScale(12), borderWidth: moderateScale(2) }]}>
                <IconSymbol name="checkmark" size={moderateScale(12)} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity 
        style={[styles.uploadButton, { paddingVertical: moderateScale(14), borderRadius: moderateScale(14), opacity: loading ? 0.7 : 1 }]}
        onPress={pickImage}
        disabled={loading}
      >
        <Text style={[styles.uploadButtonText, { fontSize: moderateScale(14) }]}>
          {loading ? t('common.loading') : t('profile.chooseGallery')}
        </Text>
      </TouchableOpacity>
    </AppModal>
  );
};

// Change Password Modal
interface PasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  tempPassword: PasswordState;
  setTempPassword: React.Dispatch<React.SetStateAction<PasswordState>>;
  moderateScale: (size: number) => number;
  t: (key: string) => string;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  visible, onClose, onSave, tempPassword, setTempPassword, moderateScale, t,
}) => (
  <AppModal
    visible={visible}
    title={t('password.title')}
    subtitle={t('password.subtitle')}
    onClose={onClose}
    onSave={onSave}
    saveLabel={t('password.update')}
    headerIcon={<IconSymbol name="lock.fill" size={moderateScale(32)} color={COLORS.primary} />}
  >
    <View style={[styles.inputContainer, { gap: moderateScale(20) }]}>
      {[
        { key: 'current', icon: 'lock', label: t('password.current') },
        { key: 'new', icon: 'key', label: t('password.new') },
        { key: 'confirm', icon: 'key.fill', label: t('password.confirm') },
      ].map((field) => (
        <View key={field.key} style={styles.inputWrapper}>
          <Text style={[styles.inputLabel, { fontSize: moderateScale(14), marginBottom: moderateScale(8), marginLeft: moderateScale(4) }]}>
            {field.label}
          </Text>
          <View style={[styles.inputFieldContainer, { height: moderateScale(54), borderRadius: moderateScale(16), paddingHorizontal: moderateScale(16) }]}>
            <IconSymbol name={field.icon as any} size={moderateScale(20)} color={COLORS.subtext} style={{ marginRight: moderateScale(10) }} />
            <TextInput
              style={[styles.inputStyled, { fontSize: moderateScale(16) }]}
              value={tempPassword[field.key as keyof PasswordState]}
              onChangeText={(text) => setTempPassword((prev) => ({ ...prev, [field.key]: text }))}
              placeholder={field.label}
              placeholderTextColor={COLORS.placeholder}
              secureTextEntry
            />
          </View>
        </View>
      ))}
    </View>
  </AppModal>
);

// Language Selection Modal
interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (code: string) => void;
  moderateScale: (size: number) => number;
  t: (key: string) => string;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  visible, onClose, currentLanguage, onSelectLanguage, moderateScale, t,
}) => (
  <AppModal
    visible={visible}
    title={t('language.title')}
    subtitle={t('language.subtitle')}
    onClose={onClose}
    headerIcon={<IconSymbol name="globe" size={moderateScale(28)} color={COLORS.primary} />}
  >
    <View style={{ width: '100%', gap: moderateScale(10) }}>
      {LANGUAGE_OPTIONS.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.languageOption,
            { padding: moderateScale(16), borderRadius: moderateScale(12) },
            currentLanguage === lang.code && styles.languageOptionSelected,
          ]}
          onPress={() => onSelectLanguage(lang.code)}
          activeOpacity={0.7}
        >
          <View style={styles.languageRow}>
            <Text style={styles.languageFlag}>{lang.flag}</Text>
            <Text style={[styles.languageText, { fontSize: moderateScale(16) }, currentLanguage === lang.code && styles.languageTextSelected]}>
              {lang.label}
            </Text>
          </View>
          {currentLanguage === lang.code && <IconSymbol name="checkmark.circle.fill" size={moderateScale(22)} color={COLORS.primary} />}
        </TouchableOpacity>
      ))}
    </View>
  </AppModal>
);

// Voice Position Modal
interface VoicePositionModalProps {
  visible: boolean;
  onClose: () => void;
  currentPosition: 'left' | 'right';
  onSelectPosition: (position: 'left' | 'right') => void;
  moderateScale: (size: number) => number;
  t: (key: string) => string;
}

export const VoicePositionModal: React.FC<VoicePositionModalProps> = ({
  visible, onClose, currentPosition, onSelectPosition, moderateScale, t,
}) => (
  <AppModal
    visible={visible}
    title={t('settings.voiceButtonPosition')}
    subtitle={t('settings.voicePositionSubtitle')}
    onClose={onClose}
    headerIcon={<IconSymbol name="hand.point.up.left.fill" size={moderateScale(28)} color="#10B981" />}
  >
    <View style={{ width: '100%', gap: moderateScale(10) }}>
      {VOICE_POSITION_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.languageOption,
            { padding: moderateScale(16), borderRadius: moderateScale(12) },
            currentPosition === option.key && styles.languageOptionSelected,
          ]}
          onPress={() => onSelectPosition(option.key)}
          activeOpacity={0.7}
        >
          <View style={styles.voicePositionRow}>
            <Text style={[styles.languageFlag, { marginTop: moderateScale(2) }]}>{option.emoji}</Text>
            <View style={styles.voicePositionTextContainer}>
              <Text style={[styles.languageText, { fontSize: moderateScale(16) }, currentPosition === option.key && styles.languageTextSelected]}>
                {t(`settings.${option.key}`)}
              </Text>
              <Text style={[styles.positionDescription, { fontSize: moderateScale(12), marginTop: moderateScale(2) }]}>
                {t(`settings.${option.key}Description`)}
              </Text>
            </View>
          </View>
          {currentPosition === option.key && <IconSymbol name="checkmark.circle.fill" size={moderateScale(22)} color="#10B981" />}
        </TouchableOpacity>
      ))}
    </View>
  </AppModal>
);

// Logout Confirmation Modal
interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  moderateScale: (size: number) => number;
  t: (key: string) => string;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  visible, onClose, onConfirm, moderateScale, t,
}) => (
  <AppModal
    visible={visible}
    title={t('settings.logoutConfirmTitle')}
    subtitle={t('settings.logoutConfirmSubtitle')}
    onClose={onClose}
    onSave={onConfirm}
    saveLabel={t('settings.logOut')}
    cancelLabel={t('common.cancel')}
    variant="danger"
    headerIcon={<IconSymbol name="rectangle.portrait.and.arrow.right.fill" size={moderateScale(36)} color="#DC2626" />}
  />
);
