import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Inspector from '../../../src/blocks/container-maxi/inspector';

jest.mock('@wordpress/i18n', () => ({
  __: jest.fn((text) => text),
}));

jest.mock('@wordpress/block-editor', () => ({
  InspectorControls: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('../../../src/components/accordion-control', () => () => <div>AccordionControl</div>);
jest.mock('../../../src/components/setting-tabs-control', () => () => <div>SettingTabsControl</div>);
jest.mock('../../../src/extensions/inspector', () => ({
  withMaxiInspector: (Component) => (props) => <Component {...props} />,
}));

describe('Inspector', () => {
  const mockProps = {
    attributes: {},
    deviceType: 'general',
    maxiSetAttributes: jest.fn(),
    insertInlineStyles: jest.fn(),
    cleanInlineStyles: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { container } = render(<Inspector {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('calls maxiSetAttributes and cleanInlineStyles when shape divider changes', () => {
    const { getByText } = render(<Inspector {...mockProps} />);
    fireEvent.click(getByText('Shape divider'));
    expect(mockProps.maxiSetAttributes).toHaveBeenCalled();
    expect(mockProps.cleanInlineStyles).toHaveBeenCalledWith('svg');
  });

  it('renders different elements based on deviceType', () => {
    const { rerender, getByText } = render(<Inspector {...mockProps} />);
    expect(getByText('Advanced')).toBeInTheDocument();
    rerender(<Inspector {...mockProps} deviceType="tablet" />);
    expect(getByText('Responsive')).toBeInTheDocument();
  });

  it('renders different elements based on shape-divider-top-status and shape-divider-bottom-status', () => {
    const { rerender, queryByText } = render(<Inspector {...mockProps} />);
    expect(queryByText('top shape divider')).not.toBeInTheDocument();
    expect(queryByText('bottom shape divider')).not.toBeInTheDocument();
    rerender(<Inspector {...mockProps} attributes={{ 'shape-divider-top-status': true, 'shape-divider-bottom-status': true }} />);
    expect(queryByText('top shape divider')).toBeInTheDocument();
    expect(queryByText('bottom shape divider')).toBeInTheDocument();
  });
});
