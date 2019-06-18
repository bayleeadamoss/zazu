require('@babel/register')({
  ignore: [/node_modules/, /newrelic\.js/],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          electron: '5',
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    'babel-plugin-macros',
    '@babel/plugin-syntax-dynamic-import',
    'dynamic-import-node-babel-7',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-react-constant-elements',
    '@babel/plugin-transform-react-inline-elements',
    'babel-plugin-closure-elimination',
  ],
})
