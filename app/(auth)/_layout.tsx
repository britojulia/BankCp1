import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>

      <Stack.Screen
        name="Login/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Registro/index"
        options={{
          headerShown: false,
        }}
      />
      
    </Stack>
  );
}