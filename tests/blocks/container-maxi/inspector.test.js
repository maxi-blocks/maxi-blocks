import { render } from '@testing-library/react';
import { inspectorTabs } from 'src/blocks/container-maxi/inspector.js';

describe('inspectorTabs.contextLoop', () => {
  it('returns correct output with valid props', () => {
    const props = { /* valid props */ };
    const { getByTestId } = render(inspectorTabs.contextLoop(props));
    expect(getByTestId('context-loop-output')).toHaveTextContent('Expected Output');
  });

  it('returns correct output with different valid props', () => {
    const props = { /* different valid props */ };
    const { getByTestId } = render(inspectorTabs.contextLoop(props));
    expect(getByTestId('context-loop-output')).toHaveTextContent('Expected Output');
  });

  it('returns correct output with no props', () => {
    const { getByTestId } = render(inspectorTabs.contextLoop());
    expect(getByTestId('context-loop-output')).toHaveTextContent('Expected Output');
  });
});
