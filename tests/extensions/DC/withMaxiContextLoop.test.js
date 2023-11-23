import React from 'react';
import { render } from '@testing-library/react';
import { createHigherOrderComponent } from '@wordpress/compose';
import { dispatch, select } from '@wordpress/data';
import { useContext, useMemo, useEffect, useRef } from '@wordpress/element';
import withMaxiContextLoop from '../../../src/extensions/DC/withMaxiContextLoop';

jest.mock('@wordpress/compose', () => ({
  createHigherOrderComponent: jest.fn(),
}));

jest.mock('@wordpress/data', () => ({
  dispatch: jest.fn(),
  select: jest.fn(),
}));

jest.mock('@wordpress/element', () => ({
  useContext: jest.fn(),
  useMemo: jest.fn(),
  useEffect: jest.fn(),
  useRef: jest.fn(),
}));

describe('withMaxiContextLoop', () => {
  it('wraps the component correctly', () => {
    const DummyComponent = () => <div>Dummy</div>;
    const WrappedComponent = withMaxiContextLoop(DummyComponent);
    const { container } = render(<WrappedComponent />);
    expect(container).toMatchSnapshot();
  });

  // Add more tests for getAccumulator, the effect hook, and the memoization of contextLoop...
});
