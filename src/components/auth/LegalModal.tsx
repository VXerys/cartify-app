import { Layout } from '@/src/constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type LegalType = 'terms' | 'privacy';

interface LegalModalProps {
  visible: boolean;
  type: LegalType;
  onClose: () => void;
}

// Terms of Service Content
const TERMS_CONTENT = `Last updated: January 2026

1. ACCEPTANCE OF TERMS

By using Cartify, you agree to these Terms of Service. If you do not agree, please do not use the app.

2. DESCRIPTION OF SERVICE

Cartify is a smart shopping companion that helps you:
• Manage shopping lists with voice input
• Track your shopping expenses
• Organize receipts and transactions
• Get personalized shopping insights

3. USER ACCOUNTS

You are responsible for maintaining the security of your account and all activities under it. Please use a strong password and keep it confidential.

4. USER CONDUCT

You agree not to:
• Use the app for illegal purposes
• Attempt unauthorized access to our systems
• Upload malicious content
• Impersonate others

5. INTELLECTUAL PROPERTY

All content and features of Cartify are our exclusive property and protected by intellectual property laws.

6. LIMITATION OF LIABILITY

Cartify is provided "as is" without warranties. We are not liable for any indirect damages arising from your use of the app.

7. TERMINATION

We may terminate your access if you violate these terms. You may also delete your account at any time.

8. CONTACT

Questions? Email us at legal@cartify.app`;

// Privacy Policy Content
const PRIVACY_CONTENT = `Last updated: January 2026

1. INFORMATION WE COLLECT

Personal Information:
• Name and email address
• Profile photo (optional)

Usage Information:
• Shopping lists and items
• Transaction history
• App preferences

2. HOW WE USE YOUR DATA

We use your information to:
• Provide and improve our services
• Process your transactions
• Send important updates
• Personalize your experience
• Ensure security

3. DATA SHARING

We do NOT sell your data. We only share information:
• With your consent
• To comply with legal requirements
• With trusted service providers

4. DATA SECURITY

We protect your data with:
• Encryption in transit and at rest
• Regular security audits
• Access controls
• Secure data centers

5. YOUR RIGHTS

You can:
• Access your personal data
• Correct inaccurate information
• Delete your account and data
• Export your data
• Opt-out of marketing

6. DATA RETENTION

We keep your data as long as your account is active. After deletion, data is removed within 30 days.

7. CHILDREN'S PRIVACY

Cartify is not intended for children under 13. We do not knowingly collect their information.

8. CONTACT US

Privacy questions? Email privacy@cartify.app`;

export const LegalModal: React.FC<LegalModalProps> = ({
  visible,
  type,
  onClose,
}) => {
  const isTerms = type === 'terms';
  const title = isTerms ? 'Terms of Service' : 'Privacy Policy';
  const content = isTerms ? TERMS_CONTENT : PRIVACY_CONTENT;
  const icon = isTerms ? 'document-text-outline' : 'shield-checkmark-outline';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name={icon as any} size={22} color={Layout.colors.primary} />
            <Text style={styles.title}>{title}</Text>
          </View>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <Text style={styles.content}>{content}</Text>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.doneButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  content: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  footer: {
    padding: 20,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  doneButton: {
    backgroundColor: Layout.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
