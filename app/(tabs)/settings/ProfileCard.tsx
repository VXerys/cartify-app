import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Layout } from '@/src/constants/Layout';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './settings.styles';
import { UserProfile } from './settings.types';

const COLORS = Layout.colors;

interface ProfileCardProps {
  userProfile: UserProfile;
  onEditProfile: () => void;
  onEditAvatar: () => void;
  moderateScale: (size: number) => number;
  goldMemberLabel: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  userProfile,
  onEditProfile,
  onEditAvatar,
  moderateScale,
  goldMemberLabel,
}) => {
  return (
    <View style={[styles.header, { marginBottom: moderateScale(24) }]}>
      <View style={[styles.profileCard, { borderRadius: moderateScale(30) }]}>
        {/* Clean Premium Background - Only Glowing Orbs */}
        <View style={styles.cardMeshContainer}>
          {/* Grid Pattern Overlay */}
          <View style={styles.cardGridPattern}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLine, styles.gridHorizontal, { top: `${(i + 1) * 25}%` }]} />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLine, styles.gridVertical, { left: `${(i + 1) * 20}%` }]} />
            ))}
          </View>

          {/* Glowing orbs */}
          <View style={[styles.cardGlowOrb, styles.cardGlowOrb1]} />
          <View style={[styles.cardGlowOrb, styles.cardGlowOrb2]} />
        </View>

        <View style={[styles.profileContent, { padding: moderateScale(24), paddingBottom: moderateScale(20) }]}>
          <View style={[styles.avatarContainer, { marginRight: moderateScale(20) }]}>
            <Image
              source={{ uri: userProfile.avatar }}
              style={[
                styles.avatar,
                {
                  width: moderateScale(88),
                  height: moderateScale(88),
                  borderRadius: moderateScale(44),
                  borderWidth: moderateScale(4),
                },
              ]}
            />
            <View style={styles.cameraBadgeContainer}>
              <TouchableOpacity
                style={[styles.cameraBadge, { padding: moderateScale(8), borderRadius: moderateScale(20) }]}
                onPress={onEditAvatar}
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
                style={[
                  styles.editNameButton,
                  { padding: moderateScale(4), borderRadius: moderateScale(12), marginLeft: moderateScale(8) },
                ]}
                onPress={onEditProfile}
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
              <View
                style={[
                  styles.premiumBadge,
                  {
                    paddingVertical: moderateScale(6),
                    paddingHorizontal: moderateScale(12),
                    borderRadius: moderateScale(20),
                    gap: moderateScale(6),
                  },
                ]}
              >
                <IconSymbol name="crown.fill" size={moderateScale(12)} color="#FFD700" />
                <Text style={[styles.premiumText, { fontSize: moderateScale(12) }]}>{goldMemberLabel}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
