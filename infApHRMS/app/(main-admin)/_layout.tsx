import { Stack } from 'expo-router';

export default function MainAdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="system-alerts" />
      <Stack.Screen name="monitoring" />
      <Stack.Screen name="platform-config" />
      <Stack.Screen name="global-users" />
      <Stack.Screen name="company-setup" />
      <Stack.Screen name="integrations" />
      <Stack.Screen name="reports" />
    </Stack>
  );
}
