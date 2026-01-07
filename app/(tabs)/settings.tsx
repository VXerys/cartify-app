import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import { AppModal } from '../../src/components/ui/AppModal';
import { IconSymbol, IconSymbolName } from '../../src/components/ui/icon-symbol';
import { Layout } from '../../src/constants/Layout';
import { useAuth } from '../../src/context/AuthContext';
import { useResponsive } from '../../src/hooks/useResponsive';
import { useSettings } from '../../src/hooks/useSettings';

const COLORS = Layout.colors;
const { width } = Dimensions.get('window');

// Default avatar for users without profile picture
const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=2A9D8F&color=fff&size=200';

export default function SettingsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { moderateScale, verticalScale, containerPadding, contentContainerStyle, isTablet } = useResponsive();
  const { voiceButtonPosition, setVoiceButtonPosition } = useSettings();
  const { user, signOut, updateProfile } = useAuth();

  // Generate avatar URL - use Google photo, or generate one from user's name
  const getAvatarUrl = (avatarUrl: string | null | undefined, name: string | null | undefined, email: string | null | undefined) => {
    if (avatarUrl && avatarUrl.length > 0) {
      return avatarUrl;
    }
    // Generate avatar from name or email
    const displayName = name || email?.split('@')[0] || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2A9D8F&color=fff&size=200`;
  };

  // Get user data from auth context
  const [userProfile, setUserProfile] = useState(() => ({
    name: user?.fullName || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    avatar: getAvatarUrl(user?.avatarUrl, user?.fullName, user?.email),
  }));

  // Update local state when auth user changes
  useEffect(() => {
    if (user) {
      console.log('User data from auth:', {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        provider: user.provider,
      });
      
      setUserProfile({
        name: user.fullName || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: getAvatarUrl(user.avatarUrl, user.fullName, user.email),
      });
    }
  }, [user]);

  // Modal States
  const [modalVisible, setModalVisible] = useState<{
    type: 'profile' | 'password' | 'language' | 'avatar' | 'voicePosition' | 'logout' | null,
    isOpen: boolean
  }>({ type: null, isOpen: false });

  // Temp States for Forms
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempPassword, setTempPassword] = useState({ current: '', new: '', confirm: '' });
  
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // --- Handlers ---
  const handleEditProfile = () => {
    setTempName(userProfile.name);
    setModalVisible({ type: 'profile', isOpen: true });
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
    setModalVisible({ type: null, isOpen: false });
    toast.success(t('password.updated'));
  };

  const handleVoicePositionChange = async (position: 'left' | 'right') => {
    try {
      await setVoiceButtonPosition(position);
      setModalVisible({ type: null, isOpen: false });
      toast.success(t('settings.voicePositionSaved'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleLogout = async () => {
    setModalVisible({ type: null, isOpen: false });
    try {
      await signOut();
      toast.success(t('settings.loggedOut'));
      // NavigationGuard will automatically redirect to onboarding
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error(t('common.error'));
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({ fullName: tempName });
      setUserProfile(prev => ({ ...prev, name: tempName }));
      setModalVisible({ type: null, isOpen: false });
      toast.success(t('profile.saved'));
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(t('common.error'));
    }
  };

  const SettingSection = ({ title, children, index = 0 }: { title: string, children: React.ReactNode, index?: number }) => {
    return (
      <View style={[styles.section, { marginBottom: moderateScale(24) }]}>
        <Text style={[styles.sectionTitle, { fontSize: moderateScale(13), marginLeft: moderateScale(12), marginBottom: moderateScale(10) }]}>{title}</Text>
        <View style={[styles.sectionContent, { borderRadius: moderateScale(20) }]}>
          {children}
        </View>
      </View>
    );
  };

  const SettingItem = ({ 
    icon, 
    label, 
    value, 
    isSwitch, 
    onPress, 
    showChevron = true,
    textColor = COLORS.text,
    iconColor = COLORS.primary
  }: { 
    icon: IconSymbolName, 
    label: string, 
    value?: string | boolean, 
    isSwitch?: boolean, 
    onPress?: () => void,
    showChevron?: boolean,
    textColor?: string,
    iconColor?: string
  }) => (
    <TouchableOpacity 
      style={[styles.item, { padding: moderateScale(18) }]} 
      onPress={onPress}
      disabled={isSwitch}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { marginRight: moderateScale(12) }]}>
        <IconSymbol name={icon} size={moderateScale(24)} color={iconColor} />
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemLabel, { fontSize: moderateScale(16), color: textColor }]}>{label}</Text>
        <View style={[styles.itemRight, { gap: moderateScale(8) }]}>
           {value && typeof value === 'string' && (
             <Text style={[styles.itemValue, { fontSize: moderateScale(15) }]}>{value}</Text>
           )}
           {isSwitch && (
             <Switch 
                value={value as boolean} 
                onValueChange={onPress}
                trackColor={{ false: '#767577', true: COLORS.primary }}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
             />
           )}
           {showChevron && !isSwitch && (
             <IconSymbol name="chevron.right" size={moderateScale(20)} color={COLORS.subtext} />
           )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        contentContainerStyle={[
            styles.scrollContent, 
            { padding: containerPadding, paddingTop: moderateScale(10) }, 
            contentContainerStyle as any
        ]} 
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Layout.colors.primary]} />
        }
      >
        
                {/* Header Profile Card - Premium Design */}
        <View style={[styles.header, { marginBottom: moderateScale(24) }]}>
            <View 
              style={[styles.profileCard, { borderRadius: moderateScale(30) }]}
            >
               {/* Clean Premium Background - Only Glowing Orbs */}
               <View style={styles.cardMeshContainer}>
                  {/* Glowing orbs only for subtle premium effect */}
                  <View style={[styles.cardGlowOrb, styles.cardGlowOrb1]} />
                  <View style={[styles.cardGlowOrb, styles.cardGlowOrb2]} />
               </View>
               
               <View style={[styles.profileContent, { padding: moderateScale(24), paddingBottom: moderateScale(20) }]}>
                   <View style={[styles.avatarContainer, { marginRight: moderateScale(20) }]}>
                     <Image 
                        source={{ uri: userProfile.avatar }} 
                        style={[styles.avatar, { width: moderateScale(88), height: moderateScale(88), borderRadius: moderateScale(44), borderWidth: moderateScale(4) }]} 
                     />
                     <View style={styles.cameraBadgeContainer}>
                         <TouchableOpacity 
                             style={[styles.cameraBadge, { padding: moderateScale(8), borderRadius: moderateScale(20) }]} 
                             onPress={() => setModalVisible({ type: 'avatar', isOpen: true })} 
                             activeOpacity={0.8}
                         >
                            <IconSymbol name="camera.fill" size={moderateScale(14)} color={COLORS.primary} />
                         </TouchableOpacity>
                     </View>
                   </View>
                   
                   <View style={styles.userInfo}>
                      <View style={[styles.nameRow, { marginBottom: moderateScale(4) }]}>
                          <Text 
                            style={[styles.userName, { fontSize: moderateScale(20) }]} 
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {userProfile.name}
                          </Text>
                          <TouchableOpacity 
                              style={[styles.editNameButton, { padding: moderateScale(4), borderRadius: moderateScale(12), marginLeft: moderateScale(8) }]} 
                              onPress={handleEditProfile}
                              activeOpacity={0.6}
                          >
                              <IconSymbol name="pencil" size={moderateScale(14)} color="rgba(255,255,255,0.8)" />
                          </TouchableOpacity>
                      </View>
                      <Text 
                        style={[styles.userEmail, { fontSize: moderateScale(13), marginBottom: moderateScale(10) }]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {userProfile.email}
                      </Text>
                      
                      <View style={[styles.badgesRow, { gap: moderateScale(8) }]}>
                          <View style={[styles.premiumBadge, { paddingVertical: moderateScale(6), paddingHorizontal: moderateScale(12), borderRadius: moderateScale(20), gap: moderateScale(6) }]}>
                              <IconSymbol name="crown.fill" size={moderateScale(12)} color="#FFD700" />
                              <Text style={[styles.premiumText, { fontSize: moderateScale(12) }]}>{t('settings.goldMember')}</Text>
                          </View>
                      </View>
                   </View>
               </View>
            </View>
        </View>

        {/* Settings Sections */}
        <SettingSection title={t('settings.preferences')} index={0}>
          <SettingItem 
            icon="globe" 
            label={t('settings.language')} 
            value={i18n.language === 'id' ? 'Bahasa Indonesia' : 'English'} 
            onPress={() => setModalVisible({ type: 'language', isOpen: true })}
            iconColor="#3B82F6"
          />
          <View style={[styles.separator, { marginLeft: moderateScale(74) }]} />
          <SettingItem 
            icon="hand.point.up.left.fill" 
            label={t('settings.voiceButtonPosition')} 
            value={voiceButtonPosition === 'right' ? t('settings.right') : t('settings.left')} 
            onPress={() => setModalVisible({ type: 'voicePosition', isOpen: true })}
            iconColor="#10B981"
          />
        </SettingSection>

        <SettingSection title={t('settings.account')} index={1}>
           <SettingItem 
            icon="lock.fill" 
            label={t('settings.changePassword')}
            onPress={handleChangePassword}
            iconColor={COLORS.primary}
          />
           <View style={[styles.separator, { marginLeft: moderateScale(74) }]} />
           <SettingItem 
            icon="shield.fill" 
            label={t('settings.securityPrivacy')}
            onPress={() => router.push('/security-privacy')}
            iconColor={COLORS.primary}
          />
        </SettingSection>

        <SettingSection title={t('settings.support')} index={2}>
          <SettingItem 
            icon="questionmark.circle.fill" 
            label={t('settings.helpCenter')} 
            onPress={() => router.push('/help-center')}
            iconColor="#8B5CF6"
          />
           <View style={[styles.separator, { marginLeft: moderateScale(74) }]} />
           <SettingItem 
            icon="doc.text.fill" 
            label={t('settings.termsPolicy')} 
            onPress={() => router.push('/terms-policy')}
            iconColor="#8B5CF6"
          />
        </SettingSection>

        {/* Logout Button - Clean Design */}
        <View style={[styles.logoutSection, { marginTop: moderateScale(16), marginBottom: moderateScale(24) }]}>
           <TouchableOpacity 
              style={[styles.logoutButton, { 
                paddingVertical: moderateScale(16), 
                paddingHorizontal: moderateScale(20), 
                borderRadius: moderateScale(16),
              }]} 
              onPress={() => setModalVisible({ type: 'logout', isOpen: true })} 
              activeOpacity={0.7}
           >
              <IconSymbol name="rectangle.portrait.and.arrow.right.fill" size={moderateScale(20)} color={COLORS.danger} />
              <Text style={[styles.logoutText, { fontSize: moderateScale(15) }]}>{t('settings.logOut')}</Text>
           </TouchableOpacity>
        </View>
        
        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { fontSize: moderateScale(12) }]}>{t('settings.version')} 1.0.0</Text>
          <Text style={[styles.buildText, { fontSize: moderateScale(10) }]}>Build 124</Text>
        </View>
        
        {/* Extra padding for navbar - increased to prevent button from being hidden */}
        <View style={{ height: moderateScale(180) }} /> 
      </ScrollView>

      {/* --- Modals --- */}
      
      {/* Edit Profile Modal */}
      <AppModal
        visible={modalVisible.type === 'profile' && modalVisible.isOpen}
        title={t('profile.editProfile')}
        subtitle={t('profile.editProfileSubtitle')}
        onClose={() => setModalVisible({ type: null, isOpen: false })}
        onSave={handleSaveProfile}
        saveLabel={t('common.save')}
        headerIcon={<IconSymbol name="person.fill" size={moderateScale(32)} color={COLORS.primary} />}
      >
        <View style={[styles.inputContainer, { gap: moderateScale(20) }]}>
            <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { fontSize: moderateScale(14), marginBottom: moderateScale(8), marginLeft: moderateScale(4) }]}>{t('profile.fullName')}</Text>
                <View style={[styles.inputFieldContainer, { height: moderateScale(54), borderRadius: moderateScale(16), paddingHorizontal: moderateScale(16) }]}>
                    <IconSymbol name="person" size={moderateScale(20)} color={COLORS.subtext} style={{marginRight: moderateScale(10)}} />
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
                <Text style={[styles.inputLabel, { fontSize: moderateScale(14), marginBottom: moderateScale(8), marginLeft: moderateScale(4) }]}>{t('profile.email')}</Text>
                <View style={[styles.inputFieldContainer, { height: moderateScale(54), borderRadius: moderateScale(16), paddingHorizontal: moderateScale(16), backgroundColor: '#F3F4F6', borderColor: 'transparent' }]}>
                    <IconSymbol name="cube.box.fill" size={moderateScale(20)} color={COLORS.subtext} style={{marginRight: moderateScale(10)}} />
                    <TextInput
                    style={[styles.inputStyled, { fontSize: moderateScale(16), color: '#6B7280' }]}
                    value={userProfile.email}
                    editable={false}
                    />
                    <IconSymbol name="lock.fill" size={moderateScale(16)} color="#9CA3AF" />
                </View>
                <Text style={[styles.helperText, { fontSize: moderateScale(12), marginTop: moderateScale(6), marginLeft: moderateScale(4) }]}>{t('profile.emailHelper')}</Text>
            </View>
        </View>
      </AppModal>

      {/* Avatar Selection Modal */}
      <AppModal
        visible={modalVisible.type === 'avatar' && modalVisible.isOpen}
        title={t('profile.updatePhoto')}
        subtitle={t('profile.updatePhotoSubtitle')}
        onClose={() => setModalVisible({ type: null, isOpen: false })}
        headerIcon={<IconSymbol name="camera.fill" size={moderateScale(32)} color={COLORS.primary} />}
      >
        <View style={[styles.avatarGrid, { gap: moderateScale(16), marginBottom: moderateScale(24) }]}>
            {[
                'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
                'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80'
            ].map((uri, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={[styles.avatarOption, { width: moderateScale(80), height: moderateScale(80), borderRadius: moderateScale(40), padding: moderateScale(3), borderWidth: moderateScale(2) }, userProfile.avatar === uri && styles.avatarOptionSelected]}
                    onPress={async () => {
                        try {
                          await updateProfile({ avatarUrl: uri });
                          setUserProfile(p => ({ ...p, avatar: uri }));
                          setModalVisible({ type: null, isOpen: false });
                          toast.success(t('profile.photoUpdated'));
                        } catch (error) {
                          console.error('Error updating avatar:', error);
                          toast.error(t('common.error'));
                        }
                    }}
                    activeOpacity={0.7}
                >
                    <Image source={{ uri }} style={[styles.avatarThumb, { borderRadius: moderateScale(40) }]} />
                    {userProfile.avatar === uri && (
                        <View style={[styles.avatarCheck, { width: moderateScale(24), height: moderateScale(24), borderRadius: moderateScale(12), borderWidth: moderateScale(2) }]}>
                            <IconSymbol name="checkmark" size={moderateScale(12)} color="#FFF" />
                        </View>
                    )}
                </TouchableOpacity>
            ))}
        </View>
        <TouchableOpacity style={[styles.uploadButton, { paddingVertical: moderateScale(14), borderRadius: moderateScale(14) }]}>
            <Text style={[styles.uploadButtonText, { fontSize: moderateScale(14) }]}>{t('profile.chooseGallery')}</Text>
        </TouchableOpacity>
      </AppModal>

      {/* Change Password Modal */}
      <AppModal
        visible={modalVisible.type === 'password' && modalVisible.isOpen}
        title={t('password.title')}
        subtitle={t('password.subtitle')}
        onClose={() => setModalVisible({ type: null, isOpen: false })}
        onSave={handleSavePassword}
        saveLabel={t('password.update')}
        headerIcon={<IconSymbol name="lock.fill" size={moderateScale(32)} color={COLORS.primary} />}
      >
        <View style={[styles.inputContainer, { gap: moderateScale(20) }]}>
           <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { fontSize: moderateScale(14), marginBottom: moderateScale(8), marginLeft: moderateScale(4) }]}>{t('password.current')}</Text>
                <View style={[styles.inputFieldContainer, { height: moderateScale(54), borderRadius: moderateScale(16), paddingHorizontal: moderateScale(16) }]}>
                    <IconSymbol name="lock" size={moderateScale(20)} color={COLORS.subtext} style={{marginRight: moderateScale(10)}} />
                    <TextInput
                        style={[styles.inputStyled, { fontSize: moderateScale(16) }]}
                        value={tempPassword.current}
                        onChangeText={(text) => setTempPassword(prev => ({...prev, current: text}))}
                        placeholder={t('password.current')}
                        placeholderTextColor={COLORS.placeholder}
                        secureTextEntry
                    />
                </View>
           </View>
           <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { fontSize: moderateScale(14), marginBottom: moderateScale(8), marginLeft: moderateScale(4) }]}>{t('password.new')}</Text>
                <View style={[styles.inputFieldContainer, { height: moderateScale(54), borderRadius: moderateScale(16), paddingHorizontal: moderateScale(16) }]}>
                    <IconSymbol name="key" size={moderateScale(20)} color={COLORS.subtext} style={{marginRight: moderateScale(10)}} />
                    <TextInput
                        style={[styles.inputStyled, { fontSize: moderateScale(16) }]}
                        value={tempPassword.new}
                        onChangeText={(text) => setTempPassword(prev => ({...prev, new: text}))}
                        placeholder={t('password.new')}
                        placeholderTextColor={COLORS.placeholder}
                        secureTextEntry
                    />
                </View>
           </View>
           <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { fontSize: moderateScale(14), marginBottom: moderateScale(8), marginLeft: moderateScale(4) }]}>{t('password.confirm')}</Text>
                <View style={[styles.inputFieldContainer, { height: moderateScale(54), borderRadius: moderateScale(16), paddingHorizontal: moderateScale(16) }]}>
                    <IconSymbol name="key.fill" size={moderateScale(20)} color={COLORS.subtext} style={{marginRight: moderateScale(10)}} />
                    <TextInput
                        style={[styles.inputStyled, { fontSize: moderateScale(16) }]}
                        value={tempPassword.confirm}
                        onChangeText={(text) => setTempPassword(prev => ({...prev, confirm: text}))}
                        placeholder={t('password.confirm')}
                        placeholderTextColor={COLORS.placeholder}
                        secureTextEntry
                    />
                </View>
           </View>
        </View>
      </AppModal>

      {/* Language Selection Modal */}
      <AppModal
        visible={modalVisible.type === 'language' && modalVisible.isOpen}
        title={t('language.title')}
        subtitle={t('language.subtitle')}
        onClose={() => setModalVisible({ type: null, isOpen: false })}
        headerIcon={<IconSymbol name="globe" size={moderateScale(28)} color={COLORS.primary} />}
      >
        <View style={{ width: '100%', gap: moderateScale(10) }}>
           {[
             { code: 'en', label: 'English', flag: '🇺🇸' }, 
             { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' }
           ].map((lang) => (
             <TouchableOpacity 
                key={lang.code}
                style={[
                    styles.languageOption, 
                    { padding: moderateScale(16), borderRadius: moderateScale(12) },
                    i18n.language === lang.code && styles.languageOptionSelected
                ]}
                onPress={() => {
                    i18n.changeLanguage(lang.code);
                    setModalVisible({ type: null, isOpen: false });
                }}
                activeOpacity={0.7}
             >
                <View style={styles.languageRow}>
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[
                      styles.languageText,
                      { fontSize: moderateScale(16) },
                      i18n.language === lang.code && styles.languageTextSelected
                  ]}>{lang.label}</Text>
                </View>
                {i18n.language === lang.code && (
                    <IconSymbol name="checkmark.circle.fill" size={moderateScale(22)} color={COLORS.primary} />
                )}
             </TouchableOpacity>
           ))}
        </View>
      </AppModal>

      {/* Voice Button Position Modal */}
      <AppModal
        visible={modalVisible.type === 'voicePosition' && modalVisible.isOpen}
        title={t('settings.voiceButtonPosition')}
        subtitle={t('settings.voicePositionSubtitle')}
        onClose={() => setModalVisible({ type: null, isOpen: false })}
        headerIcon={<IconSymbol name="hand.point.up.left.fill" size={moderateScale(28)} color="#10B981" />}
      >
        <View style={{ width: '100%', gap: moderateScale(10) }}>
           {[
             { key: 'right' as const, label: t('settings.right'), emoji: '👉' },
             { key: 'left' as const, label: t('settings.left'), emoji: '👈' }
           ].map((option) => (
             <TouchableOpacity 
                key={option.key}
                style={[
                    styles.languageOption, 
                    { padding: moderateScale(16), borderRadius: moderateScale(12) },
                    voiceButtonPosition === option.key && styles.languageOptionSelected
                ]}
                onPress={() => handleVoicePositionChange(option.key)}
                activeOpacity={0.7}
             >
                <View style={styles.languageRow}>
                  <Text style={styles.languageFlag}>{option.emoji}</Text>
                  <View>
                    <Text style={[
                        styles.languageText,
                        { fontSize: moderateScale(16) },
                        voiceButtonPosition === option.key && styles.languageTextSelected
                    ]}>{option.label}</Text>
                    <Text style={[styles.positionDescription, { marginTop: moderateScale(2) }]}>
                      {option.key === 'right' ? t('settings.rightDescription') : t('settings.leftDescription')}
                    </Text>
                  </View>
                </View>
                {voiceButtonPosition === option.key && (
                    <IconSymbol name="checkmark.circle.fill" size={moderateScale(22)} color="#10B981" />
                )}
             </TouchableOpacity>
           ))}
        </View>
      </AppModal>

      {/* Logout Confirmation Modal */}
      <AppModal
        visible={modalVisible.type === 'logout' && modalVisible.isOpen}
        title={t('settings.logoutConfirmTitle')}
        subtitle={t('settings.logoutConfirmSubtitle')}
        onClose={() => setModalVisible({ type: null, isOpen: false })}
        onSave={handleLogout}
        saveLabel={t('settings.logOut')}
        variant="danger"
        headerIcon={<IconSymbol name="rectangle.portrait.and.arrow.right.fill" size={moderateScale(32)} color={COLORS.danger} />}
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
    // handled inline with scaled padding
  },
  header: {
    alignItems: 'center',
    width: '100%',
  },
  profileCard: {
    width: '100%',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
    position: 'relative',
  },
  cardMeshContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  cardGlowOrb: {
    position: 'absolute',
    borderRadius: 999,
  },
  cardGlowOrb1: {
    width: 90,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: -20,
    right: -20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 10,
  },
  cardGlowOrb2: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    bottom: -15,
    left: -15,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  profileContent: {
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cameraBadgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  cameraBadge: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0, // Important for text truncation to work in flex container
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
    flexShrink: 1, // Allow name to shrink if needed
  },
  editNameButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    flexShrink: 0, // Don't shrink the edit button
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    flexShrink: 1,
  },
  badgesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  premiumText: {
    color: '#FFD700',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  // Section Styles
  section: {
    // margins handled inline
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionContent: {
    backgroundColor: COLORS.card,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLabel: {
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    color: COLORS.subtext,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  
  // Logout Section - Premium Redesign
  logoutSection: {
    width: '100%',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: '600',
  },
  
  // Version Info
  versionContainer: {
    alignItems: 'center',
  },
  versionText: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  buildText: {
    color: '#D1D5DB',
    marginTop: 2,
  },
  
  // Input Modal Styles
  inputContainer: {
      width: '100%',
  },
  inputWrapper: {
      width: '100%',
  },
  inputLabel: {
    fontWeight: '600',
    color: '#374151',
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputStyled: {
      flex: 1,
      color: COLORS.text,
      height: '100%',
  },
  helperText: {
      color: '#9CA3AF',
  },
  
  // Avatar Selection Styles
  avatarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
  },
  avatarOption: {
      borderColor: 'transparent',
  },
  avatarOptionSelected: {
      borderColor: COLORS.primary,
  },
  avatarThumb: {
      width: '100%',
      height: '100%',
  },
  avatarCheck: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#FFF',
  },
  uploadButton: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F9FAFB',
  },
  uploadButtonText: {
      fontWeight: '600',
      color: COLORS.primary,
  },
  
  // Language Modal Styles
  languageOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: COLORS.border,
      backgroundColor: '#FFF',
  },
  languageOptionSelected: {
      borderColor: COLORS.primary,
      backgroundColor: COLORS.primary + '08',
  },
  languageRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  languageFlag: {
      fontSize: 24,
  },
  languageText: {
      color: COLORS.text,
      fontWeight: '500',
  },
  languageTextSelected: {
      color: COLORS.primary,
      fontWeight: '600',
  },
  
  // Voice Position Modal Styles - Uses languageOption styles for consistency
  positionDescription: {
      fontSize: 12,
      color: COLORS.subtext,
  },
});
