/**
 * Internal dependencies
 */
import getCLAttributes from '@extensions/DC/getCLAttributes';
import { attributeDefaults } from '@extensions/DC/constants';

jest.mock('lodash', () => ({
	isFunction: jest.fn(val => typeof val === 'function'),
	isNil: jest.fn(val => val === null || val === undefined),
}));

jest.mock('@extensions/DC/constants', () => ({
	attributeDefaults: {
		status: false,
		source: 'wp',
		type: 'posts',
		relation: 'by-id',
		'order-by': 'by-date',
		order: jest.fn(attributes => {
			const dictionary = {
				'by-date': 'desc',
				alphabetical: 'asc',
			};
			const relation =
				attributes?.relation ?? attributes?.['cl-relation'];
			const orderBy = attributes?.orderBy ?? attributes?.['cl-order-by'];

			if (
				[
					'by-category',
					'by-author',
					'by-tag',
					'current-archive',
				].includes(relation)
			) {
				return dictionary[orderBy];
			}
			return dictionary[relation];
		}),
		accumulator: 0,
	},
}));

describe('getCLAttributes', () => {
	it('should return the input value when it is not nil', () => {
		const contextLoop = {
			'cl-status': true,
			'cl-source': 'custom',
			'cl-type': 'custom-type',
		};

		const result = getCLAttributes(contextLoop);

		expect(result).toEqual({
			'cl-status': true,
			'cl-source': 'custom',
			'cl-type': 'custom-type',
		});
	});

	it('should use default value when input value is nil', () => {
		const contextLoop = {
			'cl-status': undefined,
			'cl-source': null,
			'cl-type': undefined,
		};

		const result = getCLAttributes(contextLoop);

		expect(result).toEqual({
			'cl-status': false,
			'cl-source': 'wp',
			'cl-type': 'posts',
		});
	});

	it('should call function default with contextLoop when default is a function', () => {
		const contextLoop = {
			'cl-order': undefined,
			'cl-relation': 'by-author',
			'cl-order-by': 'by-date',
		};

		const result = getCLAttributes(contextLoop);

		expect(result['cl-order']).toBe('desc');
		expect(attributeDefaults.order).toHaveBeenCalledWith(contextLoop);
	});

	it('should handle mixed nil and non-nil values', () => {
		const contextLoop = {
			'cl-status': true,
			'cl-source': undefined,
			'cl-type': 'custom-type',
			'cl-relation': undefined,
		};

		const result = getCLAttributes(contextLoop);

		expect(result).toEqual({
			'cl-status': true,
			'cl-source': 'wp',
			'cl-type': 'custom-type',
			'cl-relation': 'by-id',
		});
	});

	it('should handle empty input object', () => {
		const contextLoop = {};
		const result = getCLAttributes(contextLoop);
		expect(result).toEqual({});
	});
});
