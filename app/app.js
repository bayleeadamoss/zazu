import jQuery from 'jQuery';

import Zazu from './zazu';
import View from './view';
import Plugin from './plugin';

const zazu = new Zazu;

// Handled by manager
const calculatorPlugin = new Plugin('../plugins/calculator/zazu');
zazu.addPlugin(calculatorPlugin);

// Eh?
const input = jQuery('#query');
const resultsView = new View(jQuery('#results'));
input.on('keyup', () => {
  zazu.search(input.val(), (promises) => {
    resultsView.clear();
    promises.forEach((promise) => {
      promise.then((results) => {
        resultsView.add(results);
      });
    });
  });
});
