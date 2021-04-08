/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';

/**
 * Save
 */
const save = props => {
	const { className, attributes } = props;
	const {
		uniqueID,
		blockStyle,
		defaultBlockStyle,
		extraClassName,
		linkSettings,
		buttonContent,
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
			}`,
		// Icon Color
		!isEmpty(attributes['icon-name']) &&
			!attributes['palette-custom-icon-color'] &&
			`maxi-sc-${
				blockStyle === 'maxi-light' ? 'light' : 'dark'
			}-icon-color-${attributes['palette-preset-icon-color']}`
	);

	const classes = classnames(
		'maxi-motion-effect',
		'maxi-block maxi-button-block',
		blockStyle,
		paletteClasses,
		extraClassName,
		uniqueID,
		className
	);

	const linkOpt = !isNil(linkSettings) && linkSettings;

	const linkProps = {
		...linkOpt,
		href: linkOpt.url || '',
		target: linkOpt.opensInNewTab ? '_blank' : '_self',
	};

	const buttonClasses = classnames(
		'maxi-button-block__button',
		attributes['icon-position'] === 'left' &&
			'maxi-button-block__button--icon-left',
		attributes['icon-position'] === 'right' &&
			'maxi-button-block__button--icon-right'
	);

	return (
		<div className={classes} id={uniqueID}>
			<Button
				className={buttonClasses}
				{...(!isEmpty(linkProps.href) && linkProps)}
			>
				{!isEmpty(attributes['icon-name']) && (
					<i className={attributes['icon-name']} />
				)}
				<span className='maxi-button-block__content'>
					{buttonContent}
				</span>
			</Button>
		</div>
	);
};

export default save;
