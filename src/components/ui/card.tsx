import { forwardRef, type PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

export const Card = forwardRef<View, PropsWithChildren<ViewProps>>(({ className, children, ...props }, ref) => (
  <View ref={ref} className={cn('rounded-lg border border-border bg-card p-4', className)} {...props}>
    {children}
  </View>
));

Card.displayName = 'Card';
