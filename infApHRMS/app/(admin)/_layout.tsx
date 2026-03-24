import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="staff" />
      <Stack.Screen name="departments" />
      <Stack.Screen name="payroll" />
      <Stack.Screen name="recruitment" />
      <Stack.Screen name="policies" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="security-docs" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="create-notification" />
      <Stack.Screen name="salary-structure" />
      <Stack.Screen name="payslip-generation" />
      <Stack.Screen name="department-details/[id]" />
      <Stack.Screen name="manage-teams" />
      <Stack.Screen name="job-posting" />
      <Stack.Screen name="candidate-tracking" />
      <Stack.Screen name="interview-management" />
      <Stack.Screen name="stats" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="add-employee" />
      <Stack.Screen name="leave-approvals" />
      <Stack.Screen name="policies" />
      <Stack.Screen name="security-docs" />
      <Stack.Screen name="payslip-generation" />
      <Stack.Screen name="salary-structure" />
      <Stack.Screen name="create-notification" />
    </Stack>
  );
}
