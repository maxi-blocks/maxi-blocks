import { getIndicatorStyle } from '../utils';

describe('block indicators utils', () => {
	it('keeps regular margin indicators outside the block', () => {
		expect(
			getIndicatorStyle({
				type: 'margin',
				dir: 'top',
				value: 24,
				unit: 'px',
				isOverflowHidden: false,
			})
		).toMatchObject({
			height: '24px',
			top: '-24px',
		});
	});

	it('keeps margin indicators inside overflow-hidden blocks so they are not clipped', () => {
		expect(
			getIndicatorStyle({
				type: 'margin',
				dir: 'top',
				value: 24,
				unit: 'px',
				isOverflowHidden: true,
			})
		).toMatchObject({
			height: '24px',
			top: 0,
		});
	});

	it('keeps horizontal padding indicators pinned to the block edge', () => {
		expect(
			getIndicatorStyle({
				type: 'padding',
				dir: 'right',
				value: 16,
				unit: 'px',
			})
		).toMatchObject({
			width: '16px',
			right: '1px',
		});
	});
});
