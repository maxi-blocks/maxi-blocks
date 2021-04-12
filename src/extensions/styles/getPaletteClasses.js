/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil } from 'lodash';

const getPaletteClasses = (attributes, blockStyle, allowedPalettes) => {
	const {
		getBlockAttributes,
		getBlockParents,
		getSelectedBlockClientId,
	} = select('core/block-editor');

	const parentStyles = getBlockAttributes(
		getBlockParents(getSelectedBlockClientId())[0]
	);

	const getBlockStyle = () => {
		switch (blockStyle) {
			case 'maxi-light':
			case 'light':
				return 'light';
			case 'maxi-dark':
			case 'dark':
				return 'dark';
			case 'maxi-parent': {
				return isNil(parentStyles)
					? 'dark'
					: parentStyles.blockStyle === 'maxi-light' ||
					  parentStyles.blockStyle === 'light'
					? 'light'
					: 'dark';
			}
			default:
				return 'light';
		}
	};

	const paletteClasses = classnames(
		allowedPalettes.includes('background') &&
			attributes['background-active-media'] === 'color' &&
			!attributes['palette-custom-background-color'] &&
			`maxi-sc-${getBlockStyle()}-background-color-${
				attributes['palette-preset-background-color']
			}`,
		allowedPalettes.includes('background-hover') &&
			attributes['background-active-media-hover'] === 'color' &&
			!attributes['palette-custom-background-hover-color'] &&
			attributes['background-status-hover'] &&
			`maxi-sc-${getBlockStyle()}-background-hover-color-${
				attributes['palette-preset-background-hover-color']
			}`,
		allowedPalettes.includes('border') &&
			!isEmpty(attributes['border-style-general']) &&
			attributes['border-style-general'] !== 'none' &&
			!attributes['palette-custom-border-color'] &&
			`maxi-sc-${getBlockStyle()}-border-color-${
				attributes['palette-preset-border-color']
			}`,
		allowedPalettes.includes('border-hover') &&
			attributes['border-style-general-hover'] !== 'none' &&
			!attributes['palette-custom-border-hover-color'] &&
			attributes['border-status-hover'] &&
			`maxi-sc-${getBlockStyle()}-border-hover-color-${
				attributes['palette-preset-border-hover-color']
			}`,
		allowedPalettes.includes('box-shadow') &&
			!isNil(attributes['box-shadow-blur-general']) &&
			!isNil(attributes['box-shadow-horizontal-general']) &&
			!isNil(attributes['box-shadow-vertical-general']) &&
			!isNil(attributes['box-shadow-spread-general']) &&
			!attributes['palette-custom-box-shadow-color'] &&
			`maxi-sc-${getBlockStyle()}-box-shadow-color-${
				attributes['palette-preset-box-shadow-color']
			}`,
		allowedPalettes.includes('box-shadow-hover') &&
			!attributes['palette-custom-box-shadow-hover-color'] &&
			attributes['box-shadow-status-hover'] &&
			`maxi-sc-${getBlockStyle()}-box-shadow-hover-color-${
				attributes['palette-preset-box-shadow-hover-color']
			}`,
		allowedPalettes.includes('typography') &&
			!attributes['palette-custom-typography-color'] &&
			`maxi-sc-${getBlockStyle()}-typography-color-${
				attributes['palette-preset-typography-color']
			}`,
		allowedPalettes.includes('typography-hover') &&
			!attributes['palette-custom-typography-hover-color'] &&
			attributes['typography-status-hover'] &&
			`maxi-sc-${getBlockStyle()}-typography-hover-color-${
				attributes['palette-preset-typography-hover-color']
			}`,
		allowedPalettes.includes('icon') &&
			!isEmpty(attributes['icon-name']) &&
			!attributes['palette-custom-icon-color'] &&
			`maxi-sc-${getBlockStyle()}-icon-color-${
				attributes['palette-preset-icon-color']
			}`
	);

	return paletteClasses;
};

export default getPaletteClasses;
