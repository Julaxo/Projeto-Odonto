import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useLogin } from '@/features/auth/hooks/use-login';

const signInSchema = z.object({
  email: z.email('Informe um email valido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const { errorMessage, isFirebaseConfigured, isLoading, login } = useLogin();
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInSchema),
  });

  async function handleValidSubmit(data: SignInFormData) {
    await login(data);
    router.replace('/(tabs)');
  }

  return (
    <View className="gap-4">
      {!isFirebaseConfigured ? (
        <View className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
          <Text accessibilityRole="alert" className="text-sm font-medium text-destructive">
            Firebase nao configurado. Preencha as variaveis EXPO_PUBLIC_FIREBASE_*.
          </Text>
        </View>
      ) : null}

      <Controller
        control={control}
        name="email"
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            accessibilityLabel="Email"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email?.message}
            keyboardType="email-address"
            label="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="voce@clinica.com"
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            accessibilityLabel="Senha"
            autoCapitalize="none"
            error={errors.password?.message}
            label="Senha"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Digite sua senha"
            secureTextEntry
            value={value}
          />
        )}
      />
      {errorMessage ? (
        <Text accessibilityRole="alert" className="text-sm font-medium text-destructive">
          {errorMessage}
        </Text>
      ) : null}
      <Button
        accessibilityLabel="Entrar na conta"
        className="bg-blue-900 dark:bg-blue-700"
        disabled={isSubmitting || isLoading || !isFirebaseConfigured}
        label={isSubmitting || isLoading ? 'Entrando...' : 'Entrar'}
        onPress={handleSubmit(handleValidSubmit)}
      />
    </View>
  );
}
