/**
 * External dependencies
 */
import React from 'react';
import { TextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

/**
 * Internal dependencies
 */
import InputGroupControl from '../input-group-control';

const mockAdvancedNumberControl = jest.fn(() => null);
jest.mock('@components/advanced-number-control', () => props =>
	mockAdvancedNumberControl(props)
);

const { renderToStaticMarkup } = require('react-dom/server');

const renderGroup = props => {
	mockAdvancedNumberControl.mockClear();
	renderToStaticMarkup(<InputGroupControl onChange={jest.fn()} {...props} />);
	return mockAdvancedNumberControl.mock.calls.map(([props]) => props);
};

describe('InputGroupControl', () => {
	it('passes negative min/max to unit-enabled fields via minMaxSettings', () => {
		const allowedUnits = ['px', 'em', 'rem', 'vw', 'vh', '%'];
		const [props] = renderGroup({
			fields: [
				{
					key: 'x',
					unitKey: 'x-unit',
					label: 'X',
					min: -5000,
					max: 5000,
					allowedUnits,
				},
			],
		});

		// enableUnit makes AdvancedNumberControl ignore the min/max props, so the
		// negative limit must be carried by minMaxSettings for every allowed unit
		// (plus the unitless '-' key).
		expect(props.enableUnit).toBe(true);
		expect(props.minMaxSettings).toBeDefined();
		[...allowedUnits, '-'].forEach(unit => {
			expect(props.minMaxSettings[unit]).toEqual({
				min: -5000,
				max: 5000,
			});
		});
	});

	it('omits minMaxSettings for unitless fields and relies on min/max props', () => {
		const [props] = renderGroup({
			fields: [
				{
					key: 'x',
					label: 'X',
					min: -10,
					max: 10,
				},
			],
		});

		expect(props.enableUnit).toBe(false);
		expect(props.minMaxSettings).toBeUndefined();
		expect(props.min).toBe(-10);
		expect(props.max).toBe(10);
	});

	it('builds minMaxSettings even when a field omits allowedUnits', () => {
		const [props] = renderGroup({
			fields: [
				{
					key: 'value',
					unitKey: 'unit',
					label: 'Value',
					min: 0,
					max: 5000,
				},
			],
		});

		expect(props.minMaxSettings).toEqual({ '-': { min: 0, max: 5000 } });
	});
});
