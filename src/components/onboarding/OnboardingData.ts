import { ImageSourcePropType } from 'react-native';

// Data untuk onboarding slides
export interface OnboardingSlide {
  id: string;
  title: string;
  titleKey: string; // untuk i18n nanti
  description: string;
  descriptionKey: string;
  image: ImageSourcePropType;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Manage Your Budget With Voice Commands',
    titleKey: 'onboarding.slide1.title',
    description: 'Track all your shopping expenses with ease using voice commands',
    descriptionKey: 'onboarding.slide1.description',
    image: require('../../../assets/images/onboarding/onboarding-1-fix.png'),
  },
  {
    id: '2',
    title: 'Track Your Shopping History With Ease',
    titleKey: 'onboarding.slide2.title',
    description: 'Just speak what you buy and let AI organize everything for you',
    descriptionKey: 'onboarding.slide2.description',
    image: require('../../../assets/images/onboarding/onboarding-2-fix.png'),
  },
  {
    id: '3',
    title: 'See Full Details Of Every Purchase',
    titleKey: 'onboarding.slide3.title',
    description: 'Never overspend again with our smart budget tracking features',
    descriptionKey: 'onboarding.slide3.description',
    image: require('../../../assets/images/onboarding/onboarding-3-fix.png'),
  },
];
