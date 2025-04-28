import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
    ...compat.config({
        extends: ['next/core-web-vitals', 'next/typescript', 'eslint:recommended', 'plugin:react/recommended', 'prettier'],
        rules: {
            'react/no-unescaped-entities': 'off',
            '@next/next/no-page-custom-font': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-unescaped-entities': 'off',
            'import/prefer-default-export': 'off',
            'no-console': 'warn',
            'no-nested-ternary': 'off',
            'no-underscore-dangle': 'off',
            'no-unused-expressions': ['error', { allowTernary: 'on' }],
            camelcase: 'off',
            'react/self-closing-comp': 'on',
            'react/destructuring-assignment': 'off',
            'react/no-array-index-key': 'off',
            'react/require-default-props': 'off',
            'react/react-in-jsx-scope': 'off',
            'linebreak-style': ['error', 'unix'],
            semi: ['error', 'never'],
        },
    }),
];

export default eslintConfig;
