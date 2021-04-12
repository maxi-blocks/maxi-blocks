/**
 * Wordpress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isNull } from 'lodash';

const getPaletteDefault = colorPaletteType => {
	const {
		getBlockName,
		getSelectedBlockClientId,
		getBlockAttributes,
	} = select('core/block-editor');

	if (!isNull(getSelectedBlockClientId())) {
		const currentBlockName = select('core/blocks').getBlockType(
			getBlockName(getSelectedBlockClientId())
		).name;

		const currentBlockAttr = getBlockAttributes(getSelectedBlockClientId());

		let defaultValue = '';

		if (colorPaletteType === 'typography') {
			['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(
				currentBlockAttr.textLevel
			)
				? (defaultValue = '5')
				: (defaultValue = '3');
		}

		if (colorPaletteType === 'background') {
			if (currentBlockName === 'maxi-blocks/button-maxi') {
				defaultValue = '4';
			} else {
				defaultValue = '1';
			}
		}

		return defaultValue;
	}
};

export default getPaletteDefault;
