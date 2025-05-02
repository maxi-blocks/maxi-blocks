/**
 * Internal dependencies
 */
import getHoverStatus from '@extensions/relations/getHoverStatus';

describe('getHoverStatus', () => {
	const mockBlockAttributes = {
		'border-status-hover': true,
		'box-shadow-status-hover': false,
		'opacity-status-hover': true,
	};

	const mockRelationAttributes = {
		'border-status': true,
		'box-shadow-status': false,
		'opacity-status': true,
	};

	it('should return the value from blockAttributes when hoverProp is a string', () => {
		const result = getHoverStatus(
			'border-status-hover',
			mockBlockAttributes,
			mockRelationAttributes
		);
		expect(result).toBe(true);
	});

	it('should return undefined when hoverProp is a string and property does not exist', () => {
		const result = getHoverStatus(
			'non-existent-prop',
			mockBlockAttributes,
			mockRelationAttributes
		);
		expect(result).toBeUndefined();
	});

	it('should execute the function when hoverProp is a function', () => {
		const hoverFunction = (blockAttrs, relationAttrs) =>
			blockAttrs['border-status-hover'] && relationAttrs['border-status'];

		const result = getHoverStatus(
			hoverFunction,
			mockBlockAttributes,
			mockRelationAttributes
		);
		expect(result).toBe(true);
	});

	it('should return false when function returns false', () => {
		const hoverFunction = () => false;
		const result = getHoverStatus(
			hoverFunction,
			mockBlockAttributes,
			mockRelationAttributes
		);
		expect(result).toBe(false);
	});

	it('should handle function that uses both blockAttributes and relationAttributes', () => {
		const hoverFunction = (blockAttrs, relationAttrs) =>
			blockAttrs['opacity-status-hover'] &&
			relationAttrs['opacity-status'];

		const result = getHoverStatus(
			hoverFunction,
			mockBlockAttributes,
			mockRelationAttributes
		);
		expect(result).toBe(true);
	});

	it('should handle function that returns false when attributes do not match', () => {
		const hoverFunction = (blockAttrs, relationAttrs) =>
			blockAttrs['box-shadow-status-hover'] &&
			relationAttrs['box-shadow-status'];

		const result = getHoverStatus(
			hoverFunction,
			mockBlockAttributes,
			mockRelationAttributes
		);
		expect(result).toBe(false);
	});
});
