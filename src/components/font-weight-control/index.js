/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import SelectControl from '../select-control';
import getWeightOptions from '../typography-control/utils';
import { loadFontsInEditor } from '../../extensions/text/fonts';

const FontWeightControl = props => {
	const {
		onChange,
		fontName,
		fontStyle,
		fontWeight,
		defaultFontWeight,
		onReset,
	} = props;

	return (
		<SelectControl
			label={__('Font weight', 'maxi-blocks')}
			className='maxi-typography-control__weight'
			value={fontWeight}
			defaultValue={defaultFontWeight}
			options={getWeightOptions(fontName)}
			onChange={val => {
				onChange(val);
				const objFont = { [fontName]: {} };

				objFont[fontName].weight = val.toString();
				if (fontStyle) objFont[fontName].style = fontStyle;

				loadFontsInEditor(objFont);
			}}
			onReset={() => onReset()}
		/>
	);
};
export default FontWeightControl;
