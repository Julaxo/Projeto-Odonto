import { forwardRef } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/lib/utils';

type TextVariant = 'body' | 'title' | 'subtitle' | 'muted' | 'caption';

type TextProps = RNTextProps & {
  variant?: TextVariant;
};

const variants: Record<TextVariant, string> = {
  body: 'text-base text-foreground',
  title: 'text-2xl font-bold text-foreground',
  subtitle: 'text-lg font-semibold text-foreground',
  muted: 'text-sm text-muted-foreground',
  caption: 'text-xs font-medium uppercase text-muted-foreground',
};

export const Text = forwardRef<RNText, TextProps>(({ className, variant = 'body', ...props }, ref) => (
  <RNText ref={ref} className={cn(variants[variant], className)} {...props} />
));

Text.displayName = 'Text';
