/**
 * Returns an array with font-weight
 */
import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { isNil } from 'lodash';

const getWeightOptions = fontFamily => {
	const { getFont } = select('maxiBlocks/text');

	if (!isNil(fontFamily)) {
		const fontFiles = getFont(fontFamily)?.files;
		const fontOptions = fontFiles
			? Object.keys(fontFiles).map(key => key)
			: [];

		if (fontOptions.length === 0) {
			return [
				{ label: __('Hairline (100)', 'maxi-blocks'), value: 100 },
				{
					label: __('Extra light (200)', 'maxi-blocks'),
					value: 200,
				},
				{ label: __('Light (300)', 'maxi-blocks'), value: 300 },
				{
					label: __('Regular (400)', 'maxi-blocks'),
					value: 400,
				},
				{ label: __('Medium (500)', 'maxi-blocks'), value: 500 },
				{
					label: __('Semi bold (600)', 'maxi-blocks'),
					value: 600,
				},
				{ label: __('Bold (700)', 'maxi-blocks'), value: 700 },
				{
					label: __('Extra bold (800)', 'maxi-blocks'),
					value: 800,
				},
				{ label: __('Heavy (900)', 'maxi-blocks'), value: 900 },
				{
					label: __('Extra heavy (950)', 'maxi-blocks'),
					value: 950,
				},
			];
		}
		const weightOptions = {
			100: 'Hairline (100)',
			200: 'Extra light (200)',
			300: 'Light (300)',
			400: 'Regular (400)',
			500: 'Medium (500)',
			600: 'Semi bold (600)',
			700: 'Bold (700)',
			800: 'Extra bold (800)',
			900: 'Heavy (900)',
			950: 'Extra heavy (950)',
		};
		const response = [];
		if (!fontOptions.includes('900')) {
			fontOptions.push('900');
		}
		fontOptions.forEach(weight => {
			const weightOption = {};
			if (weightOptions[weight]) {
				weightOption.label = __(weightOptions[weight], 'maxi-blocks');
				weightOption.value = weight;
				response.push(weightOption);
			}
		});
		return response;
	}
	return null;
};

export default getWeightOptions;
