/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { ArrowDisplayer, BackgroundDisplayer } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { attributes, className } = props;
	const {
		uniqueID,
		blockStyle,
		defaultBlockStyle,
		extraClassName,
	} = attributes;

	const paletteClasses = classnames(
		// Background Color
		attributes['background-active-media'] === 'color' &&
			!attributes['palette-custom-background-color'] &&
			`maxi-sc-${
				blockStyle === 'maxi-light' ? 'light' : 'dark'
			}-background-color-${
				attributes['palette-preset-background-color']
			}`,

		attributes['background-active-media-hover'] === 'color' &&
			!attributes['palette-custom-background-hover-color'] &&
			attributes['background-status-hover'] &&
			`maxi-sc-${
				blockStyle === 'maxi-light' ? 'light' : 'dark'
			}-background-hover-color-${
				attributes['palette-preset-background-hover-color']
			}`,
		// Border Color
		attributes['border-style-general'] !== 'none' &&
			!attributes['palette-custom-border-color'] &&
			`maxi-sc-${
				blockStyle === 'maxi-light' ? 'light' : 'dark'
			}-border-color-${attributes['palette-preset-border-color']}`,

		attributes['border-style-general-hover'] !== 'none' &&
			!attributes['palette-custom-border-hover-color'] &&
			attributes['border-status-hover'] &&
			`maxi-sc-${
				blockStyle === 'maxi-light' ? 'light' : 'dark'
			}-border-hover-color-${
				attributes['palette-preset-border-hover-color']
			}`,
		// Box-Shadow Color
		!attributes['palette-custom-box-shadow-color'] &&
			`maxi-sc-${
				blockStyle === 'maxi-light' ? 'light' : 'dark'
			}-box-shadow-color-${
				attributes['palette-preset-box-shadow-color']
			}`,

		!attributes['palette-custom-box-shadow-hover-color'] &&
			attributes['box-shadow-status-hover'] &&
			`maxi-sc-${
				blockStyle === 'maxi-light' ? 'light' : 'dark'
			}-box-shadow-hover-color-${
				attributes['palette-preset-box-shadow-hover-color']
			}`
	);

	const classes = classnames(
		'maxi-motion-effect',
		'maxi-block maxi-group-block',
		!!attributes['background-highlight'] && 'maxi-highlight--background',
		!!attributes['border-highlight'] && 'maxi-highlight--border',
		blockStyle,
		paletteClasses,
		extraClassName,
		className,
		uniqueID
	);

	return (
		<Fragment>
			<section
				className={classes}
				data-gx_initial_block_class={defaultBlockStyle}
				id={uniqueID}
			>
				<ArrowDisplayer {...getGroupAttributes(attributes, 'arrow')} />
				<BackgroundDisplayer
					{...getGroupAttributes(attributes, [
						'background',
						'backgroundColor',
						'backgroundImage',
						'backgroundVideo',
						'backgroundGradient',
						'backgroundSVG',
						'backgroundHover',
						'backgroundColorHover',
						'backgroundImageHover',
						'backgroundVideoHover',
						'backgroundGradientHover',
						'backgroundSVGHover',
					])}
					blockClassName={uniqueID}
				/>
				<div className='maxi-group-block__group'>
					<InnerBlocks.Content />
				</div>
			</section>
		</Fragment>
	);
};

export default save;
