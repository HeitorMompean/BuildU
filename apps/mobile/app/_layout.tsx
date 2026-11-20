import { Stack } from 'expo-router';
import { AuthProvider } from '../src/auth/auth-provider';
export default function R_layoutScreen(): React.JSX.Element {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
