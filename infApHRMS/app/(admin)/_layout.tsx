import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="departments" />
      <Stack.Screen name="payroll" />
      <Stack.Screen name="recruitment" />
      <Stack.Screen name="policies" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="security-docs" />
    </Stack>
  );
}
