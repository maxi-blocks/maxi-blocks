/**
 * Internal dependencies
 */
import getPaletteDefault from './getPaletteDefault';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil } from 'lodash';

const getPaletteClasses = (
	attributes,
	allowedPalettes,
	blockName,
	parentBlockStyle,
	textLevel
) => {
	const paletteClasses = classnames(
		allowedPalettes.includes('background') &&
			attributes['background-active-media'] === 'color' &&
			!attributes['palette-custom-background-color'] &&
			`maxi-sc-${parentBlockStyle}-background-color-${
				!isNil(attributes['palette-preset-background-color'])
					? attributes['palette-preset-background-color']
					: getPaletteDefault('background', blockName, textLevel)
			}`,
		allowedPalettes.includes('background-hover') &&
			attributes['background-active-media-hover'] === 'color' &&
			!attributes['palette-custom-background-hover-color'] &&
			attributes['background-status-hover'] &&
			`maxi-sc-${parentBlockStyle}-background-hover-color-${
				!isNil(attributes['palette-preset-background-hover-color'])
					? attributes['palette-preset-background-hover-color']
					: getPaletteDefault('background', blockName, textLevel)
			}`,
		allowedPalettes.includes('border') &&
			!isEmpty(attributes['border-style-general']) &&
			attributes['border-style-general'] !== 'none' &&
			!attributes['palette-custom-border-color'] &&
			`maxi-sc-${parentBlockStyle}-border-color-${
				!isNil(attributes['palette-preset-border-color'])
					? attributes['palette-preset-border-color']
					: getPaletteDefault('border', blockName, textLevel)
			}`,
		allowedPalettes.includes('border-hover') &&
			attributes['border-style-general-hover'] !== 'none' &&
			!attributes['palette-custom-border-hover-color'] &&
			attributes['border-status-hover'] &&
			`maxi-sc-${parentBlockStyle}-border-hover-color-${
				!isNil(attributes['palette-preset-border-hover-color'])
					? attributes['palette-preset-border-hover-color']
					: getPaletteDefault('border', blockName, textLevel)
			}`,
		allowedPalettes.includes('box-shadow') &&
			!isNil(attributes['box-shadow-blur-general']) &&
			!isNil(attributes['box-shadow-horizontal-general']) &&
			!isNil(attributes['box-shadow-vertical-general']) &&
			!isNil(attributes['box-shadow-spread-general']) &&
			!attributes['palette-custom-box-shadow-color'] &&
			`maxi-sc-${parentBlockStyle}-box-shadow-color-${
				!isNil(attributes['palette-preset-box-shadow-color'])
					? attributes['palette-preset-box-shadow-color']
					: getPaletteDefault('box-shadow', blockName, textLevel)
			}`,
		allowedPalettes.includes('box-shadow-hover') &&
			!attributes['palette-custom-box-shadow-hover-color'] &&
			attributes['box-shadow-status-hover'] &&
			`maxi-sc-${parentBlockStyle}-box-shadow-hover-color-${
				!isNil(attributes['palette-preset-box-shadow-hover-color'])
					? attributes['palette-preset-box-shadow-hover-color']
					: getPaletteDefault('box-shadow', blockName, textLevel)
			}`,
		allowedPalettes.includes('typography') &&
			!attributes['palette-custom-typography-color'] &&
			`maxi-sc-${parentBlockStyle}-typography-color-${
				!isNil(attributes['palette-preset-typography-color'])
					? attributes['palette-preset-typography-color']
					: getPaletteDefault('typography', blockName, textLevel)
			}`,
		allowedPalettes.includes('typography-hover') &&
			!attributes['palette-custom-typography-hover-color'] &&
			attributes['typography-status-hover'] &&
			`maxi-sc-${parentBlockStyle}-typography-hover-color-${
				!isNil(attributes['palette-preset-typography-hover-color'])
					? attributes['palette-preset-typography-hover-color']
					: getPaletteDefault('typography', blockName, textLevel)
			}`,
		allowedPalettes.includes('icon') &&
			!isEmpty(attributes['icon-name']) &&
			!attributes['palette-custom-icon-color'] &&
			`maxi-sc-${parentBlockStyle}-icon-color-${
				!isNil(attributes['palette-preset-icon-color'])
					? attributes['palette-preset-icon-color']
					: getPaletteDefault('icon', blockName, textLevel)
			}`,
		allowedPalettes.includes('divider') &&
			!isEmpty(attributes['divider-border-style']) &&
			attributes['divider-border-style'] !== 'none' &&
			!attributes['palette-custom-divider-color'] &&
			`maxi-sc-${parentBlockStyle}-divider-color-${
				!isNil(attributes['palette-preset-divider-color'])
					? attributes['palette-preset-divider-color']
					: getPaletteDefault('divider', blockName, textLevel)
			}`
	);

	return paletteClasses;
};

export default getPaletteClasses;
