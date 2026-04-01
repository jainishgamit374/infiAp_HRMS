import { Stack, Redirect } from 'expo-router';
import { useUser } from '@/context/UserContext';

export default function AdminLayout() {
  const { user } = useUser();

  if (user.systemRole !== 'admin') {
    return <Redirect href={`/(${user.systemRole})/` as any} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="staff" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="stats" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
