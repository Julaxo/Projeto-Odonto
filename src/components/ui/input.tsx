import { forwardRef } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';
import { useColorScheme } from 'nativewind';

import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

type InputProps = Omit<TextInputProps, 'accessibilityLabel'> & {
  accessibilityLabel: string;
  error?: string;
  label?: string;
};

const placeholderColor = {
  light: '#71717a',
  dark: '#a1a1aa',
} as const;

export const Input = forwardRef<TextInput, InputProps>(
  ({ accessibilityLabel, className, error, label, ...props }, ref) => {
    const { colorScheme } = useColorScheme();
    const scheme = colorScheme === 'dark' ? 'dark' : 'light';

    return (
      <View className="gap-2">
        {label ? <Text className="text-sm font-medium text-foreground">{label}</Text> : null}
        <TextInput
          ref={ref}
          accessibilityLabel={accessibilityLabel}
          className={cn(
            'h-12 rounded-md border border-input bg-background px-3 text-base text-foreground',
            'focus:border-ring',
            error && 'border-destructive',
            className,
          )}
          placeholderTextColor={placeholderColor[scheme]}
          {...props}
        />
        {error ? (
          <Text accessibilityRole="alert" className="text-sm text-destructive">
            {error}
          </Text>
        ) : null}
      </View>
    );
  },
);

Input.displayName = 'Input';
