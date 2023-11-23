import { relationOptions } from 'src/extensions/DC/constants.js';

describe('relationOptions.container', () => {
  it('returns correct output with valid input', () => {
    const input = { /* valid input */ };
    const output = relationOptions.container(input);
    expect(output).toEqual('Expected Output');
  });

  it('returns correct output with different valid input', () => {
    const input = { /* different valid input */ };
    const output = relationOptions.container(input);
    expect(output).toEqual('Expected Output');
  });

  it('returns correct output with no input', () => {
    const output = relationOptions.container();
    expect(output).toEqual('Expected Output');
  });
});
