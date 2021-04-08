/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BackgroundDisplayer } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil } from 'lodash';

/**
 * Save
 */
const save = props => {
	const { className, attributes } = props;
	const {
		uniqueID,
		blockStyle,
		defaultBlockStyle,
		fullWidth,
		extraClassName,
		textLevel,
		isList,
		typeOfList,
		content,
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
		!isEmpty(attributes['border-style-general']) &&
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
		!isNil(attributes['box-shadow-blur-general']) &&
			!isNil(attributes['box-shadow-horizontal-general']) &&
			!isNil(attributes['box-shadow-vertical-general']) &&
			!isNil(attributes['box-shadow-spread-general']) &&
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
			}`,
		// Typography Color
		!attributes['palette-custom-typography-color'] &&
			`maxi-sc-${
				blockStyle === 'maxi-light' ? 'light' : 'dark'
			}-typography-color-${
				attributes['palette-preset-typography-color']
			}`,

		!attributes['palette-custom-typography-hover-color'] &&
			attributes['typography-status-hover'] &&
			`maxi-sc-${
				blockStyle === 'maxi-light' ? 'light' : 'dark'
			}-typography-hover-color-${
				attributes['palette-preset-typography-hover-color']
			}`
	);

	const classes = classnames(
		'maxi-motion-effect',
		'maxi-block maxi-text-block',
		'maxi-text-block-wrap',
		blockStyle,
		paletteClasses,
		extraClassName,
		uniqueID,
		className,
		fullWidth === 'full' ? 'alignfull' : null
	);

	return (
		<Fragment>
			<div className={classes} id={uniqueID}>
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
				<RichText.Content
					className='maxi-text-block__content'
					value={content}
					tagName={isList ? typeOfList : textLevel}
					data-gx_initial_block_class={defaultBlockStyle}
				/>
			</div>
		</Fragment>
	);
};

export default save;
