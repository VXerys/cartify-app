import React, { useState } from 'react';
import {
  Image,
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

const COLORS = Layout.colors;

export default function SettingsScreen() {
  // --- State Management ---
  const [userProfile, setUserProfile] = useState({
    name: 'Rian Doel',
    email: 'rian.doel@cartify.com',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
  });

  const [settings, setSettings] = useState({
    darkMode: false,
    language: 'English',
  });

  // Modal States
  const [modalVisible, setModalVisible] = useState<{
    type: 'profile' | 'password' | 'language' | 'avatar' | null,
    isOpen: boolean
  }>({ type: null, isOpen: false });

  // Temp States for Forms
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempPassword, setTempPassword] = useState({ current: '', new: '', confirm: '' });

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

  const toggleSwitch = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- Components ---

  // 1. Customized Animated Interactable


  const SettingSection = ({ title, children, index = 0 }: { title: string, children: React.ReactNode, index?: number }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Animated.View 
        entering={FadeIn.delay(index * 150).duration(800)}
        style={styles.sectionContent}
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
      style={styles.item} 
      onPress={onPress}
      disabled={isSwitch}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <IconSymbol name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemLabel, { color: textColor }]}>{label}</Text>
        <View style={styles.itemRight}>
           {value && typeof value === 'string' && (
             <Text style={styles.itemValue}>{value}</Text>
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
             <IconSymbol name="chevron.right" size={20} color={COLORS.subtext} />
           )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Profile Card - Premium Design */}
        <View style={styles.header}>
            <Animated.View 
              entering={FadeIn.duration(1000)}
              style={styles.profileCard}
            >
               {/* Decorative Background Elements */}
               <View style={styles.decorativeCircle1} />
               <View style={styles.decorativeCircle2} />
               
              <View style={styles.profileContent}>
                  <View style={styles.avatarContainer}>
                    <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
                    <View style={styles.cameraBadgeContainer}>
                        <TouchableOpacity 
                            style={styles.cameraBadge} 
                            onPress={() => setModalVisible({ type: 'avatar', isOpen: true })} 
                            activeOpacity={0.8}
                        >
                           <IconSymbol name="camera.fill" size={14} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.userInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.userName}>{userProfile.name}</Text>
                        <TouchableOpacity 
                            style={styles.editNameButton} 
                            onPress={handleEditProfile}
                            activeOpacity={0.6}
                        >
                            <IconSymbol name="pencil" size={14} color="rgba(255,255,255,0.8)" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userEmail}>{userProfile.email}</Text>
                    
                    <View style={styles.badgesRow}>
                        <View style={styles.premiumBadge}>
                            <IconSymbol name="crown.fill" size={12} color="#FFD700" />
                            <Text style={styles.premiumText}>Gold Member</Text>
                        </View>
                    </View>
                  </View>
              </View>
            </Animated.View>
        </View>

        {/* Settings Sections */}
        <SettingSection title="Preferences" index={1}>
          <SettingItem 
            icon="moon.fill" 
            label="Dark Mode" 
            value={settings.darkMode} 
            isSwitch 
            onPress={() => toggleSwitch('darkMode')} 
            iconColor="#6366F1"
          />
          <View style={styles.separator} />
          <SettingItem 
            icon="globe" 
            label="Language" 
            value={settings.language} 
            onPress={() => setModalVisible({ type: 'language', isOpen: true })}
            iconColor="#3B82F6"
          />
        </SettingSection>

        <SettingSection title="Account" index={2}>
           <SettingItem 
            icon="lock.fill" 
            label="Change Password" 
            onPress={handleChangePassword}
            iconColor={COLORS.primary}
          />
           <View style={styles.separator} />
           <SettingItem 
            icon="shield.fill" 
            label="Security & Privacy" 
            onPress={() => {}}
            iconColor={COLORS.primary}
          />
        </SettingSection>

        <SettingSection title="Support" index={3}>
          <SettingItem 
            icon="questionmark.circle.fill" 
            label="Help Center" 
            onPress={() => {}}
            iconColor="#8B5CF6"
          />
           <View style={styles.separator} />
           <SettingItem 
            icon="doc.text.fill" 
            label="Terms & Policy" 
            onPress={() => {}}
            iconColor="#8B5CF6"
          />
        </SettingSection>

        <Animated.View 
          entering={FadeIn.delay(400).duration(600)} 
          style={styles.logoutSection}
        >
           <TouchableOpacity style={styles.logoutButton} onPress={() => {}} activeOpacity={0.7}>
              <IconSymbol name="arrow.right.square.fill" size={20} color={COLORS.danger} />
              <Text style={styles.logoutText}>Log Out</Text>
           </TouchableOpacity>
           <Text style={styles.versionText}>Version 1.0.0 (Build 124)</Text>
        </Animated.View>
        
        <View style={{ height: 100 }} /> 
      </ScrollView>

      {/* --- Modals --- */}
      
      {/* Edit Profile Modal - Enhanced */}
      <AppModal
        visible={modalVisible.type === 'profile' && modalVisible.isOpen}
        title="Edit Profile"
        subtitle="Update your personal details visible to others."
        onClose={() => setModalVisible({ type: null, isOpen: false })}
        onSave={handleSaveProfile}
        saveLabel="Save Changes"
        headerIcon={<IconSymbol name="person.fill" size={32} color={COLORS.primary} />}
      >
        <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputFieldContainer}>
                    <IconSymbol name="person" size={20} color={COLORS.subtext} style={{marginRight: 10}} />
                    <TextInput
                    style={styles.inputStyled}
                    value={tempName}
                    onChangeText={setTempName}
                    placeholder="Enter your name"
                    placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[styles.inputFieldContainer, { backgroundColor: '#F3F4F6', borderColor: 'transparent' }]}>
                    <IconSymbol name="cube.box.fill" size={20} color={COLORS.subtext} style={{marginRight: 10}} />
                    <TextInput
                    style={[styles.inputStyled, { color: '#6B7280' }]}
                    value={userProfile.email}
                    editable={false}
                    />
                    <IconSymbol name="lock.fill" size={16} color="#9CA3AF" />
                </View>
                <Text style={styles.helperText}>Email cannot be changed manually.</Text>
            </View>
        </View>
      </AppModal>

      {/* Avatar Selection Modal */}
      <AppModal
        visible={modalVisible.type === 'avatar' && modalVisible.isOpen}
        title="Update Photo"
        subtitle="Choose a new profile picture."
        onClose={() => setModalVisible({ type: null, isOpen: false })}
        headerIcon={<IconSymbol name="camera.fill" size={32} color={COLORS.primary} />}
        saveLabel="Cancel" // Hiding the main save for this demo-like selection
        onSave={() => setModalVisible({ type: null, isOpen: false })} 
      >
        <View style={styles.avatarGrid}>
            {[
                'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
                'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80'
            ].map((uri, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={[styles.avatarOption, userProfile.avatar === uri && styles.avatarOptionSelected]}
                    onPress={() => {
                        setUserProfile(p => ({ ...p, avatar: uri }));
                        setModalVisible({ type: null, isOpen: false });
                    }}
                >
                    <Image source={{ uri }} style={styles.avatarThumb} />
                    {userProfile.avatar === uri && (
                        <View style={styles.avatarCheck}>
                            <IconSymbol name="checkmark" size={12} color="#FFF" />
                        </View>
                    )}
                </TouchableOpacity>
            ))}
        </View>
        <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </AppModal>

      {/* Change Password Modal */}
      <AppModal
        visible={modalVisible.type === 'password' && modalVisible.isOpen}
        title="Change Password"
        subtitle="Ensure your account stays secure."
        onClose={() => setModalVisible({ type: null, isOpen: false })}
        onSave={handleSavePassword}
        saveLabel="Update Password"
        headerIcon={<IconSymbol name="lock.fill" size={32} color={COLORS.primary} />}
      >
        <View style={styles.inputContainer}>
           <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <View style={styles.inputFieldContainer}>
                    <IconSymbol name="lock" size={20} color={COLORS.subtext} style={{marginRight: 10}} />
                    <TextInput
                        style={styles.inputStyled}
                        value={tempPassword.current}
                        onChangeText={(text) => setTempPassword(prev => ({...prev, current: text}))}
                        placeholder="Enter current password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                    />
                </View>
           </View>
           <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={styles.inputFieldContainer}>
                    <IconSymbol name="key" size={20} color={COLORS.subtext} style={{marginRight: 10}} />
                    <TextInput
                        style={styles.inputStyled}
                        value={tempPassword.new}
                        onChangeText={(text) => setTempPassword(prev => ({...prev, new: text}))}
                        placeholder="Enter new password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                    />
                </View>
           </View>
           <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputFieldContainer}>
                    <IconSymbol name="key.fill" size={20} color={COLORS.subtext} style={{marginRight: 10}} />
                    <TextInput
                        style={styles.inputStyled}
                        value={tempPassword.confirm}
                        onChangeText={(text) => setTempPassword(prev => ({...prev, confirm: text}))}
                        placeholder="Confirm new password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                    />
                </View>
           </View>
        </View>
      </AppModal>

      {/* Language Selection Modal */}
      <AppModal
        visible={modalVisible.type === 'language' && modalVisible.isOpen}
        title="Select Language"
        subtitle="Choose your preferred language."
        onClose={() => setModalVisible({ type: null, isOpen: false })}
        headerIcon={<IconSymbol name="globe" size={28} color={COLORS.primary} />}
        saveLabel="Cancel"
        onSave={() => setModalVisible({ type: null, isOpen: false })}
      >
        <View style={{ width: '100%', gap: 10 }}>
           {['English', 'Bahasa Indonesia', 'Español'].map((lang) => (
             <TouchableOpacity 
                key={lang}
                style={[
                    styles.languageOption, 
                    settings.language === lang && styles.languageOptionSelected
                ]}
                onPress={() => {
                    setSettings(s => ({ ...s, language: lang }));
                    setModalVisible({ type: null, isOpen: false });
                }}
             >
                <Text style={[
                    styles.languageText,
                    settings.language === lang && styles.languageTextSelected
                ]}>{lang}</Text>
                {settings.language === lang && (
                    <IconSymbol name="checkmark" size={20} color={COLORS.primary} />
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
    padding: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  profileCard: {
    borderRadius: 30,
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
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ scale: 1.2 }],
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 24,
      paddingBottom: 20,
      zIndex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cameraBadgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  cameraBadge: {
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  userInfo: {
    flex: 1,
    height: 88,
    justifyContent: 'center',
    paddingLeft: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  editNameButton: {
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 10,
  },
  badgesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  premiumText: {
    color: '#FFD700',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  
  // New Modal Styles
  inputContainer: {
      width: '100%',
      gap: 20,
  },
  inputWrapper: {
      width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54, // Taller touch target
  },
  inputStyled: {
      flex: 1,
      fontSize: 16,
      color: COLORS.text,
      height: '100%',
  },
  helperText: {
      fontSize: 12,
      color: '#9CA3AF',
      marginTop: 6,
      marginLeft: 4,
  },
  
  // Avatar Selection Styles
  avatarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 16,
      marginBottom: 24,
  },
  avatarOption: {
      width: 80,
      height: 80,
      borderRadius: 40,
      padding: 3,
      borderWidth: 2,
      borderColor: 'transparent',
  },
  avatarOptionSelected: {
      borderColor: COLORS.primary,
  },
  avatarThumb: {
      width: '100%',
      height: '100%',
      borderRadius: 40,
  },
  avatarCheck: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: COLORS.primary,
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#FFF',
  },
  uploadButton: {
      width: '100%',
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F9FAFB',
  },
  uploadButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.primary,
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 12,
    letterSpacing: 0.8,
  },
  sectionContent: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
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
    padding: 18,
  },
  iconContainer: {
    marginRight: 12,
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
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemValue: {
    fontSize: 15,
    color: COLORS.subtext,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 74,
  },
  logoutSection: {
    marginTop: 8,
    alignItems: 'center',
    gap: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: '700',
    fontSize: 16,
  },
  versionText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
  },
  
  // Language Modal Styles
  languageOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.border,
  },
  languageOptionSelected: {
      borderColor: COLORS.primary,
      backgroundColor: COLORS.primary + '08',
  },
  languageText: {
      fontSize: 16,
      color: COLORS.text,
  },
  languageTextSelected: {
      color: COLORS.primary,
      fontWeight: '600',
  },
});
