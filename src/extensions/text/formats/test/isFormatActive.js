/**
 * WordPress dependencies
 */
import { getActiveFormat } from '@wordpress/rich-text';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Internal dependencies
 */
import isFormatActive from '@extensions/text/formats/isFormatActive';

jest.mock('@wordpress/rich-text', () => ({
	getActiveFormat: jest.fn(),
}));

jest.mock('lodash', () => ({
	isNil: jest.fn(value => value === null || value === undefined),
}));

describe('isFormatActive', () => {
	beforeEach(() => {
		getActiveFormat.mockClear();
		isNil.mockClear();
	});

	it('Returns true when format is active and matches type', () => {
		const formatValue = {
			/* mock format value */
		};
		const formatName = 'custom/test-format';

		getActiveFormat.mockReturnValue({
			type: 'custom/test-format',
		});

		const result = isFormatActive(formatValue, formatName);

		expect(getActiveFormat).toHaveBeenCalledWith(formatValue, formatName);
		expect(result).toBe(true);
	});

	it('Returns false when format is active but type does not match', () => {
		const formatValue = {
			/* mock format value */
		};
		const formatName = 'custom/test-format';

		getActiveFormat.mockReturnValue({
			type: 'custom/different-format',
		});

		const result = isFormatActive(formatValue, formatName);

		expect(getActiveFormat).toHaveBeenCalledWith(formatValue, formatName);
		expect(result).toBe(false);
	});

	it('Returns false when no active format is found', () => {
		const formatValue = {
			/* mock format value */
		};
		const formatName = 'custom/test-format';

		getActiveFormat.mockReturnValue(null);

		const result = isFormatActive(formatValue, formatName);

		expect(getActiveFormat).toHaveBeenCalledWith(formatValue, formatName);
		expect(result).toBe(false);
	});

	it('Returns false when active format is undefined', () => {
		const formatValue = {
			/* mock format value */
		};
		const formatName = 'custom/test-format';

		getActiveFormat.mockReturnValue(undefined);

		const result = isFormatActive(formatValue, formatName);

		expect(getActiveFormat).toHaveBeenCalledWith(formatValue, formatName);
		expect(result).toBe(false);
	});
});
