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
			motion,
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

	const iconValue = !isObject(icon) ? JSON.parse(icon) : icon;

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			data-motion={motion}
			data-motion-id={uniqueID}
		>
			<__experimentalBackgroundDisplayer background={background} />
			{iconValue.icon && <i className={iconValue.icon} />}
		</div>
	);
};

export default save;
