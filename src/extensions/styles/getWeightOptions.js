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
				{ label: __('Thin (Hairline)', 'maxi-blocks'), value: 100 },
				{
					label: __('Extra Light (Ultra Light)', 'maxi-blocks'),
					value: 200,
				},
				{ label: __('Light', 'maxi-blocks'), value: 300 },
				{
					label: __('Normal (Regular)', 'maxi-blocks'),
					value: 400,
				},
				{ label: __('Medium', 'maxi-blocks'), value: 500 },
				{
					label: __('Semi Bold (Semi Bold)', 'maxi-blocks'),
					value: 600,
				},
				{ label: __('Bold', 'maxi-blocks'), value: 700 },
				{
					label: __('Extra Bold (Ultra Bold)', 'maxi-blocks'),
					value: 800,
				},
				{ label: __('Black (Heavy)', 'maxi-blocks'), value: 900 },
				{
					label: __('Extra Black (Ultra Black)', 'maxi-blocks'),
					value: 950,
				},
			];
		}
		const weightOptions = {
			100: 'Thin (Hairline)',
			200: 'Extra Light (Ultra Light)',
			300: 'Light',
			400: 'Normal (Regular)',
			500: 'Medium',
			600: 'Semi Bold (Semi Bold)',
			700: 'Bold',
			800: 'Extra Bold (Ultra Bold)',
			900: 'Black (Heavy)',
			950: 'Extra Black (Ultra Black)',
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
