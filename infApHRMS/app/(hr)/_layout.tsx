import { Stack } from 'expo-router';

export default function HRLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="leave" />
      <Stack.Screen name="employee-management" />
      <Stack.Screen name="recruitment" />
      <Stack.Screen name="performance" />
      <Stack.Screen name="resignation" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="finance" />
    </Stack>
  );
}
