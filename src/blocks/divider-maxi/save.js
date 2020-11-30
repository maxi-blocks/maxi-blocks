/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import { __experimentalBackgroundDisplayer } from '../../components';

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
			defaultBlockStyle,
			background,
			extraClassName,
			fullWidth,
			lineOrientation,
			divider,
		},
	} = props;

	const dividerValue = !isObject(divider) ? JSON.parse(divider) : divider;

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-divider-block',
		blockStyle,
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
			<__experimentalBackgroundDisplayer background={background} />
			{dividerValue.general['border-style'] !== 'none' && (
				<Fragment>
					<hr className='maxi-divider-block__divider' />
				</Fragment>
			)}
		</div>
	);
};

export default save;
