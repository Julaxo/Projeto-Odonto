import { useColorScheme } from 'nativewind';

import { NAV_THEME } from '@/constants/theme';

/**
 * Resolve as cores do NAV_THEME para o color scheme atual. Usado para
 * colorir ícones do `lucide-react-native`, que precisam de uma cor
 * explícita (não herdam classes do NativeWind).
 */
export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  return NAV_THEME[scheme];
}
