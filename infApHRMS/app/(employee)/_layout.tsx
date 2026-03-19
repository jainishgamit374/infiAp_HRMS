import { Stack } from 'expo-router';

export default function EmployeeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="leave" />
      <Stack.Screen name="apply-leave" />
      <Stack.Screen name="my-leaves" />
      <Stack.Screen name="payroll" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="performance" />
      <Stack.Screen name="work-schedule" />
      <Stack.Screen name="activity-log" />
      <Stack.Screen name="directory" />
    </Stack>
  );
}
