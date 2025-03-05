import globals from 'globals';
import eslintPluginEslint from '@eslint/js';
import eslintPluginStylistic from '@stylistic/eslint-plugin-js';
import eslintPluginHtml from 'eslint-plugin-html';

const config = [
	{
		files: ['**/*.js'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				define: 'readonly',
				L: 'writable'
			}
		},
		plugins: {
			...eslintPluginStylistic.configs['all-flat'].plugins
		},
		rules: {
			...eslintPluginEslint.configs['recommended'].rules,
			...eslintPluginStylistic.configs['all-flat'].rules,
			'@stylistic/js/brace-style': ['error', '1tbs'],
			'@stylistic/js/comma-dangle': ['error', 'only-multiline'],
			'@stylistic/js/dot-location': ['error', 'property'],
			'@stylistic/js/function-call-argument-newline': ['error', 'consistent'],
			'@stylistic/js/indent': ['error', 'tab'],
			'@stylistic/js/multiline-comment-style': 'off',
			'@stylistic/js/no-tabs': 'off',
			'@stylistic/js/object-curly-spacing': ['error', 'always'],
			'@stylistic/js/padded-blocks': 'off',
			'@stylistic/js/quotes': ['error', 'single'],
			'@stylistic/js/quote-props': ['error', 'consistent-as-needed'],
			'@stylistic/js/semi': ['error', 'always'],
			'@stylistic/js/space-before-function-paren': ['error', 'never'],
			'@stylistic/js/array-element-newline': ["error", "consistent"],
			'no-lonely-if': 'error',
			'no-unused-expressions': ['error', { allowTernary: true }]
		}
	},
    {
        files: ['**/*.html'],
        plugins: {
            eslintPluginHtml,
        },
        settings: {
            'html/report-bad-indent': 2,
        },
    }
];

export default config;
