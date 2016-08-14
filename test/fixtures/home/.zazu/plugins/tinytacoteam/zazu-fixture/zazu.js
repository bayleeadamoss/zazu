module.exports = {
  name: 'Fixture',
  version: '1.0.1',
  description: 'Fixture things',
  icon: 'icon.png',
  stylesheet: 'main.css',
  blocks: {
    external: [
      {
        type: 'Hotkey',
        hotkey: 'alt+f',
        name: 'TinyFood',
        connections: ['Food'],
      }
    ],
    input: [
      {
        id: 'CopyPasta',
        type: 'RootScript',
        script: 'copyPasta.js',
        connections: ['Copy'],
      },
      {
        id: 'EggTimer',
        type: 'Keyword',
        keyword: 'eggtimer',
        title: 'Start eggtimer',
        subtitle: 'Click here to start the egg timer',
        icon: 'fa-clock-o',
        connections: [],
      },
      {
        id: 'Food',
        type: 'PrefixScript',
        prefix: 'food',
        space: true,
        args: 'Required',
        script: 'food.js',
        connections: ['Process'],
      },
    ],
    output: [
      {
        id: 'Process',
        type: 'UserScript',
        script: 'process.js',
        value: '{value}',
        connections: ['Copy'],
      },
      {
        id: 'Copy',
        type: 'CopyToClipboard',
        text: '{value}',
      },
    ],
  },
}
