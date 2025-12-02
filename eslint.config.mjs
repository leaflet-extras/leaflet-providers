import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
	{
		files: ['**/*.js'],
		plugins: { js, stylistic },
		extends: ['js/recommended', 'stylistic/all'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				define: 'readonly',
				L: 'writable'
			}
		},
		rules: {
			'@stylistic/array-element-newline': ['error', 'consistent'],
			'@stylistic/brace-style': ['error', '1tbs'],
			'@stylistic/comma-dangle': ['error', 'only-multiline'],
			'@stylistic/dot-location': ['error', 'property'],
			'@stylistic/function-call-argument-newline': ['error', 'consistent'],
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/multiline-comment-style': 'off',
			'@stylistic/no-tabs': 'off',
			'@stylistic/object-curly-spacing': ['error', 'always'],
			'@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
			'@stylistic/padded-blocks': 'off',
			'@stylistic/quote-props': ['error', 'consistent-as-needed'],
			'@stylistic/quotes': ['error', 'single'],
			'@stylistic/semi': ['error', 'always'],
			'@stylistic/space-before-function-paren': ['error', 'never'],
			'no-lonely-if': 'error',
			'no-unused-expressions': ['error', { allowTernary: true }]
		}
	}
]);
