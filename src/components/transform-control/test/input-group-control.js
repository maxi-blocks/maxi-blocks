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
				minRange: -5000,
				max: 5000,
				maxRange: 5000,
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
		// The range slider must stay enabled so the field matches the other
		// transform controls and supports keyboard/drag interaction.
		expect(props.disableRange).toBeFalsy();
	});

	it('gives each unit its own range via unitRanges and falls back for the rest', () => {
		const allowedUnits = ['px', 'em', '%'];
		const [props] = renderGroup({
			fields: [
				{
					key: 'x',
					unitKey: 'x-unit',
					label: 'X',
					min: -5000,
					max: 5000,
					allowedUnits,
					unitRanges: {
						px: { min: -5000, max: 5000 },
						'%': { min: -100, max: 100 },
					},
				},
			],
		});

		// Units listed in unitRanges use their own bounds...
		expect(props.minMaxSettings.px).toEqual({
			min: -5000,
			minRange: -5000,
			max: 5000,
			maxRange: 5000,
		});
		expect(props.minMaxSettings['%']).toEqual({
			min: -100,
			minRange: -100,
			max: 100,
			maxRange: 100,
		});
		// ...while units missing from the map fall back to the flat min/max.
		expect(props.minMaxSettings.em).toEqual({
			min: -5000,
			minRange: -5000,
			max: 5000,
			maxRange: 5000,
		});
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

		expect(props.minMaxSettings).toEqual({
			'-': { min: 0, minRange: 0, max: 5000, maxRange: 5000 },
		});
	});
});
