import { useEffect } from 'react';
import { Platform } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { UserProvider } from '../context/UserContext';
import { LeaveProvider } from '../context/LeaveContext';
import { NotificationProvider } from '../context/NotificationContext';
import { SidebarProvider } from '../context/SidebarContext';
import Sidebar from '../components/layout/Sidebar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Hide the Android navigation bar and enable immersive mode
      NavigationBar.setVisibilityAsync("hidden");
    }
  }, []);

  return (
    <SafeAreaProvider>
      <UserProvider>
        <LeaveProvider>
          <NotificationProvider>
            <SidebarProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Sidebar />
                <Stack screenOptions={{ animation: 'slide_from_right' }}>
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name="(employee)" options={{ headerShown: false }} />
                  <Stack.Screen name="(hr)" options={{ headerShown: false }} />
                  <Stack.Screen name="(admin)" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                </Stack>
                <StatusBar style="auto" />
              </ThemeProvider>
            </SidebarProvider>
          </NotificationProvider>
        </LeaveProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
