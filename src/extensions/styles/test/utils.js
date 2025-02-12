import {
	getIsValid,
	validateOriginValue,
	getParallaxLayers,
	splitValueAndUnit,
	getRelations,
	getBreakpointFromAttribute,
	getAttrKeyWithoutBreakpoint,
	attrExistsOnResponsive,
	getTransitionTimingFunction,
	isValidNumber,
} from '../utils';

describe('utils', () => {
	describe('getIsValid', () => {
		it('Returns true when cleaned is false regardless of value', () => {
			expect(getIsValid(null, false)).toBe(true);
			expect(getIsValid(undefined, false)).toBe(true);
			expect(getIsValid('', false)).toBe(true);
		});

		// Might be good to make it always return boolean, but should be a separate issue for this
		it('Validates different types when cleaned is true', () => {
			// Test truthy values
			expect(getIsValid('test', true)).toBe('test');
			expect(getIsValid(42, true)).toBe(42);
			expect(getIsValid(true, true)).toBe(true);
			expect(getIsValid(false, true)).toBe(true);

			// Test empty but valid values
			expect(getIsValid('', true)).toBe(true);
			expect(getIsValid([], true)).toEqual([]);

			// Test invalid values
			expect(getIsValid(null, true)).toBe(false);
			expect(getIsValid(undefined, true)).toBe(false);
		});
	});

	describe('validateOriginValue', () => {
		it('Handles numeric strings and valid position words', () => {
			// Test numeric strings
			expect(validateOriginValue('42')).toBe(42);
			expect(validateOriginValue('-10.5')).toBe(-10.5);

			// Test valid position words
			expect(validateOriginValue('top')).toBe('top');
			expect(validateOriginValue('center')).toBe('center');
			expect(validateOriginValue('middle')).toBe('middle');
		});

		it('Returns false for invalid values', () => {
			// Test non-string numbers
			expect(validateOriginValue(42)).toBe(false);

			// Test invalid strings
			expect(validateOriginValue('invalid')).toBe(false);
			expect(validateOriginValue('12px')).toBe(NaN);

			// Test other invalid types
			expect(validateOriginValue(null)).toBe(false);
			expect(validateOriginValue(undefined)).toBe(false);
		});
	});

	describe('getParallaxLayers', () => {
		it('Returns empty object when bgLayers is empty or invalid', () => {
			expect(getParallaxLayers('test-id', null)).toEqual({});
			expect(getParallaxLayers('test-id', [])).toEqual({});
			expect(getParallaxLayers('test-id', undefined)).toEqual({});
		});

		it('Filters and returns parallax image layers', () => {
			const bgLayers = [
				{
					type: 'image',
					'background-image-parallax-status': true,
					url: 'image1.jpg',
				},
				{
					type: 'image',
					'background-image-parallax-status': false,
					url: 'image2.jpg',
				},
				{
					type: 'video',
					'background-image-parallax-status': true,
					url: 'video.mp4',
				},
			];

			const expected = {
				'test-id': [
					{
						type: 'image',
						'background-image-parallax-status': true,
						url: 'image1.jpg',
					},
				],
			};

			expect(getParallaxLayers('test-id', bgLayers)).toEqual(expected);
		});
	});

	describe('splitValueAndUnit', () => {
		it('Splits value and unit correctly', () => {
			expect(splitValueAndUnit('100px')).toEqual({
				value: 100,
				unit: 'px',
			});
			expect(splitValueAndUnit('50%')).toEqual({ value: 50, unit: '%' });
			expect(splitValueAndUnit('1.5rem')).toEqual({
				value: 1.5,
				unit: 'rem',
			});
			expect(splitValueAndUnit('-10em')).toEqual({
				value: -10,
				unit: 'em',
			});
		});
	});

	describe('getRelations', () => {
		const uniqueID = 'test-123';

		it('Returns null for empty relations', () => {
			expect(getRelations(uniqueID, [])).toBeNull();
			expect(getRelations(uniqueID, null)).toBeNull();
			expect(getRelations(uniqueID, undefined)).toBeNull();
		});

		it('Adds uniqueID to trigger for non-button relations', () => {
			const relations = [
				{ trigger: '', isButton: false },
				{ trigger: '', isButton: false },
			];

			const expected = [
				{ trigger: 'test-123', isButton: false },
				{ trigger: 'test-123', isButton: false },
			];

			expect(getRelations(uniqueID, relations)).toEqual(expected);
		});

		it('Adds uniqueID and button class to trigger for button relations', () => {
			const relations = [
				{ trigger: '', isButton: true },
				{ trigger: '', isButton: false },
			];

			const expected = [
				{
					trigger: 'test-123 .maxi-button-block__button',
					isButton: true,
				},
				{ trigger: 'test-123', isButton: false },
			];

			expect(getRelations(uniqueID, relations)).toEqual(expected);
		});

		it('Does not modify original relations array', () => {
			const originalRelations = [{ trigger: '', isButton: true }];
			const relationsCopy = [...originalRelations];

			getRelations(uniqueID, originalRelations);

			expect(originalRelations).toEqual(relationsCopy);
		});
	});

	describe('getBreakpointFromAttribute', () => {
		it('Returns correct breakpoint from attribute key', () => {
			// Basic breakpoint cases
			expect(getBreakpointFromAttribute('test-general')).toBe('general');
			expect(getBreakpointFromAttribute('test-xl')).toBe('xl');
			expect(getBreakpointFromAttribute('test-s')).toBe('s');

			// Hover cases
			expect(getBreakpointFromAttribute('test-xxl-hover')).toBe('xxl');
			expect(getBreakpointFromAttribute('test-s-hover')).toBe('s');
		});

		it('Returns false for invalid breakpoints', () => {
			// No breakpoint
			expect(getBreakpointFromAttribute('test')).toBe(false);

			// Invalid breakpoint
			expect(getBreakpointFromAttribute('test-invalid')).toBe(false);
			expect(getBreakpointFromAttribute('test-lg')).toBe(false);

			// Invalid format
			expect(getBreakpointFromAttribute('')).toBe(false);
		});
	});

	describe('getAttrKeyWithoutBreakpoint', () => {
		it('Removes breakpoint from attribute key', () => {
			// Basic cases
			expect(getAttrKeyWithoutBreakpoint('test-general')).toBe('test');
			expect(getAttrKeyWithoutBreakpoint('test-xl')).toBe('test');
			expect(getAttrKeyWithoutBreakpoint('padding-s')).toBe('padding');

			// Hover cases
			expect(getAttrKeyWithoutBreakpoint('test-xl-hover')).toBe(
				'test-hover'
			);
			expect(getAttrKeyWithoutBreakpoint('padding-s-hover')).toBe(
				'padding-hover'
			);

			// Multiple dashes
			expect(getAttrKeyWithoutBreakpoint('margin-top-general')).toBe(
				'margin-top'
			);
			expect(getAttrKeyWithoutBreakpoint('border-top-width-xl')).toBe(
				'border-top-width'
			);
		});

		it('Returns original key when no valid breakpoint found', () => {
			expect(getAttrKeyWithoutBreakpoint('test')).toBe('test');
			expect(getAttrKeyWithoutBreakpoint('test-invalid')).toBe(
				'test-invalid'
			);
			expect(getAttrKeyWithoutBreakpoint('test-lg')).toBe('test-lg');
		});
	});

	describe('attrExistsOnResponsive', () => {
		const attributes = {
			'padding-general': 10,
			'padding-xl': 20,
			'padding-m': 15,
			'padding-s': null,
			'margin-top-xl-hover': 30,
			'margin-top-m-hover': 25,
		};

		it('Detects attributes on responsive breakpoints', () => {
			// Test with non-hover attribute
			expect(
				attrExistsOnResponsive(attributes, 'padding-general', 'xxl')
			).toBe(true);

			// Test with hover attribute
			expect(
				attrExistsOnResponsive(attributes, 'margin-top-xl-hover', 'xxl')
			).toBe(true);
		});

		it('Returns false when attribute only exists on base or general breakpoint', () => {
			const limitedAttributes = {
				'padding-general': 10,
				'padding-xxl': 20,
			};

			expect(
				attrExistsOnResponsive(
					limitedAttributes,
					'padding-general',
					'xxl'
				)
			).toBe(false);
		});

		it('Returns false when attribute does not exist on any responsive breakpoint', () => {
			expect(
				attrExistsOnResponsive(attributes, 'width-general', 'xxl')
			).toBe(false);
		});
	});

	describe('getTransitionTimingFunction', () => {
		it('Returns easing value when not cubic-bezier', () => {
			expect(getTransitionTimingFunction('ease-in', [0.5, 0, 1, 1])).toBe(
				'ease-in'
			);
			expect(getTransitionTimingFunction('linear', null)).toBe('linear');
		});

		it('Returns "ease" when cubic-bezier but no values provided', () => {
			expect(getTransitionTimingFunction('cubic-bezier', null)).toBe(
				'ease'
			);
			expect(getTransitionTimingFunction('cubic-bezier', undefined)).toBe(
				'ease'
			);
		});

		it('Returns formatted cubic-bezier with rounded values', () => {
			expect(
				getTransitionTimingFunction(
					'cubic-bezier',
					[0.25, 0.1, 0.25, 1]
				)
			).toBe('cubic-bezier(0.25,0.1,0.25,1)');

			// Test rounding
			expect(
				getTransitionTimingFunction(
					'cubic-bezier',
					[0.33333, 0.66666, 0.12345, 0.98765]
				)
			).toBe('cubic-bezier(0.3333,0.6667,0.1235,0.9877)');
		});
	});

	describe('isValidNumber', () => {
		it('Validates different number formats', () => {
			// Valid numbers
			expect(isValidNumber(42)).toBe(true);
			expect(isValidNumber(-10.5)).toBe(true);
			expect(isValidNumber('123')).toBe(true);
			expect(isValidNumber('-0.5')).toBe(true);

			// Invalid numbers
			expect(isValidNumber(Infinity)).toBe(false);
			expect(isValidNumber(NaN)).toBe(false);
			expect(isValidNumber('abc')).toBe(false);
			expect(isValidNumber('12px')).toBe(false);
			expect(isValidNumber(undefined)).toBe(false);
			expect(isValidNumber(null)).toBe(false);
		});
	});
});
