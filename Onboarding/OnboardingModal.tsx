// Onboarding/OnboardingModal.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../Theme';
import type { AppLanguage } from './constants';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCompleteListener: (lang: AppLanguage) => Promise<void> | void;
  onRequireSignup: (lang: AppLanguage) => Promise<void> | void;
};

const LANGS: { key: AppLanguage; flag: string }[] = [
  { key: 'fi', flag: '🇫🇮' },
  { key: 'sv', flag: '🇸🇪' },
  { key: 'en', flag: '🇬🇧' },
];

export default function OnboardingModal({
  visible,
  onClose,
  onCompleteListener,
  onRequireSignup,
}: Props) {
  const { theme } = useTheme();
  const s = useMemo(() => getStyles(theme), [theme]);

  // animation
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(16)).current;
  const [mounted, setMounted] = useState(visible);

  // steps
  const [step, setStep] = useState<1 | 2>(1);
  const [lang, setLang] = useState<AppLanguage>('en');
  const [role, setRole] = useState<'artist' | 'listener' | null>(null);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(cardTranslate, { toValue: 0, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 0, duration: 140, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 0, duration: 140, useNativeDriver: true }),
      ]).start(({ finished }) => finished && setMounted(false));
    }
  }, [visible]); // eslint-disable-line

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setLang('en');
      setRole(null);
    }, 150);
  };

  const complete = async () => {
    if (!role) return;
    if (role === 'listener') await onCompleteListener(lang);
    else await onRequireSignup(lang);
    resetAndClose();
  };

  if (!mounted) return null;

  return (
    <View style={s.overlay} pointerEvents="box-none">
      {/* blurred backdrop + dim */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: overlayOpacity }]}>
        <BlurView intensity={34} tint={theme.mode === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <TouchableWithoutFeedback onPress={resetAndClose}>
          <View style={s.scrim} />
        </TouchableWithoutFeedback>
      </Animated.View>

      <View style={s.centerWrap} pointerEvents="box-none">
        {/* square floating card */}
        <Animated.View style={[s.card, { opacity: cardOpacity, transform: [{ translateY: cardTranslate }] }]}>
          <View style={s.cardContent}>
            {step === 1 ? (
              <>
                <Text style={s.title}>WELCOME  TO  JAMWAY!</Text>

                <View style={s.flagRow}>
                  {LANGS.map(item => (
                    <TouchableOpacity
                      key={item.key}
                      style={[s.flagBtn, lang === item.key && s.flagBtnActive]}
                      onPress={() => setLang(item.key)}
                      activeOpacity={0.9}
                    >
                      <Text style={s.flagEmoji}>{item.flag}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={s.primaryCta} onPress={() => setStep(2)} activeOpacity={0.92}>
                  <Text style={s.ctaText}>CONTINUE</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={s.title}>WHAT  BRINGS  YOU  HERE?</Text>

                {/* Artist */}
                <TouchableOpacity
                  activeOpacity={0.95}
                  onPress={() => setRole('artist')}
                  style={[s.roleCard, role === 'artist' && s.roleActive]}
                >
                  <Text style={s.roleEmoji}>🎵</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.roleName}>Artist</Text>
                    <Text style={s.roleSub}>Apply for gigs & perform</Text>
                  </View>
                </TouchableOpacity>

                {/* Music lover */}
                <TouchableOpacity
                  activeOpacity={0.95}
                  onPress={() => setRole('listener')}
                  style={[s.roleCard, role === 'listener' && s.roleActive]}
                >
                  <Text style={s.roleEmoji}>🎧</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.roleName}>Music Lover</Text>
                    <Text style={s.roleSub}>Discover & attend events</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[s.primaryCta, role === 'listener' && s.secondaryCta]}
                  onPress={complete}
                  activeOpacity={0.92}
                  disabled={!role}
                >
                  <Text style={s.ctaText}>
                    {!role
                      ? 'CHOOSE AN OPTION'
                      : role === 'listener'
                      ? 'CONTINUE AS A FAN'
                      : 'CONTINUE AS ARTIST'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    overlay: { ...StyleSheet.absoluteFillObject, zIndex: 999 },
    scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },

    centerWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },

    // Square card with generous padding
    card: {
      width: '88%',
      maxWidth: 360,
      aspectRatio: 1,               // square
      borderRadius: 18,
      backgroundColor: theme.colors.bubble,
      borderWidth: 1,
      borderColor: theme.colors.bubbleborder,
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 14,
      overflow: 'hidden',
    },

    cardContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center', // center all contents
      padding: 20,
      gap: 16,
    },

    title: {
      textAlign: 'center',
      color: theme.colors.text,
      fontFamily: 'Inter',
      fontSize: 20,
      letterSpacing: 1, // reduced spacing
      marginBottom: 10,
    },

    flagRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      width: '100%',
      marginVertical: 8,
    },
    flagBtn: {
      width: 68,
      height: 52,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.18)',
      backgroundColor: 'transparent',
    },
    flagBtnActive: {
      backgroundColor: 'rgba(255,255,255,0.08)',
      borderColor: theme.colors.bubbleborder,
    },
    flagEmoji: { fontSize: 30 },

    roleCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.bubbleborder,
      backgroundColor: 'rgba(255,255,255,0.07)',
    },
    roleActive: { backgroundColor: 'rgba(255,255,255,0.12)' },
    roleEmoji: { fontSize: 20, marginRight: 8 },
    roleName: {
      color: theme.colors.text,
      fontFamily: 'Inter',
      fontWeight: '900',
      fontSize: 15,
    },
    roleSub: {
      color: theme.colors.text,
      opacity: 0.7,
      fontFamily: 'Inter',
      fontSize: 12.5,
    },

    primaryCta: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 18,
      alignItems: 'center',
      marginTop: 8,
    },
    secondaryCta: {
      backgroundColor: '#A3AD32',
    },
    ctaText: {
      color: theme.colors.primaryText,
      fontFamily: 'Inter',
      fontWeight: '800',
      fontSize: 14,
      letterSpacing: 0.6,
    },
  });