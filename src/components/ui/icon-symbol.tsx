// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'fork.knife': 'restaurant',
  'cup.and.saucer.fill': 'local-cafe',
  'leaf.fill': 'eco',
  'tshirt.fill': 'checkroom',
  'bolt.fill': 'bolt',
  'tag.fill': 'local-offer',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'wallet.pass.fill': 'account-balance-wallet',
  'cart.fill': 'shopping-cart',
  'cube.box.fill': 'inbox',
  'banknote.fill': 'attach-money',
  'clock.fill': 'history',
  'clock': 'schedule', // Outline clock
  'person.fill': 'person',
  'person': 'person-outline', // Outline person
  'mic.fill': 'mic',
  'waveform': 'graphic-eq',
  'plus': 'add', // For the custom button
  'minus': 'remove',
  'plus.circle.fill': 'add-circle',
  'minus.circle.fill': 'remove-circle',
  'trash.fill': 'delete',
  'home.fill': 'home',
  'house.fill': 'home',
  'bell.fill': 'notifications',
  'pencil': 'edit',
  'xmark': 'close',
  'bag.fill': 'shopping-bag',
  'slider.horizontal.3': 'tune',
  'house': 'home',
  'chevron.left': 'chevron-left',
  'calendar': 'calendar-today',
  'xmark.circle.fill': 'cancel',
  'list.bullet': 'format-list-bulleted',
  'checkmark': 'check',
  'checkmark.circle.fill': 'check-circle',
  'arrow.clockwise': 'refresh',
  'moon.fill': 'nightlight-round',
  'globe': 'language',
  'lock.fill': 'lock',
  'questionmark.circle.fill': 'help',
  'doc.text.fill': 'description',
  'arrow.right.square.fill': 'logout',
  'camera.fill': 'camera-alt',
  'shield.fill': 'security',
  'crown.fill': 'workspace-premium',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
