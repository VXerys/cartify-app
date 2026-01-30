import { IconSymbolName } from '@/src/components/ui/icon-symbol';

export type ModalType = 'profile' | 'password' | 'language' | 'avatar' | 'voicePosition' | 'logout' | null;

export type ModalState = {
  type: ModalType;
  isOpen: boolean;
};

export type PasswordState = {
  current: string;
  new: string;
  confirm: string;
};

export type UserProfile = {
  name: string;
  email: string;
  avatar: string;
};

export type SettingItemProps = {
  icon: IconSymbolName;
  label: string;
  value?: string | boolean;
  isSwitch?: boolean;
  onPress?: () => void;
  showChevron?: boolean;
  textColor?: string;
  iconColor?: string;
  moderateScale: (size: number) => number;
  testID?: string;
  accessibilityLabel?: string;
};

export type SettingSectionProps = {
  title: string;
  children: React.ReactNode;
  index?: number;
  moderateScale: (size: number) => number;
};

// Default avatar for users without profile picture
export const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=2A9D8F&color=fff&size=200';

// Avatar options for selection
export const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
];

export const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
];

export const VOICE_POSITION_OPTIONS = [
  { key: 'right' as const, emoji: '👉' },
  { key: 'left' as const, emoji: '👈' },
];
