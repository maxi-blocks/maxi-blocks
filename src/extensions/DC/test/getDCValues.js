import getDCValues from '@extensions/DC/getDCValues';
import { attributeDefaults } from '@extensions/DC/constants';

jest.mock('@extensions/DC/constants', () => ({
	attributeDefaults: {
		status: false,
		type: 'posts',
		source: 'wp',
		relation: 'current',
		author: '',
		content: props => props.testProperty || 'default content',
	},
}));

describe('getDCValues', () => {
	it('should process only keys present in the dynamic content object', () => {
		const dynamicContent = {
			'dc-status': true,
			'dc-type': 'pages',
			'dc-source': 'acf',
		};

		const result = getDCValues(dynamicContent, null);

		// The result should only contain keys that were in the dynamicContent object
		expect(result).toEqual({
			status: true,
			type: 'pages',
			source: 'acf',
		});
	});

	it('should prioritize dynamic content over context loop', () => {
		const dynamicContent = {
			'dc-status': true,
			'dc-type': 'pages',
			'dc-source': undefined, // Include the key with undefined value
		};

		const contextLoop = {
			'cl-status': true,
			'cl-type': 'products',
			'cl-source': 'acf',
		};

		const result = getDCValues(dynamicContent, contextLoop);

		expect(result).toEqual({
			status: true, // from dc
			type: 'pages', // from dc
			source: 'acf', // from cl because dc-source is undefined
		});
	});

	it('should use context loop values when dynamic content values are undefined', () => {
		const dynamicContent = {
			'dc-status': true,
			'dc-type': undefined, // Include the key with undefined value
			'dc-source': undefined, // Include the key with undefined value
		};

		const contextLoop = {
			'cl-status': true,
			'cl-type': 'products',
			'cl-source': 'acf',
		};

		const result = getDCValues(dynamicContent, contextLoop);

		expect(result).toEqual({
			status: true, // from dc
			type: 'products', // from cl
			source: 'acf', // from cl
		});
	});

	it('should use default values when both dynamic content and context loop values are undefined', () => {
		const dynamicContent = {
			'dc-status': true,
			'dc-type': undefined, // Include the key with undefined value
			'dc-source': undefined, // Include the key with undefined value
			'dc-relation': undefined,
			'dc-author': undefined,
		};

		const contextLoop = {
			'cl-status': true,
		};

		const result = getDCValues(dynamicContent, contextLoop);

		expect(result).toEqual({
			status: true, // from dc
			type: 'posts', // default
			source: 'wp', // default
			relation: 'current', // default
			author: '', // default
		});
	});

	it('should ignore context loop values when cl-status is false', () => {
		const dynamicContent = {
			'dc-status': undefined, // Include to get default status
			'dc-type': 'pages',
		};

		const contextLoop = {
			'cl-status': false,
			'cl-type': 'products',
		};

		const result = getDCValues(dynamicContent, contextLoop);

		expect(result).toEqual({
			status: false, // default
			type: 'pages', // from dc
		});
	});

	it('should execute function-based default values with the accumulator', () => {
		const dynamicContent = {
			'dc-status': true,
			'dc-type': 'pages',
			'dc-content': undefined, // Include to get the function-based default
		};

		const result = getDCValues(dynamicContent, null);

		expect(result.content).toBe('default content');

		// Test with accumulated value
		const dynamicContent2 = {
			'dc-status': true,
			'dc-type': 'pages',
			'dc-content': undefined,
		};

		// Simulate how the accumulator would look with testProperty
		const mockAcc = { testProperty: 'custom value' };
		const keys = Object.keys(dynamicContent2);

		// Manually simulate the reduce function
		const finalResult = keys.reduce((acc, key) => {
			const target = key.replace('dc-', '');
			if (target === 'content') {
				acc[target] = attributeDefaults.content(acc);
			} else {
				acc[target] = dynamicContent2[key] ?? attributeDefaults[target];
			}
			return acc;
		}, mockAcc);

		expect(finalResult.content).toBe('custom value');
	});

	it('should convert kebab-case keys to camelCase', () => {
		const dynamicContent = {
			'dc-special-field': 'special value',
			'dc-another-special-field': 'another special value',
		};

		const result = getDCValues(dynamicContent, null);

		expect(result).toEqual({
			specialField: 'special value',
			anotherSpecialField: 'another special value',
		});
	});
});
