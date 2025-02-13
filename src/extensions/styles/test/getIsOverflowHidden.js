import { getIsOverflowHidden } from '../getIsOverflowHidden';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

jest.mock('../getLastBreakpointAttribute', () =>
	jest.fn(
		({ target, breakpoint, attributes }) =>
			attributes[`${target}-${breakpoint}`]
	)
);

describe('getIsOverflowHidden', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Returns true when both overflow-x and overflow-y are hidden', () => {
		const attributes = {
			'overflow-x-general': 'hidden',
			'overflow-y-general': 'hidden',
		};
		const breakpoint = 'general';

		const result = getIsOverflowHidden(attributes, breakpoint);

		expect(result).toBe(true);
		expect(getLastBreakpointAttribute).toHaveBeenCalledTimes(2);
		expect(getLastBreakpointAttribute).toHaveBeenNthCalledWith(1, {
			target: 'overflow-y',
			breakpoint,
			attributes,
		});
		expect(getLastBreakpointAttribute).toHaveBeenNthCalledWith(2, {
			target: 'overflow-x',
			breakpoint,
			attributes,
		});
	});

	it('Returns false when overflow-y is not hidden', () => {
		const attributes = {
			'overflow-x-general': 'hidden',
			'overflow-y-general': 'visible',
		};
		const breakpoint = 'general';

		const result = getIsOverflowHidden(attributes, breakpoint);

		expect(result).toBe(false);
	});

	it('Returns false when overflow-x is not hidden', () => {
		const attributes = {
			'overflow-x-general': 'auto',
			'overflow-y-general': 'hidden',
		};
		const breakpoint = 'general';

		const result = getIsOverflowHidden(attributes, breakpoint);

		expect(result).toBe(false);
	});

	it('Returns false when both overflows are not hidden', () => {
		const attributes = {
			'overflow-x-general': 'auto',
			'overflow-y-general': 'visible',
		};
		const breakpoint = 'general';

		const result = getIsOverflowHidden(attributes, breakpoint);

		expect(result).toBe(false);
	});

	it('Returns false when overflow values are undefined', () => {
		const attributes = {};
		const breakpoint = 'general';

		const result = getIsOverflowHidden(attributes, breakpoint);

		expect(result).toBe(false);
	});
});
