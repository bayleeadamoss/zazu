module.exports = {
  name: 'Fixture',
  version: '1.0.1',
  description: 'Fixture things',
  stylesheet: 'main.css',
  blocks: {
    input: [
      {
        id: 'Main',
        type: 'RootScript',
        script: 'main.js',
        connections: ['Copy'],
      },
    ],
    output: [
      {
        id: 'Copy',
        type: 'CopyToClipboard',
        text: '{value}',
      },
    ],
  },
}
