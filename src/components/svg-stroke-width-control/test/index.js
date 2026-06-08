import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';

import SvgStrokeWidthControl from '../index';
import { setSVGStrokeWidth } from '@extensions/svg';

const mockAdvancedNumberControl = jest.fn(() => null);

jest.mock('@wordpress/i18n', () => ({
	__: text => text,
}));

jest.mock(
	'@components/advanced-number-control',
	() => props => mockAdvancedNumberControl(props)
);

jest.mock('@extensions/styles', () => ({
	getAttributeKey: (target, isHover, prefix = '', breakpoint = 'general') =>
		`${prefix}${target}-${breakpoint}${isHover ? '-hover' : ''}`,
	getDefaultAttribute: jest.fn(() => ''),
	getLastBreakpointAttribute: ({ target, breakpoint, attributes }) =>
		attributes?.[`${target}-${breakpoint}`],
}));

jest.mock('@extensions/svg', () => ({
	setSVGStrokeWidth: jest.fn(() => '<svg stroke-width="4" />'),
}));

describe('SvgStrokeWidthControl', () => {
	let container;
	let root;

	const defaultProps = {
		breakpoint: 'general',
		content: '<svg stroke-width="2" />',
		onChange: jest.fn(),
		prefix: 'play-icon-',
		'play-icon-stroke-general': 2,
	};

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => {
			root.unmount();
		});
		document.body.removeChild(container);
		jest.clearAllMocks();
	});

	const renderControl = props => {
		act(() => {
			root.render(<SvgStrokeWidthControl {...defaultProps} {...props} />);
		});
	};

	const changeStrokeWidth = () => {
		const [{ onChangeValue }] = mockAdvancedNumberControl.mock.calls[0];

		onChangeValue('4', { source: 'test' });
	};

	const resetStrokeWidth = () => {
		const [{ onReset }] = mockAdvancedNumberControl.mock.calls[0];

		onReset();
	};

	it('updates SVG content by default for existing icon flows', () => {
		renderControl();

		changeStrokeWidth();

		expect(setSVGStrokeWidth).toHaveBeenCalledWith(
			defaultProps.content,
			'4'
		);
		expect(defaultProps.onChange).toHaveBeenCalledWith({
			'play-icon-stroke-general': '4',
			'play-icon-content': '<svg stroke-width="4" />',
			meta: { source: 'test' },
		});
	});

	it('can update stroke width without rewriting SVG content', () => {
		renderControl({ disableContentUpdate: true });

		changeStrokeWidth();

		expect(setSVGStrokeWidth).not.toHaveBeenCalled();
		expect(defaultProps.onChange).toHaveBeenCalledWith({
			'play-icon-stroke-general': '4',
			meta: { source: 'test' },
		});
	});

	it('resets SVG content by default for existing icon flows', () => {
		renderControl();

		resetStrokeWidth();

		expect(setSVGStrokeWidth).toHaveBeenCalledWith(
			defaultProps.content,
			''
		);
		expect(defaultProps.onChange).toHaveBeenCalledWith({
			'play-icon-stroke-general': '',
			'play-icon-content': '<svg stroke-width="4" />',
			isReset: true,
		});
	});

	it('can reset stroke width without rewriting SVG content', () => {
		renderControl({ disableContentUpdate: true });

		resetStrokeWidth();

		expect(setSVGStrokeWidth).not.toHaveBeenCalled();
		expect(defaultProps.onChange).toHaveBeenCalledWith({
			'play-icon-stroke-general': '',
			isReset: true,
		});
	});
});
