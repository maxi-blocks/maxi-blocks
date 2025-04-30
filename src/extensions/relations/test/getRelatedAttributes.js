/**
 * Internal dependencies
 */
import getRelatedAttributes from '@extensions/relations/getRelatedAttributes';

describe('getRelatedAttributes', () => {
	const mockProps = {
		'border-status': true,
		'border-width-general': '2',
		'border-width-unit-general': 'px',
		'border-color-general': '#000000',
		'border-radius-general': '10',
		'border-radius-unit-general': 'px',
		'box-shadow-status': true,
		'box-shadow-color-general': '#000000',
		'box-shadow-opacity-general': 0.5,
		'box-shadow-unit-general': 'px',
		'opacity-status': true,
		'opacity-general': 0.8,
		'background-layers': [
			{
				'background-color-general': '#ffffff',
				'background-opacity-general': 1,
			},
		],
	};

	const mockIBAttributes = {
		'border-status-hover': true,
		'border-width-hover': '3',
		'border-width-unit-hover': 'px',
		'border-color-hover': '#ffffff',
		'border-radius-hover': '15',
		'border-radius-unit-hover': 'px',
		'box-shadow-status-hover': true,
		'box-shadow-color-hover': '#ffffff',
		'box-shadow-opacity-hover': 0.7,
		'box-shadow-unit-hover': 'px',
		'opacity-status-hover': true,
		'opacity-hover': 0.9,
		'background-layers': [
			{
				'background-color-hover': '#000000',
				'background-opacity-hover': 0.5,
			},
		],
	};

	const mockRelatedAttributes = ['border', 'box-shadow', 'opacity'];

	it('should return IBAttributes when no related attributes are found', () => {
		const result = getRelatedAttributes({
			props: mockProps,
			IBAttributes: mockIBAttributes,
			relatedAttributes: ['non-existent'],
		});

		expect(result).toEqual(mockIBAttributes);
	});

	it('should add related attributes from props to IBAttributes', () => {
		const result = getRelatedAttributes({
			props: mockProps,
			IBAttributes: mockIBAttributes,
			relatedAttributes: mockRelatedAttributes,
		});

		// Check that the result contains both IBAttributes and related attributes from props
		expect(result).toHaveProperty('border-status-hover', true);
		expect(result).toHaveProperty('border-width-hover', '3');
		expect(result).toHaveProperty('border-width-unit-hover', 'px');
		expect(result).toHaveProperty('border-color-hover', '#ffffff');
		expect(result).toHaveProperty('border-radius-hover', '15');
		expect(result).toHaveProperty('border-radius-unit-hover', 'px');
		expect(result).toHaveProperty('box-shadow-status-hover', true);
		expect(result).toHaveProperty('box-shadow-color-hover', '#ffffff');
		expect(result).toHaveProperty('box-shadow-opacity-hover', 0.7);
		expect(result).toHaveProperty('box-shadow-unit-hover', 'px');
		expect(result).toHaveProperty('opacity-status-hover', true);
		expect(result).toHaveProperty('opacity-hover', 0.9);
	});

	it('should handle background layers when sid is "bgl"', () => {
		const result = getRelatedAttributes({
			props: mockProps,
			IBAttributes: mockIBAttributes,
			relatedAttributes: mockRelatedAttributes,
			sid: 'bgl',
		});

		// Check that background layers are properly handled
		expect(result['background-layers']).toBeDefined();
		expect(result['background-layers'][0]).toHaveProperty(
			'background-color-hover',
			'#000000'
		);
		expect(result['background-layers'][0]).toHaveProperty(
			'background-opacity-hover',
			0.5
		);
	});

	it('should handle palette attributes correctly', () => {
		const propsWithPalette = {
			...mockProps,
			'palette-status-general': true,
			'palette-color-general': 1,
			'palette-opacity-general': 0.8,
			'color-general': '#ff0000',
		};

		const ibAttributesWithPalette = {
			...mockIBAttributes,
			'palette-status-hover': true,
			'palette-color-hover': 2,
			'palette-opacity-hover': 0.7,
			'color-hover': '#00ff00',
		};

		const result = getRelatedAttributes({
			props: propsWithPalette,
			IBAttributes: ibAttributesWithPalette,
			relatedAttributes: mockRelatedAttributes,
		});

		// Check that palette attributes are properly handled
		expect(result).toHaveProperty('palette-status-hover', true);
		expect(result).toHaveProperty('palette-color-hover', 2);
		expect(result).toHaveProperty('palette-opacity-hover', 0.7);
		expect(result).toHaveProperty('color-hover', '#00ff00');
	});

	it('should handle breakpoint-specific attributes', () => {
		const propsWithBreakpoints = {
			...mockProps,
			'border-width-xl': '4',
			'border-width-unit-xl': 'px',
			'border-color-xl': '#00ff00',
		};

		const ibAttributesWithBreakpoints = {
			...mockIBAttributes,
			'border-width-xl-hover': '5',
			'border-width-unit-xl-hover': 'px',
			'border-color-xl-hover': '#0000ff',
		};

		const result = getRelatedAttributes({
			props: propsWithBreakpoints,
			IBAttributes: ibAttributesWithBreakpoints,
			relatedAttributes: mockRelatedAttributes,
		});

		// Check that breakpoint-specific attributes are properly handled
		expect(result).toHaveProperty('border-width-xl-hover', '5');
		expect(result).toHaveProperty('border-color-xl-hover', '#0000ff');
		expect(result).toHaveProperty('border-width-unit-xl-hover', 'px');
	});

	it('should handle XXL breakpoint attributes correctly', () => {
		const propsWithXXL = {
			...mockProps,
			'border-width-xxl-hover': '6',
			'border-width-unit-xxl-hover': 'px',
		};

		const ibAttributesWithXXL = {
			...mockIBAttributes,
			'border-width-general-hover': '7',
			'border-width-unit-general-hover': 'px',
			'border-width-unit-xxl-hover': 'em',
		};

		const result = getRelatedAttributes({
			props: propsWithXXL,
			IBAttributes: ibAttributesWithXXL,
			relatedAttributes: mockRelatedAttributes,
		});

		// For XXL attributes, general IB attribute is default even if block attribute is defined
		expect(result).toHaveProperty('border-width-xxl-hover', '7');
		expect(result).toHaveProperty('border-width-unit-xxl-hover', 'em');
	});

	it('should omit null or undefined values from props but keep existing IBAttributes', () => {
		const propsWithNulls = {
			...mockProps,
			'border-width-general': null,
			'border-color-general': undefined,
		};

		const result = getRelatedAttributes({
			props: propsWithNulls,
			IBAttributes: mockIBAttributes,
			relatedAttributes: mockRelatedAttributes,
		});

		// Check that null and undefined props don't remove existing IBAttributes
		expect(result).toHaveProperty('border-width-hover', '3');
		expect(result).toHaveProperty('border-color-hover', '#ffffff');
	});

	it('should filter out hover attributes from props', () => {
		const propsWithHover = {
			...mockProps,
			'border-status-hover': true,
			'border-width-hover': '8',
			'border-width-unit-hover': 'px',
		};

		const result = getRelatedAttributes({
			props: propsWithHover,
			IBAttributes: mockIBAttributes,
			relatedAttributes: mockRelatedAttributes,
		});

		// Check that hover attributes from props are filtered out
		expect(result).toHaveProperty('border-status-hover', true);
		expect(result).toHaveProperty('border-width-hover', '3'); // From IBAttributes, not props
		expect(result).toHaveProperty('border-width-unit-hover', 'px'); // From IBAttributes, not props
	});
});
