jest.mock('@extensions/relations', () => ({
	getCanvasSettings: jest.fn(() => ({})),
	getAdvancedSettings: jest.fn(() => ({})),
}));

import metadata from '../block.json';
import { scProps } from '../data';

const expectedSCElements = [
	'color-global',
	'palette-status',
	'palette-color',
	'palette-opacity',
	'color',
	'circle-background-color-global',
	'circle-background-palette-status',
	'circle-background-palette-color',
	'circle-background-palette-opacity',
	'circle-background-color',
	'circle-bar-color-global',
	'circle-bar-palette-status',
	'circle-bar-palette-color',
	'circle-bar-palette-opacity',
	'circle-bar-color',
	'font-family-general',
	'font-size-general',
	'font-weight-general',
];

describe('Number Counter style card props', () => {
	it('keeps editor and block metadata style card elements in sync', () => {
		expect(scProps).toEqual({
			scElements: expectedSCElements,
			scType: 'number-counter',
		});
		expect(metadata.scProps).toEqual(scProps);
	});
});
