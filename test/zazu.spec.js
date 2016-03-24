import { expect } from 'chai';
import Zazu from '../app/zazu';

describe('Zazu', () => {
  it('responds to addSetting', () => {
    expect(Zazu).to.respondTo('addSetting');
  });
});
