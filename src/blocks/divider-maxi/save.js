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
			fullWidth,
			lineOrientation,
		},
	} = props;
	const divider = { ...props.attributes.divider };
	const highlight = { ...props.attributes.highlight };

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-divider-block',
		blockStyle,
		!!highlight.borderHighlight && 'maxi-highlight--border',
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
			data-motion-id={uniqueID}
		>
			<BackgroundDisplayer background={background} />
			{divider.general['border-style'] !== 'none' && (
				<Fragment>
					<hr className='maxi-divider-block__divider' />
				</Fragment>
			)}
		</div>
	);
};

export default save;
