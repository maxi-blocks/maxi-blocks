/**
 * Internal dependencies
 */
import { BackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { RawHTML } from '@wordpress/element';
import { isNil, isObject } from 'lodash';

/**
 * Save
 */
const save = props => {
	const {
		className,
		attributes: {
			uniqueID,
			blockStyle,
			highlight,
			defaultBlockStyle,
			background,
			extraClassName,
			content,
		},
	} = props;

	const highlightValue = !isObject(highlight)
		? JSON.parse(highlight)
		: highlight;

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-svg-icon-block',
		blockStyle,
		!!highlightValue.backgroundHighlight && 'maxi-highlight--background',
		!!highlightValue.borderHighlight && 'maxi-highlight--border',
		!!highlightValue.color1Highlight && 'maxi-highlight--color1',
		!!highlightValue.color2Highlight && 'maxi-highlight--color2',
		extraClassName,
		uniqueID,
		className,
		!isNil(uniqueID) ? uniqueID : null
	);

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			data-motion-id={uniqueID}
		>
			<RawHTML className='maxi-svg-icon-block__icon'>{content}</RawHTML>
			<BackgroundDisplayer background={background} />
		</div>
	);
};

export default save;
