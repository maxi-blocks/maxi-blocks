/**
 * Internal dependencies
 */
import { __experimentalBackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

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
			icon,
		},
	} = props;

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-font-icon-block',
		blockStyle,
		extraClassName,
		uniqueID,
		className
	);

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			data-motion-id={uniqueID}
		>
			<__experimentalBackgroundDisplayer background={background} />
			{icon.icon && (
				<span className='maxi-font-icon-block__icon'>
					<i className={icon.icon} />
				</span>
			)}
		</div>
	);
};

export default save;
