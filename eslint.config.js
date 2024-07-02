const globals = require('globals');
const html = require('eslint-plugin-html');
const stylistic = require('@stylistic/eslint-plugin-js');

module.exports = [
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                L: true,
                module: false,
                define: false,
                require: true,
            },

            ecmaVersion: 6,
            sourceType: 'script',
        },
        plugins: {
            '@stylistic/js': stylistic,
        },
        rules: {
            camelcase: 2,
            '@stylistic/js/quotes': [2, 'single', 'avoid-escape'],
            'no-mixed-spaces-and-tabs': [2, 'smart-tabs'],
            'space-before-function-paren': 2,
            'space-in-parens': 2,
            'object-curly-spacing': 2,
            'array-bracket-spacing': 2,
            'computed-property-spacing': 2,
            'space-before-blocks': 2,
            'keyword-spacing': 2,
            'no-lonely-if': 2,
            'comma-style': 2,
            'no-underscore-dangle': 0,
            'no-constant-condition': 0,
            'no-multi-spaces': 0,
            strict: 0,
            'key-spacing': 0,
            'no-shadow': 0,
            'no-unused-vars': 2,
            eqeqeq: 2,
        },
    },
    {
        files: ['**/*.html'],
        plugins: {
            html,
        },
        settings: {
            'html/report-bad-indent': 2,
        },
    }
];