import { loadFontsInEditor } from '../../extensions/text/fonts';

const onChangeFontWeight = (val, fontName, fontStyle) => {
	const objFont = { [fontName]: {} };

	objFont[fontName].weight = val.toString();
	if (fontStyle) objFont[fontName].style = fontStyle;

	loadFontsInEditor(objFont);
};

export default onChangeFontWeight;
