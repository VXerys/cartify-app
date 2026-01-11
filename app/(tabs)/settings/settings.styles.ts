import { Layout } from '@/src/constants/Layout';
import { StyleSheet } from 'react-native';

const COLORS = Layout.colors;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {},
  header: {
    alignItems: 'center',
    width: '100%',
  },
  profileCard: {
    width: '100%',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
    position: 'relative',
  },
  cardMeshContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  cardGridPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.06,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  gridVertical: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  gridHorizontal: {
    left: 0,
    right: 0,
    height: 1,
  },
  cardGlowOrb: {
    position: 'absolute',
    borderRadius: 999,
  },
  cardGlowOrb1: {
    width: 90,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: -20,
    right: -20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 10,
  },
  cardGlowOrb2: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    bottom: -15,
    left: -15,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cameraBadgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  cameraBadge: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  editNameButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    flexShrink: 0,
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    flexShrink: 1,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  premiumText: {
    color: '#FFD700',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  section: {},
  sectionTitle: {
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionContent: {
    backgroundColor: COLORS.card,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLabel: {
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    color: COLORS.subtext,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  logoutTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    width: '100%',
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionText: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  buildText: {
    color: '#D1D5DB',
    marginTop: 2,
  },
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    width: '100%',
  },
  inputLabel: {
    fontWeight: '600',
    color: '#374151',
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputStyled: {
    flex: 1,
    color: COLORS.text,
    height: '100%',
  },
  helperText: {
    color: '#9CA3AF',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatarOption: {
    borderColor: 'transparent',
  },
  avatarOptionSelected: {
    borderColor: COLORS.primary,
  },
  avatarThumb: {
    width: '100%',
    height: '100%',
  },
  avatarCheck: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFF',
  },
  uploadButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  uploadButtonText: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FFF',
  },
  languageOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  voicePositionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  voicePositionTextContainer: {
    flex: 1,
  },
  languageFlag: {
    fontSize: 24,
  },
  languageText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  languageTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  positionDescription: {
    color: COLORS.subtext,
  },
});
