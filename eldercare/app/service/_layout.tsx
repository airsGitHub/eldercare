import { Stack } from 'expo-router';

export default function ServiceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: '返回',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="book"
        options={{
          title: '预约服务',
          presentation: 'modal',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
        }}
      />
    </Stack>
  );
}
