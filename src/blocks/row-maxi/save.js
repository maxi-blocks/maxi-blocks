/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;

/**
 * Internal dependencies
 */
import { BackgroundDisplayer } from '../../components';
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
	const { uniqueID, blockStyle, extraClassName, fullWidth } = attributes;

	const classes = classnames(
		'maxi-block maxi-row-block',
		blockStyle,
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
