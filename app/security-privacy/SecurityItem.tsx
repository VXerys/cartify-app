import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Layout } from '@/src/constants/Layout';
import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './security-privacy.styles';
import { SecurityItemProps } from './security-privacy.types';

const COLORS = Layout.colors;

export const SecurityItem: React.FC<SecurityItemProps> = ({
  icon,
  label,
  description,
  isSwitch,
  value,
  onToggle,
  onPress,
  isDestructive,
  iconColor = COLORS.primary,
}) => (
  <TouchableOpacity
    style={styles.item}
    onPress={onPress}
    disabled={isSwitch}
    activeOpacity={0.7}
  >
    <View style={[styles.iconContainer, { backgroundColor: isDestructive ? '#FEE2E2' : iconColor + '15' }]}>
      <IconSymbol name={icon} size={22} color={isDestructive ? COLORS.danger : iconColor} />
    </View>
    <View style={styles.itemContent}>
      <View style={styles.textContainer}>
        <Text style={[styles.itemLabel, isDestructive && { color: COLORS.danger }]}>{label}</Text>
        {description && <Text style={styles.itemDescription}>{description}</Text>}
      </View>

      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: COLORS.primary }}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      ) : (
        !isDestructive && <IconSymbol name="chevron.right" size={20} color={COLORS.subtext} />
      )}
    </View>
  </TouchableOpacity>
);
