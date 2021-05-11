/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BackgroundDisplayer } from '../../components';
import { getGroupAttributes, getPaletteClasses } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { className, attributes } = props;
	const { uniqueID, blockStyle, extraClassName, parentBlockStyle } =
		attributes;

	const classes = classnames(
		'maxi-motion-effect',
		'maxi-block maxi-svg-icon-block',
		blockStyle,
		getPaletteClasses(
			attributes,
			[
				'background',
				'background-hover',
				'border',
				'border-hover',
				'box-shadow',
				'box-shadow-hover',
				'svgColorFill',
				'svgColorLine',
			],
			'maxi-blocks/svg-icon-maxi',
			parentBlockStyle
		),
		extraClassName,
		uniqueID,
		className
	);

	return (
		<div className={classes} id={uniqueID}>
			<RawHTML className='maxi-svg-icon-block__icon'>
				{attributes.content}
			</RawHTML>
			<BackgroundDisplayer
				{...getGroupAttributes(attributes, [
					'background',
					'backgroundColor',
					'backgroundHover',
					'backgroundColorHover',
				])}
				blockClassName={uniqueID}
			/>
		</div>
	);
};

export default save;
