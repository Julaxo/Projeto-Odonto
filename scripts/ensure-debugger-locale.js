const fs = require('fs');
const path = require('path');

const localesDir = path.join(
  process.cwd(),
  'node_modules',
  '@react-native',
  'debugger-frontend',
  'dist',
  'third-party',
  'front_end',
  'core',
  'i18n',
  'locales',
);

const sourceLocale = path.join(localesDir, 'en-US.json');
const targetLocales = ['pt.json', 'pt-BR.json'];

if (fs.existsSync(sourceLocale)) {
  for (const targetLocale of targetLocales) {
    const targetPath = path.join(localesDir, targetLocale);

    if (!fs.existsSync(targetPath)) {
      fs.copyFileSync(sourceLocale, targetPath);
    }
  }
}
