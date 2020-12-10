/**
 * Internal dependencies
 */
import { __experimentalBackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { RawHTML } from '@wordpress/element';
import { isNil } from 'lodash';

/**
 * Save
 */
const save = props => {
	const {
		className,
		attributes: {
			uniqueID,
			blockStyle,
			isHighlightBackground,
			isHighlightBorder,
			isHighlightColor1,
			isHighlightColor2,
			defaultBlockStyle,
			background,
			extraClassName,
			motion,
			content,
		},
	} = props;

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-svg-icon-block',
		blockStyle,
		!!isHighlightBackground && 'maxi-highlight--background',
		!!isHighlightBorder && 'maxi-highlight--border',
		!!isHighlightColor1 && 'maxi-highlight--color1',
		!!isHighlightColor2 && 'maxi-highlight--color2',
		extraClassName,
		uniqueID,
		className,
		!isNil(uniqueID) ? uniqueID : null
	);

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			data-motion={motion}
			data-motion-id={uniqueID}
		>
			<RawHTML>{content}</RawHTML>
			<__experimentalBackgroundDisplayer background={background} />
		</div>
	);
};

export default save;
