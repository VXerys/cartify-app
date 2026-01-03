// Data untuk onboarding slides
export interface OnboardingSlide {
  id: string;
  title: string;
  titleKey: string; // untuk i18n nanti
  description: string;
  descriptionKey: string;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'A Simple way to control your finances',
    titleKey: 'onboarding.slide1.title',
    description: 'Track all your shopping expenses with ease using voice commands',
    descriptionKey: 'onboarding.slide1.description',
  },
  {
    id: '2',
    title: 'Smart Voice Shopping Assistant',
    titleKey: 'onboarding.slide2.title',
    description: 'Just speak what you buy and let AI organize everything for you',
    descriptionKey: 'onboarding.slide2.description',
  },
  {
    id: '3',
    title: 'Set Budget & Stay on Track',
    titleKey: 'onboarding.slide3.title',
    description: 'Never overspend again with our smart budget tracking features',
    descriptionKey: 'onboarding.slide3.description',
  },
];
