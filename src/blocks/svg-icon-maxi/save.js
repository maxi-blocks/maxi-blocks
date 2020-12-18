/**
 * Internal dependencies
 */
import { BackgroundDisplayer } from '../../components';

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
			defaultBlockStyle,
			background,
			extraClassName,
			content,
		},
	} = props;
	const highlight = { ...props.attributes.highlight };
	const {
		backgroundHighlight,
		borderHighlight,
		color1Highlight,
		color2Highlight,
	} = highlight;

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-svg-icon-block',
		blockStyle,
		!!backgroundHighlight && 'maxi-highlight--background',
		!!borderHighlight && 'maxi-highlight--border',
		!!color1Highlight && 'maxi-highlight--color1',
		!!color2Highlight && 'maxi-highlight--color2',
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
