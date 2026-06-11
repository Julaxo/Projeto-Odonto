import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth.store';

const signInSchema = z.object({
  email: z.email('Informe um email valido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const signIn = useAuthStore((state) => state.signIn);
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

  function handleValidSubmit(data: SignInFormData) {
    signIn({
      email: data.email,
      id: 'local-user',
      name: 'Dra. Marina Almeida',
    });

    router.replace('/(tabs)');
  }

  return (
    <View className="gap-4">
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
      <Button
        accessibilityLabel="Entrar na conta"
        disabled={isSubmitting}
        label={isSubmitting ? 'Entrando...' : 'Entrar'}
        onPress={handleSubmit(handleValidSubmit)}
      />
    </View>
  );
}
