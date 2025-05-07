/**
 * Internal dependencies
 */
import getTempAttributes from '@extensions/relations/getTempAttributes';
import {
	getAttributeKey,
	getAttributeValue,
	getPaletteAttributes,
} from '@extensions/styles';

jest.mock('@extensions/styles', () => ({
	getAttributeKey: jest.fn(),
	getAttributeValue: jest.fn(),
	getPaletteAttributes: jest.fn(),
}));

describe('getTempAttributes', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return an empty object if no styleAttrs are provided', () => {
		const result = getTempAttributes({}, {}, {}, 'general', '', '');

		expect(result).toEqual({});
		expect(getAttributeKey).not.toHaveBeenCalled();
		expect(getAttributeValue).not.toHaveBeenCalled();
	});

	it('should process styleAttrs and add values to tempAttributes', () => {
		getAttributeValue
			.mockReturnValueOnce(null) // No responsive value for 'general'
			.mockReturnValueOnce(null) // No responsive value for 'xxl'
			.mockReturnValueOnce(null) // No responsive value for 'xl'
			.mockReturnValueOnce(null) // No responsive value for 'l'
			.mockReturnValueOnce(null) // No responsive value for 'm'
			.mockReturnValueOnce(null) // No responsive value for 's'
			.mockReturnValueOnce(null) // No responsive value for 'xs'
			.mockReturnValueOnce('10'); // Non-responsive value

		getAttributeKey.mockReturnValue('border-width');

		const selectedSettingsObj = {
			styleAttrs: ['border-width'],
		};
		const cleanAttributesObject = {};
		const blockAttributes = {
			'border-width': '10',
		};

		const result = getTempAttributes(
			selectedSettingsObj,
			cleanAttributesObject,
			blockAttributes,
			'general',
			'',
			''
		);

		expect(result).toEqual({
			'border-width': '10',
		});
		expect(getAttributeValue).toHaveBeenCalledTimes(8);
		expect(getAttributeKey).toHaveBeenCalledWith('border-width', null, '');
	});

	it('should skip attributes that are already in cleanAttributesObject', () => {
		const selectedSettingsObj = {
			styleAttrs: ['border-width'],
		};
		const cleanAttributesObject = {
			'border-width': '5',
		};
		const blockAttributes = {
			'border-width': '10',
		};

		const result = getTempAttributes(
			selectedSettingsObj,
			cleanAttributesObject,
			blockAttributes,
			'general',
			'',
			''
		);

		expect(result).toEqual({});
		expect(getAttributeValue).not.toHaveBeenCalled();
	});

	it('should handle responsive values correctly', () => {
		getAttributeValue
			.mockReturnValueOnce('10') // responsive value for 'general'
			.mockReturnValueOnce(null) // No responsive value for 'xxl'
			.mockReturnValueOnce('8') // responsive value for 'xl'
			.mockReturnValueOnce(null) // No responsive value for 'l'
			.mockReturnValueOnce(null) // No responsive value for 'm'
			.mockReturnValueOnce('5') // responsive value for 's'
			.mockReturnValueOnce(null); // No responsive value for 'xs'

		getAttributeKey
			.mockReturnValueOnce('border-width')
			.mockReturnValueOnce('border-width-xl')
			.mockReturnValueOnce('border-width-s');

		const selectedSettingsObj = {
			styleAttrs: ['border-width'],
		};
		const cleanAttributesObject = {};
		const blockAttributes = {
			'border-width': '10',
			'border-width-xl': '8',
			'border-width-s': '5',
		};

		const result = getTempAttributes(
			selectedSettingsObj,
			cleanAttributesObject,
			blockAttributes,
			'general',
			'',
			''
		);

		expect(result).toEqual({
			'border-width': '10',
			'border-width-xl': '8',
			'border-width-s': '5',
		});
		expect(getAttributeValue).toHaveBeenCalledTimes(7);
	});

	it('should handle background layers special case (bgl sid)', () => {
		getAttributeValue
			.mockReturnValueOnce(null) // No responsive value for 'general'
			.mockReturnValueOnce(null) // No responsive value for 'xxl'
			.mockReturnValueOnce(null) // No responsive value for 'xl'
			.mockReturnValueOnce(null) // No responsive value for 'l'
			.mockReturnValueOnce(null) // No responsive value for 'm'
			.mockReturnValueOnce(null) // No responsive value for 's'
			.mockReturnValueOnce(null) // No responsive value for 'xs'
			.mockReturnValueOnce('rgba(255,255,255,1)'); // Non-responsive value

		getAttributeKey.mockReturnValue('background-color');

		const selectedSettingsObj = {
			styleAttrs: ['background-color'],
		};
		const cleanAttributesObject = {
			'background-layers': [
				{
					id: 'layer-1',
				},
			],
		};
		const blockAttributes = {
			'background-layers': [
				{
					id: 'layer-1',
					'background-color': 'rgba(255,255,255,1)',
				},
			],
		};

		const result = getTempAttributes(
			selectedSettingsObj,
			cleanAttributesObject,
			blockAttributes,
			'general',
			'',
			'bgl'
		);

		expect(result).toEqual({
			'background-layers': [
				{
					id: 'layer-1',
					'background-color': 'rgba(255,255,255,1)',
				},
			],
		});
	});

	it('should add palette attributes if forceTempPalette is true', () => {
		getPaletteAttributes.mockReturnValue({
			paletteStatus: true,
			paletteColor: 1,
			paletteOpacity: 0.8,
			color: '#ff0000',
		});

		getAttributeKey
			.mockReturnValueOnce('palette-status')
			.mockReturnValueOnce('palette-color')
			.mockReturnValueOnce('palette-opacity')
			.mockReturnValueOnce('color');

		const selectedSettingsObj = {
			styleAttrs: [],
			forceTempPalette: true,
		};
		const cleanAttributesObject = {};
		const blockAttributes = {
			'palette-status': true,
			'palette-color': 1,
			'palette-opacity': 0.8,
			color: '#ff0000',
		};

		const result = getTempAttributes(
			selectedSettingsObj,
			cleanAttributesObject,
			blockAttributes,
			'general',
			'',
			''
		);

		expect(result).toEqual({
			'palette-status': true,
			'palette-color': 1,
			'palette-opacity': 0.8,
			color: '#ff0000',
		});
		expect(getPaletteAttributes).toHaveBeenCalledWith({
			obj: blockAttributes,
			prefix: '',
			breakpoint: 'general',
		});
	});

	it('should handle forceTempPalette as a function', () => {
		getPaletteAttributes.mockReturnValue({
			paletteStatus: true,
			paletteColor: 1,
			paletteOpacity: 0.8,
			color: '#ff0000',
		});

		getAttributeKey
			.mockReturnValueOnce('palette-status')
			.mockReturnValueOnce('palette-color')
			.mockReturnValueOnce('palette-opacity')
			.mockReturnValueOnce('color');

		const mockForceTempPalette = jest.fn().mockReturnValue(true);

		const selectedSettingsObj = {
			styleAttrs: [],
			forceTempPalette: mockForceTempPalette,
		};
		const cleanAttributesObject = {};
		const blockAttributes = {
			'palette-status': true,
			'palette-color': 1,
			'palette-opacity': 0.8,
			color: '#ff0000',
		};

		const result = getTempAttributes(
			selectedSettingsObj,
			cleanAttributesObject,
			blockAttributes,
			'general',
			'',
			''
		);

		expect(mockForceTempPalette).toHaveBeenCalledWith(
			blockAttributes,
			'general',
			cleanAttributesObject
		);
		expect(result).toEqual({
			'palette-status': true,
			'palette-color': 1,
			'palette-opacity': 0.8,
			color: '#ff0000',
		});
	});

	it('should not add palette attributes that already exist in cleanAttributesObject', () => {
		getPaletteAttributes.mockReturnValue({
			paletteStatus: true,
			paletteColor: 1,
			paletteOpacity: 0.8,
			color: '#ff0000',
		});

		getAttributeKey
			.mockReturnValueOnce('palette-status')
			.mockReturnValueOnce('palette-color')
			.mockReturnValueOnce('palette-opacity')
			.mockReturnValueOnce('color');

		const selectedSettingsObj = {
			styleAttrs: [],
			forceTempPalette: true,
		};
		const cleanAttributesObject = {
			'palette-status': true,
			'palette-color': 2, // Different value in cleanAttributesObject
		};
		const blockAttributes = {
			'palette-status': true,
			'palette-color': 1,
			'palette-opacity': 0.8,
			color: '#ff0000',
		};

		const result = getTempAttributes(
			selectedSettingsObj,
			cleanAttributesObject,
			blockAttributes,
			'general',
			'',
			''
		);

		expect(result).toEqual({
			'palette-opacity': 0.8,
			color: '#ff0000',
		});
	});

	it('should use forceTempPalettePrefix if provided', () => {
		getPaletteAttributes.mockReturnValue({
			paletteStatus: true,
			paletteColor: 1,
			paletteOpacity: 0.8,
			color: '#ff0000',
		});

		getAttributeKey
			.mockReturnValueOnce('custom-palette-status')
			.mockReturnValueOnce('custom-palette-color')
			.mockReturnValueOnce('custom-palette-opacity')
			.mockReturnValueOnce('custom-color');

		const selectedSettingsObj = {
			styleAttrs: [],
			forceTempPalette: true,
			forceTempPalettePrefix: 'custom-',
		};
		const cleanAttributesObject = {};
		const blockAttributes = {
			'custom-palette-status': true,
			'custom-palette-color': 1,
			'custom-palette-opacity': 0.8,
			'custom-color': '#ff0000',
		};

		const result = getTempAttributes(
			selectedSettingsObj,
			cleanAttributesObject,
			blockAttributes,
			'general',
			'',
			''
		);

		expect(getPaletteAttributes).toHaveBeenCalledWith({
			obj: blockAttributes,
			prefix: 'custom-',
			breakpoint: 'general',
		});
		expect(getAttributeKey).toHaveBeenCalledWith(
			'palette-status',
			null,
			'custom-',
			'general'
		);
		expect(result).toEqual({
			'custom-palette-status': true,
			'custom-palette-color': 1,
			'custom-palette-opacity': 0.8,
			'custom-color': '#ff0000',
		});
	});
});
