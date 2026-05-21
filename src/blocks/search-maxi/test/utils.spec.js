import { getIconRevealPositionSettings } from '@blocks/search-maxi/utils';

describe('getIconRevealPositionSettings', () => {
	it.each([
		[
			'left',
			{
				'input-border-left-width-general': 0,
				'input-border-right-width-general': 4,
				'input-padding-left-general': 35,
				'input-padding-right-general': 10,
			},
		],
		[
			'center',
			{
				'input-border-left-width-general': 4,
				'input-border-right-width-general': 4,
				'input-padding-left-general': 10,
				'input-padding-right-general': 10,
			},
		],
		[
			'right',
			{
				'input-border-left-width-general': 4,
				'input-border-right-width-general': 0,
				'input-padding-left-general': 10,
				'input-padding-right-general': 35,
			},
		],
	])('returns icon reveal spacing for %s position', (position, settings) => {
		expect(getIconRevealPositionSettings(position)).toEqual(settings);
	});

	it('does not return settings for unsupported positions', () => {
		expect(getIconRevealPositionSettings('top')).toBeUndefined();
	});
});
