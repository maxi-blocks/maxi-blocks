/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import { BackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
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
			fullWidth,
			lineOrientation,
			motion,
			divider,
		},
	} = props;

	const dividerValue = !isObject(divider) ? JSON.parse(divider) : divider;
	const highlightValue = !isObject(highlight)
		? JSON.parse(highlight)
		: highlight;

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-divider-block',
		blockStyle,
		!!highlightValue.borderHighlight && 'maxi-highlight--border',
		extraClassName,
		uniqueID,
		className,
		fullWidth === 'full' ? 'alignfull' : null,
		lineOrientation === 'vertical'
			? 'maxi-divider-block--vertical'
			: 'maxi-divider-block--horizontal',
		!isNil(uniqueID) ? uniqueID : null
	);

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			data-motion={motion}
			data-motion-id={uniqueID}
		>
			<BackgroundDisplayer background={background} />
			{dividerValue.general['border-style'] !== 'none' && (
				<Fragment>
					<hr className='maxi-divider-block__divider' />
				</Fragment>
			)}
		</div>
	);
};

export default save;
