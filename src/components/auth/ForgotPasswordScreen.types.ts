export interface ForgotPasswordScreenProps {
  onSendReset: (email: string) => void;
  onBackToLogin: () => void;
  isLoading?: boolean;
}
