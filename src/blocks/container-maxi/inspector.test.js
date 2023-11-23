import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Inspector from './inspector';

afterEach(cleanup);

describe('contextLoop inspector tab', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Inspector />, div);
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<Inspector />);
    expect(getByTestId('inspector')).toBeInTheDocument();
  });

  it('renders correctly when deviceType is general', () => {
    const { getByTestId } = render(<Inspector deviceType="general" />);
    expect(getByTestId('inspector')).toHaveClass('general');
  });

  it('renders correctly when deviceType is not general', () => {
    const { getByTestId } = render(<Inspector deviceType="not-general" />);
    expect(getByTestId('inspector')).not.toHaveClass('general');
  });

  it('renders correctly when shapeDividerTopStatus is true', () => {
    const { getByTestId } = render(<Inspector attributes={{ 'shape-divider-top-status': true }} />);
    expect(getByTestId('inspector')).toHaveClass('top shape divider');
  });

  it('renders correctly when shapeDividerTopStatus is false', () => {
    const { getByTestId } = render(<Inspector attributes={{ 'shape-divider-top-status': false }} />);
    expect(getByTestId('inspector')).not.toHaveClass('top shape divider');
  });

  it('renders correctly when shapeDividerBottomStatus is true', () => {
    const { getByTestId } = render(<Inspector attributes={{ 'shape-divider-bottom-status': true }} />);
    expect(getByTestId('inspector')).toHaveClass('bottom shape divider');
  });

  it('renders correctly when shapeDividerBottomStatus is false', () => {
    const { getByTestId } = render(<Inspector attributes={{ 'shape-divider-bottom-status': false }} />);
    expect(getByTestId('inspector')).not.toHaveClass('bottom shape divider');
  });
});
