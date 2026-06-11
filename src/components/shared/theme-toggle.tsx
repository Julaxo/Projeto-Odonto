import { Moon, Sun } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Button } from '@/components/ui/button';
import { NAV_THEME } from '@/constants/theme';

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scheme = isDark ? 'dark' : 'light';
  const iconColor = NAV_THEME[scheme].text;

  return (
    <Button
      accessibilityLabel={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      onPress={() => setColorScheme(isDark ? 'light' : 'dark')}
      size="icon"
      variant="outline"
    >
      {isDark ? <Sun color={iconColor} size={18} /> : <Moon color={iconColor} size={18} />}
    </Button>
  );
}
