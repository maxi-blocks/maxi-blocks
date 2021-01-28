/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;

/**
 * Internal dependencies
 */
import BackgroundDisplayer from '../../components/background-displayer/newBackgroundDisplayer';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * Save
 */
const save = props => {
	const { attributes, className } = props;
	const {
		uniqueID,
		blockStyle,
		extraClassName,
		defaultBlockStyle,
	} = attributes;

	const classes = classnames(
		'maxi-block maxi-column-block',
		blockStyle,
		extraClassName,
		className,
		!isNil(uniqueID) ? uniqueID : null
	);

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
		>
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
