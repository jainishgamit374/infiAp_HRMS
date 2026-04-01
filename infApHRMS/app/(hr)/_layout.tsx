import { Stack, Redirect } from 'expo-router';
import { HRProvider } from '@/context/HRContext';
import { useUser } from '@/context/UserContext';

export default function HRLayout() {
  const { user } = useUser();

  if (user.systemRole !== 'hr') {
    return <Redirect href={`/(${user.systemRole})/` as any} />;
  }

  return (
    <HRProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'default',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="attendance" />
        <Stack.Screen name="leave" />
        <Stack.Screen name="employee-management" />
        <Stack.Screen name="add-employee" />
        <Stack.Screen name="employee-profile/[id]" />
        <Stack.Screen name="edit-employee/[id]" />
        <Stack.Screen name="bulk-import" />
        <Stack.Screen name="recruitment" />
        <Stack.Screen name="performance" />
        <Stack.Screen name="resignation" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="analytics" />
        <Stack.Screen name="finance" />
      </Stack>
    </HRProvider>
  );
}
