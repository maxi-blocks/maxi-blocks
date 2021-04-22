/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

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
	const { attributes, className } = props;
	const {
		uniqueID,
		blockStyle,
		extraClassName,
		fullWidth,
		clientId,
	} = attributes;

	const classes = classnames(
		'maxi-block maxi-row-block',
		blockStyle,
		getPaletteClasses(
			attributes,
			blockStyle,
			[
				'background',
				'background-hover',
				'border',
				'border-hover',
				'box-shadow',
				'box-shadow-hover',
			],
			'',
			clientId
		),
		extraClassName,
		className,
		uniqueID,
		fullWidth === 'full' ? 'alignfull' : null
	);

	return (
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
			/>
			<InnerBlocks.Content />
		</div>
	);
};

export default save;
