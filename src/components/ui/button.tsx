import { forwardRef, type ReactNode } from 'react';
import { Pressable, type PressableProps, View } from 'react-native';

import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

type ButtonProps = Omit<PressableProps, 'children'> & {
  accessibilityLabel: string;
  children?: ReactNode;
  label?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const buttonVariants: Record<ButtonVariant, string> = {
  default: 'bg-primary',
  secondary: 'bg-secondary',
  outline: 'border border-border bg-background',
  ghost: 'bg-transparent',
  destructive: 'bg-destructive',
};

const textVariants: Record<ButtonVariant, string> = {
  default: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  outline: 'text-foreground',
  ghost: 'text-foreground',
  destructive: 'text-destructive-foreground',
};

const sizeVariants: Record<ButtonSize, string> = {
  default: 'h-11 px-4',
  sm: 'h-9 px-3',
  lg: 'h-12 px-6',
  icon: 'h-11 w-11 px-0',
};

export const Button = forwardRef<View, ButtonProps>(
  ({ accessibilityLabel, className, disabled, label, children, size = 'default', variant = 'default', ...props }, ref) => (
    <Pressable
      ref={ref}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className={cn(
        'items-center justify-center rounded-md active:opacity-80',
        buttonVariants[variant],
        sizeVariants[size],
        disabled && 'opacity-50',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children ?? (
        <Text className={cn('text-center text-sm font-semibold', textVariants[variant])}>{label}</Text>
      )}
    </Pressable>
  ),
);

Button.displayName = 'Button';
