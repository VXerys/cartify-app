import { Layout } from '@/src/constants/Layout';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export { height, width };

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
  },
  meshGradient: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.6,
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 999,
  },

  // Top Left (Small Blue)
  meshGradient3: {
    width: width * 0.45,
    height: width * 0.45,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    position: 'absolute',
    top: height * 0.15,
    left: -width * 0.2,
  },
  glowOrb3: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    position: 'absolute',
    top: (height * 0.15) + (width * 0.225) - 40,
    left: (-width * 0.2) + (width * 0.225) - 40,
    shadowColor: '#3B82F6',
    shadowRadius: 30,
    elevation: 10,
  },

  // Top Right (Large Teal)
  meshGradient1: {
    width: width * 0.65,
    height: width * 0.65,
    backgroundColor: 'rgba(42, 157, 143, 0.12)',
    position: 'absolute',
    top: -width * 0.1,
    right: -width * 0.15,
  },
  glowOrb1: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(42, 157, 143, 0.3)',
    position: 'absolute',
    top: (width * 0.325) - 60 - (width * 0.1),
    right: (width * 0.325) - 60 - (width * 0.15),
    shadowColor: '#2A9D8F',
    shadowRadius: 60,
    elevation: 20,
  },

  // Bottom Left (Large Emerald)
  meshGradient2: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    position: 'absolute',
    bottom: -width * 0.15,
    left: -width * 0.2,
  },
  glowOrb2: {
    width: 130,
    height: 130,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    position: 'absolute',
    bottom: (width * 0.35) - 65 - (width * 0.15),
    left: (width * 0.35) - 65 - (width * 0.2),
    shadowColor: '#10B981',
    shadowRadius: 50,
    elevation: 15,
  },

  // Bottom Right (Medium Cyan)
  meshGradient4: {
    width: width * 0.55,
    height: width * 0.55,
    backgroundColor: 'rgba(45, 212, 191, 0.08)',
    position: 'absolute',
    bottom: height * 0.12,
    right: -width * 0.15,
  },
  glowOrb4: {
    width: 90,
    height: 90,
    backgroundColor: 'rgba(45, 212, 191, 0.2)',
    position: 'absolute',
    bottom: (height * 0.12) + (width * 0.275) - 45,
    right: (-width * 0.15) + (width * 0.275) - 45,
    shadowColor: '#2DD4BF',
    shadowRadius: 40,
    elevation: 12,
  },

  slideContainer: {
    width,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 40,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    width: width * 0.75,
    height: height * 0.45,
    backgroundColor: '#2A3444',
    borderRadius: 24,
    position: 'relative',
    overflow: 'visible',
    shadowColor: Layout.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
  },
  mockPhoneScreen: {
    flex: 1,
    backgroundColor: '#F8F0FF',
    borderRadius: 20,
    overflow: 'hidden',
    margin: 8,
  },
  mockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  mockTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mockTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  mockSignal: {
    width: 20,
    height: 10,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  mockContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  mockTitleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mockBackButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  mockScreenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  mockCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E0F0',
  },
  mockCategoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
  },
  mockCategoryText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  mockEditButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#E8E0F0',
    borderRadius: 12,
  },
  mockEditText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  floatingIcon: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingIcon1: {
    top: -15,
    left: -20,
  },
  floatingIcon2: {
    top: '40%',
    right: -25,
  },
  floatingIcon3: {
    bottom: 30,
    left: -15,
  },
  floatingIconInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#34C759',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 28,
    backgroundColor: Layout.colors.primary,
  },
  dotInactive: {
    width: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  getStartedButton: {
    backgroundColor: Layout.colors.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Layout.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
});
