module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        modules: false,
        loose: true,
        targets: {
          browsers: ['last 2 versions']
        }
      }
    ]
  ],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./src']
      }
    ],
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-export-namespace-from',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ],
  env: {
    production: {
      plugins: [['transform-react-remove-prop-types', { removeImport: true }]]
    },
    test: {
      presets: ['@babel/preset-react', ['@babel/preset-env', { modules: 'commonjs' }]]
    }
  }
};
