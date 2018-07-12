module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier'],
  env: {
    browser: true
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'import/prefer-default-export': 'off',
    'prettier/prettier': ['error', { singleQuote: true }],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to']
      }
    ]
  }
};
