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
            '@stylistic/js/no-mixed-spaces-and-tabs': [2, 'smart-tabs'],
            '@stylistic/js/space-before-function-paren': 2,
            '@stylistic/js/space-in-parens': 2,
            '@stylistic/js/object-curly-spacing': 2,
            '@stylistic/js/array-bracket-spacing': 2,
            '@stylistic/js/computed-property-spacing': 2,
            '@stylistic/js/space-before-blocks': 2,
            '@stylistic/js/keyword-spacing': 2,
            'no-lonely-if': 2,
            '@stylistic/js/comma-style': 2,
            'no-underscore-dangle': 0,
            'no-constant-condition': 0,
            '@stylistic/js/no-multi-spaces': 0,
            strict: 0,
            '@stylistic/js/key-spacing': 0,
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