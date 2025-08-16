import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home as HomeIcon,
  Calendar,
  Ticket,
  Users,
  Settings as SettingsIcon,
} from 'lucide-react-native';
import { ThemeProvider, useTheme } from './Theme';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from './Pages/Home';
import Events from './Pages/Events/Events';
import Activity from './Pages/Activity';
import Profile from './Pages/Profile';
import Settings from './Pages/Settings';

// Onboarding
import useOnboarding from './Onboarding/useOnboarding';
import OnboardingModal from './Onboarding/OnboardingModal';
import { STORAGE_KEYS, AppLanguage } from './Onboarding/constants';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

function MainTabs({ showProfile }: { showProfile: boolean }) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // keep transparent so your gradient shows through (works great with OrganicBackground too)
        sceneContainerStyle: { backgroundColor: 'transparent' },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <HomeIcon color={color} size={size} />;
          if (route.name === 'Events') return <Calendar color={color} size={size} />;
          if (route.name === 'Activity') return <Ticket color={color} size={size} />;
          if (route.name === 'Profile') return <Users color={color} size={size} />;
          if (route.name === 'Settings') return <SettingsIcon color={color} size={size} />;
          return null;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.tabBarBg },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Events" component={Events} />
      <Tab.Screen name="Activity" component={Activity} />
      {showProfile && <Tab.Screen name="Profile" component={Profile} />}
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<'listener' | 'artist' | null>(null);

  // Onboarding control
  const { loading, shouldShow, saveSelections, markDone } = useOnboarding();


  // 🔧 DEV override — force onboarding to always show
  const FORCE_ONBOARDING = true;
  const showOnboarding = FORCE_ONBOARDING 
    ? true 
    : shouldShow;

  // // ✅ Original working logic (commented for now)
  // const showOnboarding = shouldShow;

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({
          Horizon: require('./assets/Fonts/horizon.otf'),
          SpacemonoBold: require('./assets/Fonts/SpaceMono-Bold.ttf'),
          Spacemono: require('./assets/Fonts/SpaceMono-Regular.ttf'),
          Inter: require('./assets/Fonts/Inter_24pt-Regular.ttf'),
        });

        // load saved role for conditional tabs
        const savedRole = await AsyncStorage.getItem(STORAGE_KEYS.ROLE);
        if (savedRole === 'listener' || savedRole === 'artist') setRole(savedRole);
      } catch (e) {
        console.warn('Font load error:', e);
      } finally {
        setReady(true);
        await SplashScreen.hideAsync();
      }
    })();
  }, []);

  // handlers for onboarding completion
  const handleListenerDone = async (lang: AppLanguage) => {
    await saveSelections(lang, 'listener');
    setRole('listener');
    await markDone();
  };

  const handleArtist = async (lang: AppLanguage) => {
    await saveSelections(lang, 'artist');
    setRole('artist');
    // If you have a SignUp screen, navigate there here.
    // For now we just mark onboarding done so it won’t reappear.
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, '1');
  };

  // show Profile tab if artist/admin
  const showProfile = useMemo(() => role === 'artist', [role]);

  if (!ready || loading) return null;

  return (
    <ThemeProvider>
      <LinearGradient
        colors={['#0f3d33', '#0b2a23', '#0f3d33', '#09201b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <NavigationContainer>
          <MainTabs showProfile={showProfile} />
        </NavigationContainer>

        {/* Onboarding modal sits above the navigator to blur/cover whole app */}
        <OnboardingModal
          visible={showOnboarding}
          onClose={() => {
            // If user closes without choosing, you can leave it to show next launch.
          }}
          onCompleteListener={handleListenerDone}
          onRequireSignup={handleArtist}
        />
      </LinearGradient>
    </ThemeProvider>
  );
}
