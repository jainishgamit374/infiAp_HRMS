import { Stack } from 'expo-router';

export default function AttendanceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="corrections" />
      <Stack.Screen name="correction-request/[id]" />
      <Stack.Screen name="correction-success" />
    </Stack>
  );
}
