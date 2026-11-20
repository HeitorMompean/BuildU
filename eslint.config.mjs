import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

/** Minimal flat config for R01-M shells. Feature rounds add stricter rules. */
export default [
  { ignores: ['**/dist/**', '**/build/**', '**/.next/**', '**/.expo/**', '**/node_modules/**', '**/*.generated.ts', 'packages/api-client/src/generated/**', '**/next-env.d.ts'] },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    languageOptions: { parser: tsparser, parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } } },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      ...tseslint.configs['recommended']?.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'off',
      'no-console': 'off'
    }
  }
];
