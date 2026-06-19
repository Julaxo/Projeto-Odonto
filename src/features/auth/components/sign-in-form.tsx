import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useLogin } from '@/features/auth/hooks/use-login';
import { type UserRole, useAuthStore } from '@/store/auth.store';

const signInSchema = z.object({
  email: z.email('Informe um email valido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const { login, isLoading, errorMessage, isFirebaseConfigured } = useLogin();
  const setAuthRole = useAuthStore((state) => state.setRole);
  const [role, setRole] = useState<UserRole>('patient');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleValidSubmit(data: SignInFormData) {
    setAuthRole(role);
    await login(data, role);
    router.replace(role === 'dentist' ? '/(dentist)' : '/(tabs)');
  }

  return (
    <View className="gap-4">
      {!isFirebaseConfigured ? (
        <View className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
          <Text
            accessibilityRole="alert"
            className="text-sm font-medium text-destructive"
          >
            Firebase nao configurado. Preencha as variaveis
            EXPO_PUBLIC_FIREBASE_*.
          </Text>
        </View>
      ) : null}

      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">Entrar como</Text>
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => {
              setRole('patient');
              setAuthRole('patient');
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected: role === 'patient' }}
            accessibilityLabel="Entrar como paciente"
            className={`flex-1 items-center rounded-md border p-3 ${
              role === 'patient'
                ? 'border-blue-900 bg-blue-900/10 dark:border-blue-700 dark:bg-blue-700/10'
                : 'border-border'
            }`}
          >
            <Text
              className={
                role === 'patient'
                  ? 'text-sm font-medium text-blue-900 dark:text-blue-300'
                  : 'text-sm'
              }
            >
              Paciente
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setRole('dentist');
              setAuthRole('dentist');
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected: role === 'dentist' }}
            accessibilityLabel="Entrar como dentista"
            className={`flex-1 items-center rounded-md border p-3 ${
              role === 'dentist'
                ? 'border-blue-900 bg-blue-900/10 dark:border-blue-700 dark:bg-blue-700/10'
                : 'border-border'
            }`}
          >
            <Text
              className={
                role === 'dentist'
                  ? 'text-sm font-medium text-blue-900 dark:text-blue-300'
                  : 'text-sm'
              }
            >
              Dentista
            </Text>
          </Pressable>
        </View>
      </View>

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
        <Text
          accessibilityRole="alert"
          className="text-sm font-medium text-destructive"
        >
          {errorMessage}
        </Text>
      ) : null}
      <Button
        accessibilityLabel="Entrar na conta"
        className="bg-blue-900 dark:bg-blue-700"
        disabled={isSubmitting || isLoading || !isFirebaseConfigured}
        label={isSubmitting || isLoading ? "Entrando..." : "Entrar"}
        onPress={handleSubmit(handleValidSubmit)}
      />
    </View>
  );
}
