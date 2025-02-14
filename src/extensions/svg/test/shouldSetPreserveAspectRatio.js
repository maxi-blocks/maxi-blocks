import shouldSetPreserveAspectRatio from '@extensions/svg/shouldSetPreserveAspectRatio';
import { getAttributeKey } from '@extensions/styles';

jest.mock('@extensions/styles', () => ({
	getAttributeKey: jest.fn((key, _isHover, prefix, breakpoint) => {
		return `${prefix}${key}-${breakpoint}`;
	}),
}));

describe('shouldSetPreserveAspectRatio', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Returns false when no attributes provided', () => {
		expect(shouldSetPreserveAspectRatio({})).toBe(false);
	});

	it('Returns true when width-fit-content is true for any breakpoint', () => {
		const attributes = {
			'width-fit-content-m': true,
			'width-fit-content-general': false,
		};

		expect(shouldSetPreserveAspectRatio(attributes)).toBe(true);
	});

	it('Returns false when width-fit-content is false for all breakpoints', () => {
		const attributes = {
			'width-fit-content-general': false,
			'width-fit-content-xl': false,
			'width-fit-content-m': false,
		};

		expect(shouldSetPreserveAspectRatio(attributes)).toBe(false);
	});

	it('Handles custom prefix', () => {
		const attributes = {
			'custom-width-fit-content-xl': true,
		};
		const prefix = 'custom-';

		expect(shouldSetPreserveAspectRatio(attributes, prefix)).toBe(true);

		expect(getAttributeKey).toHaveBeenCalledWith(
			'width-fit-content',
			false,
			'custom-',
			'xl'
		);
	});

	it('Checks all breakpoints', () => {
		const attributes = {
			'width-fit-content-general': false,
			'width-fit-content-xxl': false,
			'width-fit-content-xl': false,
			'width-fit-content-l': false,
			'width-fit-content-m': false,
			'width-fit-content-s': false,
			'width-fit-content-xs': false,
		};

		expect(shouldSetPreserveAspectRatio(attributes)).toBe(false);

		// Verify all breakpoints were checked
		expect(getAttributeKey).toHaveBeenCalledTimes(7);
	});
});
