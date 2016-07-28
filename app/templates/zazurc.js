module.exports = () => {
  return `module.exports = {
  'hotkey': 'alt+space',
  'theme': 'tinytacoteam/zazu-light-theme',
  'plugins': [
    'tinytacoteam/zazu-file-finder',
    'tinytacoteam/zazu-calculator',
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
