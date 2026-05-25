import { getDividerEditClasses, syncDividerResizerSize } from '../utils';

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

	it('syncs stale resizer DOM styles to the current breakpoint size', () => {
		const resizable = document.createElement('div');
		resizable.style.width = '9.43396%';
		resizable.style.height = '100%';

		const updateSize = jest.fn();
		const resizableObject = {
			current: {
				state: {
					width: '9.43396%',
					height: '100%',
				},
				resizable,
				updateSize,
			},
		};

		const didSync = syncDividerResizerSize(resizableObject, {
			'width-general': 20,
			'width-unit-general': 'px',
			'height-general': 100,
			'height-unit-general': '%',
			'force-aspect-ratio-general': false,
		});

		expect(didSync).toBe(true);
		expect(updateSize).toHaveBeenCalledWith({
			width: '20px',
			height: '100%',
		});
		expect(resizable.style.width).toBe('20px');
		expect(resizable.style.height).toBe('100%');
	});
});
