import { loadFontsInEditor } from '@extensions/text/fonts';

const onChangeFontWeight = (val, fontName, fontStyle, setShowLoader) => {
	const objFont = { [fontName]: {} };

	objFont[fontName].weight = val.toString();
	if (fontStyle) objFont[fontName].style = fontStyle;

	loadFontsInEditor(objFont, setShowLoader);
};

export default onChangeFontWeight;
