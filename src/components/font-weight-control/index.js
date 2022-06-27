/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import SelectControl from '../select-control';
import { getWeightOptions } from '../typography-control/utils';
import { loadFonts } from '../../extensions/text/fonts';

const FontWeightControl = props => {
	const { onChange, fontName, fontStyle, fontWeight, breakpoint } = props;

	return (
		<SelectControl
			label={__('Font weight', 'maxi-blocks')}
			className='maxi-typography-control__weight'
			value={fontWeight}
			options={getWeightOptions(fontName)}
			onChange={val => {
				onChange(val);
				const objFont = { [fontName]: {} };

				objFont[fontName].weight = val.toString();
				if (fontStyle) objFont[fontName].style = fontStyle;

				if (breakpoint === 's' || breakpoint === 'xs') {
					const iframeEditor = document.querySelector(
						'iframe[name="editor-canvas"]'
					);
					loadFonts(objFont, true, iframeEditor.contentDocument);
				} else loadFonts(objFont);
			}}
		/>
	);
};
export default FontWeightControl;
