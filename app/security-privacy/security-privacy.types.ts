import { IconSymbolName } from '@/src/components/ui/icon-symbol';

export type SecurityItemProps = {
  icon: IconSymbolName;
  label: string;
  description?: string;
  isSwitch?: boolean;
  value?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  isDestructive?: boolean;
  iconColor?: string;
};

export type ModalType = 'clearHistory' | 'deleteAccount' | 'exportData' | 'appLock' | null;

export type ModalState = {
  type: ModalType;
  isOpen: boolean;
};

export type ExportFormat = 'pdf' | 'csv';

export type DateRange = '7days' | '30days' | 'all';

export type DateRangeOption = {
  key: DateRange;
  label: string;
};

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { key: '7days', label: '7 Hari' },
  { key: '30days', label: '30 Hari' },
  { key: 'all', label: 'Semua' },
];
