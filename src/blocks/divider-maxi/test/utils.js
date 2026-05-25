import { getDividerEditClasses } from '../utils';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(store => {
		if (store === 'core/block-editor') {
			return {
				getBlockAttributes: jest.fn(),
				getSelectedBlockClientId: jest.fn(),
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}

		if (store === 'maxiBlocks') {
			return {
				receiveBaseBreakpoint: jest.fn(() => 'xl'),
				receiveMaxiDeviceType: jest.fn(() => 'm'),
			};
		}

		return {};
	}),
}));

describe('divider-maxi utils', () => {
	it('uses the current breakpoint orientation for editor classes', () => {
		const attributes = {
			uniqueID: 'divider-maxi-test-u',
			lineOrientation: 'vertical',
			'line-orientation-general': 'horizontal',
			'line-orientation-s': 'vertical',
		};

		expect(getDividerEditClasses(attributes, 's')).toContain(
			'maxi-divider-block--vertical'
		);
		expect(getDividerEditClasses(attributes, 'm')).toContain(
			'maxi-divider-block--horizontal'
		);
		expect(getDividerEditClasses(attributes, 'm')).toContain(
			'maxi-divider-block__resizer__divider-maxi-test-u'
		);
	});
});
