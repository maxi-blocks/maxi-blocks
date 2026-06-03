import {
	getDividerEditClasses,
	getDividerOrientation,
	syncDividerResizerSize,
} from '../utils';
import dividerOrientationMigrator from '../dividerOrientationMigrator';

jest.mock('@components/maxi-block', () => ({
	MaxiBlock: { save: jest.fn() },
	getMaxiBlockAttributes: jest.fn(() => ({})),
}));

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

	describe('getDividerOrientation', () => {
		it('returns the breakpoint value when it exists', () => {
			expect(
				getDividerOrientation(
					{ 'line-orientation-general': 'vertical' },
					'general'
				)
			).toBe('vertical');
		});

		it('falls back to legacy lineOrientation for old blocks', () => {
			expect(
				getDividerOrientation(
					{ lineOrientation: 'vertical' },
					'general'
				)
			).toBe('vertical');
		});

		it('defaults to horizontal when both are missing', () => {
			expect(getDividerOrientation({}, 'general')).toBe('horizontal');
		});

		it('prefers breakpoint value over legacy lineOrientation', () => {
			expect(
				getDividerOrientation(
					{
						lineOrientation: 'vertical',
						'line-orientation-general': 'horizontal',
					},
					'general'
				)
			).toBe('horizontal');
		});
	});

	it('falls back to legacy lineOrientation for editor classes', () => {
		const attributes = {
			uniqueID: 'divider-maxi-legacy-u',
			lineOrientation: 'vertical',
		};

		expect(getDividerEditClasses(attributes, 'general')).toContain(
			'maxi-divider-block--vertical'
		);
	});

	describe('dividerOrientationMigrator', () => {
		it('is always eligible', () => {
			expect(dividerOrientationMigrator.isEligible({})).toBe(true);
		});

		it('copies lineOrientation to line-orientation-general', () => {
			const attrs = { lineOrientation: 'vertical' };
			const result = dividerOrientationMigrator.migrate(attrs);

			expect(result['line-orientation-general']).toBe('vertical');
			expect(result.lineOrientation).toBeUndefined();
		});

		it('leaves attributes unchanged when lineOrientation is absent', () => {
			const attrs = { 'line-orientation-general': 'horizontal' };
			const result = dividerOrientationMigrator.migrate({ ...attrs });

			expect(result['line-orientation-general']).toBe('horizontal');
			expect(result.lineOrientation).toBeUndefined();
		});

		it('declares legacy lineOrientation attribute for parsing', () => {
			const extra = dividerOrientationMigrator.attributes();

			expect(extra).toHaveProperty('lineOrientation');
			expect(extra.lineOrientation.type).toBe('string');
		});
	});
});
