import { OnboardingSlide } from './OnboardingData';

export interface OnboardingScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export interface SlideItemProps {
  item: OnboardingSlide;
  index: number;
  scrollX: { value: number };
}

export interface PaginationProps {
  data: OnboardingSlide[];
  currentIndex: number;
}
