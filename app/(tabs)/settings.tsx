import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Layout } from '@/src/constants/Layout';
import { useAuth } from '@/src/context/AuthContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { useSettings } from '@/src/hooks/useSettings';

import { ProfileCard } from './settings/ProfileCard';
import { AnimatedPressable, SettingItem, SettingSection } from './settings/SettingComponents';
import { styles } from './settings/settings.styles';
import { ModalState, PasswordState, UserProfile } from './settings/settings.types';
import {
  AvatarModal,
  EditProfileModal,
  LanguageModal,
  LogoutModal,
  PasswordModal,
  VoicePositionModal,
} from './settings/SettingsModals';

const COLORS = Layout.colors;

// Helper function to generate avatar URL
const getAvatarUrl = (avatarUrl: string | null | undefined, name: string | null | undefined, email: string | null | undefined) => {
  if (avatarUrl && avatarUrl.length > 0) return avatarUrl;
  const displayName = name || email?.split('@')[0] || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2A9D8F&color=fff&size=200`;
};

export default function SettingsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { moderateScale, containerPadding, contentContainerStyle } = useResponsive();
  const { voiceButtonPosition, setVoiceButtonPosition } = useSettings();
  const { user, signOut, updateProfile } = useAuth();

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => ({
    name: user?.fullName || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    avatar: getAvatarUrl(user?.avatarUrl, user?.fullName, user?.email),
  }));

  // Update local state when auth user changes
  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.fullName || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: getAvatarUrl(user.avatarUrl, user.fullName, user.email),
      });
    }
  }, [user]);

  // Modal States
  const [modalVisible, setModalVisible] = useState<ModalState>({ type: null, isOpen: false });

  // Form States
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempPassword, setTempPassword] = useState<PasswordState>({ current: '', new: '', confirm: '' });

  // Refresh State
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  // --- Handlers ---
  const closeModal = () => setModalVisible({ type: null, isOpen: false });

  const handleEditProfile = () => {
    setTempName(userProfile.name);
    setModalVisible({ type: 'profile', isOpen: true });
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({ fullName: tempName });
      setUserProfile((prev) => ({ ...prev, name: tempName }));
      closeModal();
      toast.success(t('profile.saved'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleChangePassword = () => {
    setTempPassword({ current: '', new: '', confirm: '' });
    setModalVisible({ type: 'password', isOpen: true });
  };

  const handleSavePassword = () => {
    if (tempPassword.new !== tempPassword.confirm) {
      toast.error(t('password.mismatch'));
      return;
    }
    if (tempPassword.new.length < 6) {
      toast.error(t('password.tooShort'));
      return;
    }
    closeModal();
    toast.success(t('password.updated'));
  };

  const handleAvatarSelect = async (uri: string) => {
    try {
      await updateProfile({ avatarUrl: uri });
      setUserProfile((p) => ({ ...p, avatar: uri }));
      closeModal();
      toast.success(t('profile.photoUpdated'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    closeModal();
  };

  const handleVoicePositionChange = async (position: 'left' | 'right') => {
    try {
      await setVoiceButtonPosition(position);
      closeModal();
      toast.success(t('settings.voicePositionSaved'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleLogout = async () => {
    closeModal();
    try {
      await signOut();
      toast.success(t('settings.loggedOut'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: containerPadding, paddingTop: moderateScale(10) }, contentContainerStyle as any]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Layout.colors.primary]} />}
      >
        {/* Profile Card */}
        <ProfileCard
          userProfile={userProfile}
          onEditProfile={handleEditProfile}
          onEditAvatar={() => setModalVisible({ type: 'avatar', isOpen: true })}
          moderateScale={moderateScale}
          goldMemberLabel={t('settings.goldMember')}
        />

        {/* Preferences Section */}
        <SettingSection title={t('settings.preferences')} moderateScale={moderateScale}>
          <SettingItem
            icon="globe"
            label={t('settings.language')}
            value={i18n.language === 'id' ? 'Bahasa Indonesia' : 'English'}
            onPress={() => setModalVisible({ type: 'language', isOpen: true })}
            iconColor="#3B82F6"
            moderateScale={moderateScale}
          />
          <View style={[styles.separator, { marginLeft: moderateScale(74) }]} />
          <SettingItem
            icon="hand.point.up.left.fill"
            label={t('settings.voiceButtonPosition')}
            value={voiceButtonPosition === 'right' ? t('settings.right') : t('settings.left')}
            onPress={() => setModalVisible({ type: 'voicePosition', isOpen: true })}
            iconColor="#10B981"
            moderateScale={moderateScale}
          />
        </SettingSection>

        {/* Account Section */}
        <SettingSection title={t('settings.account')} moderateScale={moderateScale}>
          <SettingItem icon="lock.fill" label={t('settings.changePassword')} onPress={handleChangePassword} iconColor={COLORS.primary} moderateScale={moderateScale} />
          <View style={[styles.separator, { marginLeft: moderateScale(74) }]} />
          <SettingItem icon="shield.fill" label={t('settings.securityPrivacy')} onPress={() => router.push('/security-privacy')} iconColor={COLORS.primary} moderateScale={moderateScale} />
        </SettingSection>

        {/* Support Section */}
        <SettingSection title={t('settings.support')} moderateScale={moderateScale}>
          <SettingItem icon="questionmark.circle.fill" label={t('settings.helpCenter')} onPress={() => router.push('/help-center')} iconColor="#8B5CF6" moderateScale={moderateScale} />
          <View style={[styles.separator, { marginLeft: moderateScale(74) }]} />
          <SettingItem icon="doc.text.fill" label={t('settings.termsPolicy')} onPress={() => router.push('/terms-policy')} iconColor="#8B5CF6" moderateScale={moderateScale} />
        </SettingSection>

        {/* Logout Button */}
        <View style={[styles.section, { marginBottom: moderateScale(40) }]}>
          <View style={[styles.sectionContent, { borderRadius: moderateScale(20) }]}>
            <AnimatedPressable style={[styles.logoutTouchable, { padding: moderateScale(18) }]} onPress={() => setModalVisible({ type: 'logout', isOpen: true })}>
              <IconSymbol name="rectangle.portrait.and.arrow.right.fill" size={moderateScale(22)} color={COLORS.danger} />
              <Text style={[styles.logoutText, { fontSize: moderateScale(16) }]}>{t('settings.logOut')}</Text>
            </AnimatedPressable>
          </View>
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { fontSize: moderateScale(12) }]}>{t('settings.version')} 1.0.0</Text>
          <Text style={[styles.buildText, { fontSize: moderateScale(10) }]}>Build 124</Text>
        </View>

        {/* Extra padding for navbar */}
        <View style={{ height: moderateScale(180) }} />
      </ScrollView>

      {/* --- Modals --- */}
      <EditProfileModal
        visible={modalVisible.type === 'profile' && modalVisible.isOpen}
        onClose={closeModal}
        onSave={handleSaveProfile}
        tempName={tempName}
        setTempName={setTempName}
        userEmail={userProfile.email}
        moderateScale={moderateScale}
        t={t}
      />
      <AvatarModal
        visible={modalVisible.type === 'avatar' && modalVisible.isOpen}
        onClose={closeModal}
        userAvatar={userProfile.avatar}
        onSelectAvatar={handleAvatarSelect}
        moderateScale={moderateScale}
        t={t}
      />
      <PasswordModal
        visible={modalVisible.type === 'password' && modalVisible.isOpen}
        onClose={closeModal}
        onSave={handleSavePassword}
        tempPassword={tempPassword}
        setTempPassword={setTempPassword}
        moderateScale={moderateScale}
        t={t}
      />
      <LanguageModal
        visible={modalVisible.type === 'language' && modalVisible.isOpen}
        onClose={closeModal}
        currentLanguage={i18n.language}
        onSelectLanguage={handleLanguageChange}
        moderateScale={moderateScale}
        t={t}
      />
      <VoicePositionModal
        visible={modalVisible.type === 'voicePosition' && modalVisible.isOpen}
        onClose={closeModal}
        currentPosition={voiceButtonPosition}
        onSelectPosition={handleVoicePositionChange}
        moderateScale={moderateScale}
        t={t}
      />
      <LogoutModal
        visible={modalVisible.type === 'logout' && modalVisible.isOpen}
        onClose={closeModal}
        onConfirm={handleLogout}
        moderateScale={moderateScale}
        t={t}
      />
    </SafeAreaView>
  );
}
