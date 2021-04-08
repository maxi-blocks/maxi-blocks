/**
 * WordPress dependencies
 */
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
	const { attributes, className } = props;
	const {
		uniqueID,
		blockStyle,
		fullWidth,
		extraClassName,
		lineOrientation,
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
			}`
	);

	const classes = classnames(
		'maxi-motion-effect',
		'maxi-block maxi-divider-block',
		blockStyle,
		!!attributes['border-highlight'] && 'maxi-highlight--border',
		paletteClasses,
		extraClassName,
		uniqueID,
		className,
		fullWidth === 'full' ? 'alignfull' : null,
		lineOrientation === 'vertical'
			? 'maxi-divider-block--vertical'
			: 'maxi-divider-block--horizontal'
	);

	return (
		<div className={classes} id={uniqueID}>
			{!attributes['background-highlight'] && (
				<BackgroundDisplayer
					{...getGroupAttributes(attributes, [
						'background',
						'backgroundColor',
						'backgroundGradient',
						'backgroundHover',
						'backgroundColorHover',
						'backgroundGradientHover',
					])}
					blockClassName={uniqueID}
				/>
			)}
			{attributes['divider-border-style'] !== 'none' && (
				<Fragment>
					<hr className='maxi-divider-block__divider' />
				</Fragment>
			)}
		</div>
	);
};

export default save;
