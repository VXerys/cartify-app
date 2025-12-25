import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
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
import Animated, {
    FadeIn
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppModal } from '../../src/components/ui/AppModal';
import { IconSymbol, IconSymbolName } from '../../src/components/ui/icon-symbol';
import { Layout } from '../../src/constants/Layout';
import { useResponsive } from '../../src/hooks/useResponsive';

const COLORS = Layout.colors;

export default function SettingsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { moderateScale, verticalScale, containerPadding, contentContainerStyle, isTablet } = useResponsive();

  const [userProfile, setUserProfile] = useState({
    name: 'Rian Doel',
    email: 'rian.doel@cartify.com',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
  });

  // Modal States
  const [modalVisible, setModalVisible] = useState<{
    type: 'profile' | 'password' | 'language' | 'avatar' | null,
    isOpen: boolean
  }>({ type: null, isOpen: false });

  // Temp States for Forms
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempPassword, setTempPassword] = useState({ current: '', new: '', confirm: '' });
  
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh for settings (since it's mostly local or mockup data)
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // --- Handlers ---
  const handleEditProfile = () => {
    setTempName(userProfile.name);
    setModalVisible({ type: 'profile', isOpen: true });
  };

  const handleSaveProfile = () => {
    setUserProfile(prev => ({ ...prev, name: tempName }));
    setModalVisible({ type: null, isOpen: false });
  };

  const handleChangePassword = () => {
    setTempPassword({ current: '', new: '', confirm: '' });
    setModalVisible({ type: 'password', isOpen: true });
  };

  const handleSavePassword = () => {
    // Implement validation logic here
    setModalVisible({ type: null, isOpen: false });
  };

  const SettingSection = ({ title, children, index = 0 }: { title: string, children: React.ReactNode, index?: number }) => (
    <View style={[styles.section, { marginBottom: moderateScale(24) }]}>
      <Text style={[styles.sectionTitle, { fontSize: moderateScale(13), marginLeft: moderateScale(12), marginBottom: moderateScale(10) }]}>{title}</Text>
      <Animated.View 
        entering={FadeIn.delay(index * 150).duration(800)}
        style={[styles.sectionContent, { borderRadius: moderateScale(20) }]}
      >
        {children}
      </Animated.View>
    </View>
  );

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
            <Animated.View 
              entering={FadeIn.duration(1000)}
              style={[styles.profileCard, { borderRadius: moderateScale(30) }]}
            >
               {/* Decorative Background Elements */}
               <View style={[styles.decorativeCircle1, { width: moderateScale(200), height: moderateScale(200), borderRadius: moderateScale(100), top: moderateScale(-60), right: moderateScale(-60) }]} />
               <View style={[styles.decorativeCircle2, { width: moderateScale(240), height: moderateScale(240), borderRadius: moderateScale(120), bottom: moderateScale(-40), left: moderateScale(-80) }]} />
               
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
                   
                   <View style={[styles.userInfo, { height: moderateScale(88), paddingLeft: moderateScale(4) }]}>
                     <View style={[styles.nameRow, { marginBottom: moderateScale(4), gap: moderateScale(8) }]}>
                         <Text style={[styles.userName, { fontSize: moderateScale(24) }]}>{userProfile.name}</Text>
                         <TouchableOpacity 
                             style={[styles.editNameButton, { padding: moderateScale(4), borderRadius: moderateScale(12) }]} 
                             onPress={handleEditProfile}
                             activeOpacity={0.6}
                         >
                             <IconSymbol name="pencil" size={moderateScale(14)} color="rgba(255,255,255,0.8)" />
                         </TouchableOpacity>
                     </View>
                     <Text style={[styles.userEmail, { fontSize: moderateScale(14), marginBottom: moderateScale(10) }]}>{userProfile.email}</Text>
                     
                     <View style={[styles.badgesRow, { gap: moderateScale(8) }]}>
                         <View style={[styles.premiumBadge, { paddingVertical: moderateScale(6), paddingHorizontal: moderateScale(12), borderRadius: moderateScale(20), gap: moderateScale(6) }]}>
                             <IconSymbol name="crown.fill" size={moderateScale(12)} color="#FFD700" />
                             <Text style={[styles.premiumText, { fontSize: moderateScale(12) }]}>{t('settings.goldMember')}</Text>
                         </View>
                     </View>
                   </View>
               </View>
            </Animated.View>
        </View>

        {/* Settings Sections */}
        <SettingSection title={t('settings.preferences')} index={1}>
          <SettingItem 
            icon="globe" 
            label={t('settings.language')} 
            value={i18n.language === 'id' ? 'Bahasa Indonesia' : 'English'} 
            onPress={() => setModalVisible({ type: 'language', isOpen: true })}
            iconColor="#3B82F6"
          />
        </SettingSection>

        <SettingSection title={t('settings.account')} index={2}>
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

        <SettingSection title={t('settings.support')} index={3}>
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

        <Animated.View 
          entering={FadeIn.delay(400).duration(600)} 
          style={[styles.logoutSection, { marginTop: moderateScale(8), gap: moderateScale(20) }]}
        >
           <TouchableOpacity 
              style={[styles.logoutButton, { paddingVertical: moderateScale(16), paddingHorizontal: moderateScale(32), borderRadius: moderateScale(16), gap: moderateScale(10) }]} 
              onPress={() => {}} 
              activeOpacity={0.7}
           >
              <IconSymbol name="arrow.right.square.fill" size={moderateScale(20)} color={COLORS.danger} />
              <Text style={[styles.logoutText, { fontSize: moderateScale(16) }]}>{t('settings.logOut')}</Text>
           </TouchableOpacity>
           <Text style={[styles.versionText, { fontSize: moderateScale(13) }]}>{t('settings.version')} 1.0.0 (Build 124)</Text>
        </Animated.View>
        
        <View style={{ height: moderateScale(100) }} /> 
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
        // Removed unnecessary save button for selection
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
                    onPress={() => {
                        setUserProfile(p => ({ ...p, avatar: uri }));
                        setModalVisible({ type: null, isOpen: false });
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
        // Removed duplicate cancel button
      >
        <View style={{ width: '100%', gap: moderateScale(10) }}>
           {[
             { code: 'en', label: 'English' }, 
             { code: 'id', label: 'Bahasa Indonesia' }
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
                <Text style={[
                    styles.languageText,
                    { fontSize: moderateScale(16) },
                    i18n.language === lang.code && styles.languageTextSelected
                ]}>{lang.label}</Text>
                {i18n.language === lang.code && (
                    <IconSymbol name="checkmark" size={moderateScale(20)} color={COLORS.primary} />
                )}
             </TouchableOpacity>
           ))}
        </View>
      </AppModal>

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
  decorativeCircle1: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ scale: 1.2 }],
  },
  decorativeCircle2: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  editNameButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
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
  
  // New Modal Styles
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
  logoutSection: {
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: '700',
  },
  versionText: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  
  // Language Modal Styles
  languageOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: COLORS.border,
  },
  languageOptionSelected: {
      borderColor: COLORS.primary,
      backgroundColor: COLORS.primary + '08',
  },
  languageText: {
      color: COLORS.text,
  },
  languageTextSelected: {
      color: COLORS.primary,
      fontWeight: '600',
  },
});
