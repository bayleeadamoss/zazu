module.exports = () => {
  return `module.exports = {
  hotkey: 'alt+space',
  theme: 'tinytacoteam/zazu-light-theme',
  plugins: [
    'tinytacoteam/zazu-calculator',
    'tinytacoteam/zazu-file-finder',
    'tinytacoteam/zazu-fallback',
    'tinytacoteam/zazu-template',
    'tinytacoteam/zazu-system',
    {
      name: 'tinytacoteam/zazu-clipboard',
      variables: {
        ClipboardKey: 'cmd+shift+v',
      },
    },
  ],
}`
}
