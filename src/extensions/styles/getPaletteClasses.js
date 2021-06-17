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
		allowedPalettes.includes('shape-divider-top') &&
			!attributes['palette-custom-shape-divider-top-color'] &&
			`maxi-sc-${parentBlockStyle}-shape-divider-top-color-${
				!isNil(attributes['palette-preset-shape-divider-top-color'])
					? attributes['palette-preset-shape-divider-top-color']
					: getPaletteDefault(
							'shape-divider-top',
							blockName,
							textLevel
					  )
			}`,
		allowedPalettes.includes('shape-divider-bottom') &&
			!attributes['palette-custom-shape-divider-bottom-color'] &&
			`maxi-sc-${parentBlockStyle}-shape-divider-bottom-color-${
				!isNil(attributes['palette-preset-shape-divider-bottom-color'])
					? attributes['palette-preset-shape-divider-bottom-color']
					: getPaletteDefault(
							'shape-divider-bottom',
							blockName,
							textLevel
					  )
			}`,
		allowedPalettes.includes('marker-title') &&
			!attributes['palette-custom-marker-title-color'] &&
			`maxi-sc-${parentBlockStyle}-marker-title-color-${
				!isNil(attributes['palette-preset-marker-title-color'])
					? attributes['palette-preset-marker-title-color']
					: getPaletteDefault('marker-title', blockName, textLevel)
			}`,
		allowedPalettes.includes('marker-address') &&
			!attributes['palette-custom-marker-address-color'] &&
			`maxi-sc-${parentBlockStyle}-marker-address-color-${
				!isNil(attributes['palette-preset-marker-address-color'])
					? attributes['palette-preset-marker-address-color']
					: getPaletteDefault('marker-address', blockName, textLevel)
			}`,
		allowedPalettes.includes('circle-background') &&
			!attributes['palette-custom-circle-background-color'] &&
			`maxi-sc-${parentBlockStyle}-circle-background-color-${
				!isNil(attributes['palette-preset-circle-background-color'])
					? attributes['palette-preset-circle-background-color']
					: getPaletteDefault(
							'circle-background',
							blockName,
							textLevel
					  )
			}`,
		allowedPalettes.includes('circle-bar-background') &&
			!attributes['palette-custom-circle-bar-background-color'] &&
			`maxi-sc-${parentBlockStyle}-circle-bar-background-color-${
				!isNil(attributes['palette-preset-circle-bar-background-color'])
					? attributes['palette-preset-circle-bar-background-color']
					: getPaletteDefault(
							'circle-bar-background',
							blockName,
							textLevel
					  )
			}`,
		allowedPalettes.includes('svg-background') &&
			attributes['background-active-media'] === 'svg' &&
			!attributes['palette-custom-svg-background-color'] &&
			`maxi-sc-${parentBlockStyle}-svg-background-color-${
				!isNil(attributes['palette-preset-svg-background-color'])
					? attributes['palette-preset-svg-background-color']
					: getPaletteDefault('svg-background', blockName, textLevel)
			}`,
		allowedPalettes.includes('hover-background') &&
			attributes['hover-background-active-media'] === 'color' &&
			!attributes['palette-custom-hover-background-color'] &&
			`maxi-sc-${parentBlockStyle}-hover-background-color-${
				!isNil(attributes['palette-preset-hover-background-color'])
					? attributes['palette-preset-hover-background-color']
					: getPaletteDefault(
							'hover-background',
							blockName,
							textLevel
					  )
			}`,
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
		allowedPalettes.includes('icon-hover') &&
			!attributes['palette-custom-icon-hover-color'] &&
			attributes['icon-status-hover'] &&
			`maxi-sc-${parentBlockStyle}-icon-hover-color-${
				!isNil(attributes['palette-preset-icon-hover-color'])
					? attributes['palette-preset-icon-hover-color']
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
			}`,
		allowedPalettes.includes('svgColorFill') &&
			!attributes['palette-custom-svgColorFill-color'] &&
			`maxi-sc-${parentBlockStyle}-svgColorFill-color-${
				!isNil(attributes['palette-preset-svgColorFill-color'])
					? attributes['palette-preset-svgColorFill-color']
					: getPaletteDefault('svgColorFill', blockName, textLevel)
			}`,
		allowedPalettes.includes('svgColorLine') &&
			!attributes['palette-custom-svgColorLine-color'] &&
			`maxi-sc-${parentBlockStyle}-svgColorLine-color-${
				!isNil(attributes['palette-preset-svgColorLine-color'])
					? attributes['palette-preset-svgColorLine-color']
					: getPaletteDefault('svgColorLine', blockName, textLevel)
			}`
	);

	return paletteClasses;
};

export default getPaletteClasses;
