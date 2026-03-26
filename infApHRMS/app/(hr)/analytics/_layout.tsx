import React from 'react';
import { Stack } from 'expo-router';

export default function AnalyticsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="attendance-analytics" />
      <Stack.Screen name="performance-insights" />
    </Stack>
  );
}
